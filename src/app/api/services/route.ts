import { NextResponse } from 'next/server';
import { db, services } from '@/db';
import { desc, asc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all services (public)
export async function GET() {
  try {
    const allServices = await db.select().from(services).orderBy(asc(services.order));
    return NextResponse.json(allServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST - Create new service (admin only)
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
      validateRequired(body, ['key', 'title']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Validate key format (should be lowercase, alphanumeric with hyphens)
    const keyRegex = /^[a-z0-9-]+$/;
    if (!keyRegex.test(body.key)) {
      return NextResponse.json(
        { error: 'Service key must be lowercase alphanumeric with hyphens only' },
        { status: 400 }
      );
    }
    
    const newService = await db.insert(services).values({
      key: body.key,
      title: body.title,
      titleEn: body.titleEn,
      description: body.description,
      descriptionEn: body.descriptionEn,
      icon: body.icon || 'Plane',
      gradient: body.gradient || 'from-blue-500 to-cyan-400',
      bgLight: body.bgLight || 'bg-blue-50',
      iconBg: body.iconBg || 'bg-blue-500',
      link: body.link,
      isActive: body.isActive ?? true,
      order: body.order || 0,
    }).returning();
    
    return NextResponse.json(newService[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    
    // Handle unique constraint violation (duplicate key)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A service with this key already exists' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
