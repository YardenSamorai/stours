import { NextResponse } from 'next/server';
import { db, categories } from '@/db';
import { asc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateRequired, ValidationError } from '@/lib/validation';

// GET - Fetch all categories (public)
export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(asc(categories.order));
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create new category (admin only)
export async function POST(request: Request) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    try {
      validateRequired(body, ['title']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    const newCategory = await db.insert(categories).values({
      title: body.title,
      titleEn: body.titleEn,
      image: body.image,
      link: body.link,
      isActive: body.isActive ?? true,
      order: body.order || 0,
    }).returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: (error as ValidationError).statusCode });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
