import { NextResponse } from 'next/server';
import { db, blogPosts } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all blog posts (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    
    let query = db.select().from(blogPosts);
    
    if (publishedOnly) {
      query = query.where(eq(blogPosts.isPublished, true)) as typeof query;
    }
    
    const posts = await query.orderBy(desc(blogPosts.createdAt));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST - Create new blog post (admin only)
export async function POST(request: Request) {
  try {
    // Require authentication
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate required fields
    try {
      validateRequired(body, ['title', 'content']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0590-\u05FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const newPost = await db.insert(blogPosts).values({
      slug,
      title: body.title,
      titleEn: body.titleEn,
      excerpt: body.excerpt,
      excerptEn: body.excerptEn,
      content: body.content,
      contentEn: body.contentEn,
      image: body.image,
      authorName: body.authorName || 'S-Tours',
      authorImage: body.authorImage,
      category: body.category,
      categoryEn: body.categoryEn,
      tags: body.tags,
      tagsEn: body.tagsEn,
      metaTitle: body.metaTitle,
      metaTitleEn: body.metaTitleEn,
      metaDescription: body.metaDescription,
      metaDescriptionEn: body.metaDescriptionEn,
      isPublished: body.isPublished ?? false,
      publishedAt: body.isPublished ? new Date() : null,
    }).returning();
    
    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
