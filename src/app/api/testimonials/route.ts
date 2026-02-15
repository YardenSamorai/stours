import { NextResponse } from 'next/server';
import { db, testimonials } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { validateRating, validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all testimonials
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let query = db.select().from(testimonials);
    
    if (activeOnly) {
      query = query.where(eq(testimonials.isActive, true)) as typeof query;
    }
    
    const allTestimonials = await query.orderBy(desc(testimonials.createdAt));
    return NextResponse.json(allTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST - Create new testimonial
export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate required fields
    try {
      validateRequired(body, ['name', 'text']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Validate rating if provided
    const rating = body.rating ?? 5;
    if (!validateRating(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }
    
    const newTestimonial = await db.insert(testimonials).values({
      name: body.name,
      nameEn: body.nameEn,
      role: body.role,
      roleEn: body.roleEn,
      avatar: body.avatar,
      rating: rating,
      text: body.text,
      textEn: body.textEn,
      destination: body.destination,
      destinationEn: body.destinationEn,
      isActive: body.isActive ?? true,
      order: body.order,
    }).returning();
    
    return NextResponse.json(newTestimonial[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
