# Image Directory Structure

This directory contains organized folders for different types of images used throughout the blog application.

## Directory Structure

```
public/images/
├── blog/          # Blog post featured images
├── avatars/       # User profile pictures
├── gallery/       # General gallery images
└── README.md      # This file
```

## Usage Guidelines

### Blog Images (`/images/blog/`)

- **Purpose**: Featured images for blog posts
- **Recommended size**: 800x450px (16:9 aspect ratio)
- **Format**: JPG, PNG, WebP
- **Naming convention**: Use descriptive names (e.g., `nextjs-tutorial-hero.jpg`)
- **Usage**: Reference in blog posts as `/images/blog/filename.jpg`

### Avatar Images (`/images/avatars/`)

- **Purpose**: User profile pictures and author avatars
- **Recommended size**: 128x128px (square)
- **Format**: JPG, PNG, WebP
- **Naming convention**: Use user ID or username (e.g., `user-123.jpg`)
- **Usage**: Reference in user profiles as `/images/avatars/filename.jpg`

### Gallery Images (`/images/gallery/`)

- **Purpose**: General purpose images for pages, backgrounds, etc.
- **Size**: Variable based on usage
- **Format**: JPG, PNG, WebP, SVG
- **Usage**: Reference as `/images/gallery/filename.jpg`

## Optimization Tips

1. **Compress images** before uploading to reduce file sizes
2. **Use Next.js Image component** for automatic optimization
3. **Provide alt text** for accessibility
4. **Consider WebP format** for better compression
5. **Use responsive images** with multiple sizes when needed

## Example Usage in Components

```tsx
import Image from 'next/image';

// Blog featured image
<Image
  src="/images/blog/my-post-hero.jpg"
  alt="Blog post description"
  width={800}
  height={450}
  className="w-full rounded-lg"
/>

// User avatar
<Image
  src="/images/avatars/user-123.jpg"
  alt="User name"
  width={48}
  height={48}
  className="rounded-full"
/>
```
