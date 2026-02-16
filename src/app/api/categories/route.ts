import { NextResponse } from 'next/server';
import { db, categories } from '@/db';
import { asc, eq } from 'drizzle-orm';
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

    // Generate slug if not provided
    let slug = body.slug;
    if (!slug) {
      // Create slug from title (Hebrew or English)
      const baseTitle = body.titleEn || body.title;
      slug = baseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure uniqueness by appending number if needed
      let uniqueSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, uniqueSlug))
          .limit(1);
        if (existing.length === 0) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const newCategory = await db.insert(categories).values({
      title: body.title,
      titleEn: body.titleEn,
      slug: slug,
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
