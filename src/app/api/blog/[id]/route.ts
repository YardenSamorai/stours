import { NextResponse } from 'next/server';
import { db, blogPosts } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateId, ValidationError } from '@/lib/validation';

// GET - Fetch single blog post (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if id is a number (id) or string (slug)
    const isNumericId = /^\d+$/.test(id);
    
    let post;
    if (isNumericId) {
      // Validate numeric ID
      let postId: number;
      try {
        postId = validateId(id);
      } catch (error) {
        if (error instanceof ValidationError) {
          return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        throw error;
      }
      post = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
    } else {
      // Slug lookup
      post = await db.select().from(blogPosts).where(eq(blogPosts.slug, id));
    }
    
    if (!post.length) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    // Increment views count
    await db.update(blogPosts)
      .set({ viewsCount: (post[0].viewsCount || 0) + 1 })
      .where(eq(blogPosts.id, post[0].id));
    
    return NextResponse.json(post[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PATCH - Update blog post (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    
    // Validate ID format (must be numeric for updates)
    let postId: number;
    try {
      postId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };
    
    // If publishing for the first time, set publishedAt
    if (body.isPublished && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }
    
    const updatedPost = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, postId))
      .returning();
    
    if (!updatedPost.length) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost[0]);
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE - Delete blog post (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const { id } = await params;
    
    // Validate ID format
    let postId: number;
    try {
      postId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deletedPost = await db.delete(blogPosts)
      .where(eq(blogPosts.id, postId))
      .returning();
    
    if (!deletedPost.length) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
