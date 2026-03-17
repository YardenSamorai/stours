import { NextResponse } from 'next/server';
import { db, teamMembers } from '@/db';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { validateId, ValidationError } from '@/lib/validation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let memberId: number;
    try {
      memberId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    const member = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId));

    if (!member.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(member[0]);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const { id } = await params;
    let memberId: number;
    try {
      memberId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const updated = await db.update(teamMembers)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(teamMembers.id, memberId))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const { id } = await params;
    let memberId: number;
    try {
      memberId = validateId(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    const deleted = await db.delete(teamMembers)
      .where(eq(teamMembers.id, memberId))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
