import { NextResponse } from 'next/server';
import { db, testimonials } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateId, validateRating, ValidationError } from '@/lib/validation';

// GET - Fetch single testimonial (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    let testimonialId: number;
    try {
      testimonialId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const testimonial = await db.select().from(testimonials).where(eq(testimonials.id, testimonialId));
    
    if (!testimonial.length) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    return NextResponse.json(testimonial[0]);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PATCH - Update testimonial (admin only)
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
    
    // Validate ID format
    let testimonialId: number;
    try {
      testimonialId = validateId(id);
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

    // Validate rating if provided
    if (body.rating !== undefined && !validateRating(body.rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }
    
    const updatedTestimonial = await db.update(testimonials)
      .set(body)
      .where(eq(testimonials.id, testimonialId))
      .returning();
    
    if (!updatedTestimonial.length) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTestimonial[0]);
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE - Delete testimonial (admin only)
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
    let testimonialId: number;
    try {
      testimonialId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    
    const deletedTestimonial = await db.delete(testimonials)
      .where(eq(testimonials.id, testimonialId))
      .returning();
    
    if (!deletedTestimonial.length) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
