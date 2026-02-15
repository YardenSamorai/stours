import { NextRequest, NextResponse } from 'next/server';
import { db, sectionSettings } from '@/db';
import { eq } from 'drizzle-orm';

// GET - Fetch all section settings or by key
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    
    if (key) {
      const settings = await db.select().from(sectionSettings)
        .where(eq(sectionSettings.sectionKey, key));
      
      if (!settings.length) {
        // Return default settings if not found
        return NextResponse.json({
          sectionKey: key,
          isVisible: true,
          gridCols: 3,
          maxItems: 6,
        });
      }
      
      return NextResponse.json(settings[0]);
    }
    
    const allSettings = await db.select().from(sectionSettings);
    return NextResponse.json(allSettings);
  } catch (error) {
    console.error('Error fetching section settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST - Create or update section settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if settings exist for this section
    const existing = await db.select().from(sectionSettings)
      .where(eq(sectionSettings.sectionKey, body.sectionKey));
    
    if (existing.length) {
      // Update existing
      const updated = await db.update(sectionSettings)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(sectionSettings.sectionKey, body.sectionKey))
        .returning();
      
      return NextResponse.json(updated[0]);
    }
    
    // Create new
    const newSettings = await db.insert(sectionSettings).values({
      sectionKey: body.sectionKey,
      isVisible: body.isVisible ?? true,
      title: body.title,
      titleEn: body.titleEn,
      subtitle: body.subtitle,
      subtitleEn: body.subtitleEn,
      badge: body.badge,
      badgeEn: body.badgeEn,
      gridCols: body.gridCols || 3,
      maxItems: body.maxItems || 6,
      backgroundColor: body.backgroundColor,
    }).returning();
    
    return NextResponse.json(newSettings[0], { status: 201 });
  } catch (error) {
    console.error('Error saving section settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
