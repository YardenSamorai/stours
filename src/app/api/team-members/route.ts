import { NextResponse } from 'next/server';
import { db, teamMembers } from '@/db';
import { asc, eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateRequired, ValidationError } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = db.select().from(teamMembers);

    if (activeOnly) {
      query = query.where(eq(teamMembers.isActive, true)) as typeof query;
    }

    const members = await query.orderBy(asc(teamMembers.order));
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

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
      validateRequired(body, ['name']);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    const newMember = await db.insert(teamMembers).values({
      name: body.name,
      nameEn: body.nameEn,
      role: body.role,
      roleEn: body.roleEn,
      image: body.image,
      isActive: body.isActive ?? true,
      order: body.order ?? 0,
    }).returning();

    return NextResponse.json(newMember[0], { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
