import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

export const authConfig = {
  providers: [
    GoogleProvider,
    CredentialsProvider({
      name: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Credentials received:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@yourblog.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        console.log("🔑 Expected credentials:", {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });

        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          console.log("✅ Credentials match, checking database...");

          try {
            let adminUser = await db.user.findUnique({
              where: { email: ADMIN_EMAIL },
            });

            if (!adminUser) {
              console.log("👤 Creating new admin user...");
              adminUser = await db.user.create({
                data: {
                  email: ADMIN_EMAIL,
                  name: "Admin",
                  role: "ADMIN",
                },
              });
            }

            console.log("🎉 Authentication successful:", adminUser);
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            };
          } catch (error) {
            console.error("💥 Database error:", error);
            return null;
          }
        }

        console.log("❌ Credentials don't match");
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@yourblog.com";

        if (user.email !== ADMIN_EMAIL) {
          return false;
        }

        await db.user.upsert({
          where: { email: user.email },
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
            role: "ADMIN",
          },
          update: {
            name: user.name,
            image: user.image,
            role: "ADMIN",
          },
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };
    },
  },
  pages: {
    signIn: "/admin/login",
  },
} satisfies NextAuthConfig;
