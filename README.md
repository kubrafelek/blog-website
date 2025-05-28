# 🚀 Professional Blog Website - Admin-Only System

A modern, professional blog platform built with Next.js, designed for single-admin usage with comprehensive content management capabilities.

## ✨ Features

### 🔐 **Admin Authentication**

- **NextAuth Integration**: Secure authentication with multiple providers
- **Credentials Login**: Email/password authentication
- **Google OAuth**: Single-click sign-in (admin email only)
- **Role-based Access**: Admin-only system with automatic role validation

### 📝 **Content Management**

- **Rich Post Editor**: Markdown-supported content creation
- **Image Upload**: Featured image support with preview
- **Draft System**: Save posts as drafts before publishing
- **Post Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Bulk Actions**: Publish/unpublish posts with one click

### 🎨 **User Interface**

- **Admin Dashboard**: Comprehensive overview with statistics
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full dark theme support
- **Professional Design**: Clean, modern interface with Tailwind CSS

### 🌐 **Public Blog**

- **Beautiful Blog Display**: Responsive grid layout
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **SEO Optimized**: Proper meta tags and structured data
- **Fast Loading**: Optimized images and performance

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Typography plugin
- **API**: tRPC for type-safe APIs
- **Markdown**: React Markdown with GitHub-flavored markdown
- **Image Optimization**: Next.js Image component
- **Type Safety**: TypeScript throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (required for Prisma)
- PostgreSQL database
- Git

### Installation

1. **Clone and Setup**

   ```bash
   cd fullstack
   npm install
   ```

2. **Environment Configuration**

   Create `.env` file with these variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/fullstack"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"

   # Admin Credentials
   ADMIN_EMAIL="admin@yourblog.com"
   ADMIN_PASSWORD="admin123"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Database Setup**

   ```bash
   # Create database (if not exists)
   createdb fullstack

   # Apply schema
   npx prisma db push

   # Generate Prisma client
   npx prisma generate
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   Visit:

   - **Blog**: http://localhost:3000
   - **Admin Login**: http://localhost:3000/admin/login
   - **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 📖 Usage Guide

### 🔑 **Admin Access**

#### Default Credentials

- **Email**: `admin@yourblog.com`
- **Password**: `admin123`

#### Google OAuth

Configure your Google OAuth app to allow only your admin email address.

### 📝 **Creating Posts**

1. **Login** to admin panel
2. **Navigate** to Dashboard → "Create New Post"
3. **Fill in details**:
   - Title (required)
   - Content (required, Markdown supported)
   - Excerpt (optional, for previews)
   - Featured Image (URL or upload)
4. **Choose status**: Draft or Published
5. **Save** your post

### 🎯 **Managing Content**

#### Dashboard Features

- **Statistics**: Total posts, published, drafts
- **Recent Posts**: Quick access to latest content
- **Quick Actions**: Direct links to create/manage posts

#### Post Management

- **View All Posts**: Filter by published/draft status
- **Edit Posts**: Full editing capabilities
- **Publish/Unpublish**: Toggle post visibility
- **Delete Posts**: Remove unwanted content
- **Preview**: View posts as visitors see them

### 🎨 **Markdown Support**

Our editor supports full Markdown formatting:

```markdown
# Heading 1

## Heading 2

### Heading 3

**Bold text**
_Italic text_

- Unordered list

1. Ordered list

[Link text](https://example.com)
![Image alt](image-url)

> Blockquote

`Inline code`

`code block`

| Table | Header |
| ----- | ------ |
| Cell  | Data   |
```

## 🏗 Architecture

### Database Schema

```sql
-- Core Models
User (Admin only)
├── id (String, CUID)
├── email (Unique)
├── name
├── role (ADMIN)
└── posts (Relation)

Post
├── id (Int, Auto-increment)
├── title (String)
├── slug (Unique, Auto-generated)
├── content (Text, Markdown)
├── excerpt (Optional)
├── featuredImage (Optional URL)
├── published (Boolean)
├── publishedAt (DateTime)
├── createdAt (DateTime)
├── updatedAt (DateTime)
└── createdBy (User relation)
```

### API Endpoints (tRPC)

#### Public Routes

- `post.getAllPublished` - Get published posts with pagination
- `post.getBySlug` - Get single post by slug
- `post.hello` - Health check endpoint

#### Admin Routes (Protected)

- `post.getAllForAdmin` - Get all posts with filters
- `post.getByIdForAdmin` - Get post by ID for editing
- `post.create` - Create new post
- `post.update` - Update existing post
- `post.delete` - Delete post
- `post.togglePublish` - Publish/unpublish post
- `post.getStats` - Get admin dashboard statistics

### Page Structure

```
/                     # Public blog homepage
/posts               # Published posts listing
/posts/[slug]        # Individual blog post
/admin/login         # Admin authentication
/admin/dashboard     # Admin overview
/admin/posts         # Post management
/admin/posts/new     # Create new post
/admin/posts/[id]/edit # Edit existing post
```

## 🔒 Security Features

- **Admin-only Access**: Automatic role validation
- **Protected Routes**: Server-side authentication checks
- **CSRF Protection**: Built-in NextAuth security
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Prevention**: Sanitized Markdown rendering

## 🚀 Production Deployment

### Environment Variables (Production)

```env
# Use strong, unique values in production
NEXTAUTH_SECRET="generate-a-strong-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
ADMIN_EMAIL="your-real-admin-email@domain.com"
ADMIN_PASSWORD="use-a-strong-password"
DATABASE_URL="your-production-database-url"
```

### Deployment Checklist

- [ ] Set up production PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up domain and SSL certificate
- [ ] Configure Google OAuth for production domain
- [ ] Test admin access and functionality
- [ ] Set up database backups
- [ ] Monitor performance and errors

## 📁 Project Structure

```
fullstack/
├── src/
│   ├── app/
│   │   ├── _components/     # Reusable React components
│   │   ├── admin/           # Admin panel pages
│   │   ├── posts/           # Public blog pages
│   │   ├── api/             # API routes
│   │   └── layout.tsx       # Root layout
│   ├── server/
│   │   ├── api/             # tRPC routers
│   │   ├── auth/            # NextAuth configuration
│   │   └── db.ts            # Database connection
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── styles/
│       └── globals.css      # Global styles
├── prisma/
│   └── schema.prisma        # Database schema
├── public/
│   └── images/              # Static image assets
└── package.json
```

## 🤝 Contributing

This is a single-admin blog system. For feature requests or modifications:

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

#### Database Connection

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Verify database exists
psql -l | grep fullstack
```

#### Node.js Version

```bash
# Check Node version (must be 18+)
node --version

# Upgrade if needed
brew install node@20
```

#### Prisma Issues

```bash
# Reset and regenerate
npx prisma generate
npx prisma db push
```

### Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the GitHub issues
3. Create a new issue with detailed description

---

**Built with ❤️ using modern web technologies for a seamless blogging experience.**
