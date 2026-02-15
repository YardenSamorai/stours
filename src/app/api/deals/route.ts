import { NextResponse } from 'next/server';
import { db, deals } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateRequired, validatePrice, ValidationError } from '@/lib/validation';

// GET - Fetch all deals (public)
export async function GET() {
  try {
    const allDeals = await db.select().from(deals).orderBy(desc(deals.createdAt));
    return NextResponse.json(allDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

// POST - Create new deal (admin only)
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
      validateRequired(body, ['title', 'destination', 'price']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Validate price
    if (!validatePrice(body.price)) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    // Validate originalPrice if provided
    if (body.originalPrice && !validatePrice(body.originalPrice)) {
      return NextResponse.json({ error: 'Original price must be a positive number' }, { status: 400 });
    }
    
    const newDeal = await db.insert(deals).values({
      title: body.title,
      titleEn: body.titleEn,
      destination: body.destination,
      destinationEn: body.destinationEn,
      country: body.country,
      countryEn: body.countryEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      price: body.price,
      originalPrice: body.originalPrice,
      currency: body.currency || 'ILS',
      nights: body.nights,
      image: body.image,
      images: body.images,
      tag: body.tag,
      tagEn: body.tagEn,
      tagColor: body.tagColor,
      departureDate: body.departureDate ? new Date(body.departureDate) : null,
      returnDate: body.returnDate ? new Date(body.returnDate) : null,
      includes: body.includes,
      includesEn: body.includesEn,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      order: body.order,
    }).returning();
    
    return NextResponse.json(newDeal[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating deal:', error);
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
