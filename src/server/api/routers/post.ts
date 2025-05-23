import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to ensure user is admin
function ensureAdmin(user: { role: string }) {
  if (user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
}

export const postRouter = createTRPCRouter({
  // Simple hello procedure for testing
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Public endpoints (for blog visitors)
  getAllPublished: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(12),
      page: z.number().min(1).default(1),
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 12;
      const page = input?.page ?? 1;
      const skip = (page - 1) * limit;

      const [posts, totalCount] = await Promise.all([
        ctx.db.post.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: limit,
          skip,
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.post.count({
          where: { published: true },
        }),
      ]);

      return {
        posts,
        totalCount,
        hasMore: skip + limit < totalCount,
        nextPage: skip + limit < totalCount ? page + 1 : null,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
          published: true,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // Admin-only endpoints
  getAllForAdmin: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      page: z.number().min(1).default(1),
      published: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const limit = input?.limit ?? 20;
      const page = input?.page ?? 1;
      const skip = (page - 1) * limit;

      const where = input?.published !== undefined
        ? { published: input.published }
        : {};

      const [posts, totalCount] = await Promise.all([
        ctx.db.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.post.count({ where }),
      ]);

      return {
        posts,
        totalCount,
        hasMore: skip + limit < totalCount,
        nextPage: skip + limit < totalCount ? page + 1 : null,
      };
    }),

  getByIdForAdmin: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      published: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const slug = generateSlug(input.title);

      // Check if slug already exists
      const existingPost = await ctx.db.post.findUnique({
        where: { slug },
      });

      if (existingPost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this title already exists",
        });
      }

      return ctx.db.post.create({
        data: {
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt,
          featuredImage: input.featuredImage,
          published: input.published,
          publishedAt: input.published ? new Date() : null,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1, "Title is required").optional(),
      content: z.string().min(1, "Content is required").optional(),
      excerpt: z.string().optional(),
      featuredImage: z.string().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const { id, title, ...updateData } = input;
      let slug: string | undefined;

      // Generate new slug if title is being updated
      if (title) {
        slug = generateSlug(title);

        // Check if slug already exists (excluding current post)
        const existingPost = await ctx.db.post.findFirst({
          where: {
            slug,
            NOT: { id },
          },
        });

        if (existingPost) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this title already exists",
          });
        }
      }

      // If publishing for the first time, set publishedAt
      const currentPost = await ctx.db.post.findUnique({
        where: { id },
        select: { published: true },
      });

      const finalUpdateData = {
        ...updateData,
        ...(title && { title, slug }),
        ...(input.published && !currentPost?.published && { publishedAt: new Date() }),
      };

      return ctx.db.post.update({
        where: { id },
        data: finalUpdateData,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      await ctx.db.post.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  togglePublish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.session.user);

      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const newPublishedState = !post.published;

      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          published: newPublishedState,
          publishedAt: newPublishedState ? new Date() : null,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  // Stats for admin dashboard
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      ensureAdmin(ctx.session.user);

      const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
        ctx.db.post.count(),
        ctx.db.post.count({ where: { published: true } }),
        ctx.db.post.count({ where: { published: false } }),
      ]);

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
      };
    }),
});
