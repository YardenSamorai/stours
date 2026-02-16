import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all site settings or specific setting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const group = searchParams.get('group');

    if (key) {
      // Get specific setting by key
      const setting = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json({ value: null, valueEn: null });
      }

      return NextResponse.json({
        key: setting[0].key,
        value: setting[0].value,
        valueEn: setting[0].valueEn,
        type: setting[0].type,
        group: setting[0].group,
        label: setting[0].label,
      });
    }

    if (group) {
      // Get all settings in a group
      const settings = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.group, group));

      const result: Record<string, { value: string | null; valueEn: string | null }> = {};
      settings.forEach((s) => {
        result[s.key] = { value: s.value, valueEn: s.valueEn };
      });

      return NextResponse.json(result);
    }

    // Get all settings
    const allSettings = await db.select().from(siteSettings);
    const result: Record<string, { value: string | null; valueEn: string | null }> = {};
    allSettings.forEach((s) => {
      result[s.key] = { value: s.value, valueEn: s.valueEn };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// PUT - Update or create site settings
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAuth();
    if (authError) {
      return authError;
    }

    const body = await request.json();

    if (!body.settings || typeof body.settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { settings: { key: { value, valueEn } } }' },
        { status: 400 }
      );
    }

    const updates = [];
    for (const [key, data] of Object.entries(body.settings)) {
      if (!data || typeof data !== 'object') continue;

      const settingData = data as { value?: string; valueEn?: string; type?: string; group?: string; label?: string };

      // Check if setting exists
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        await db
          .update(siteSettings)
          .set({
            value: settingData.value !== undefined ? settingData.value : existing[0].value,
            valueEn: settingData.valueEn !== undefined ? settingData.valueEn : existing[0].valueEn,
            type: settingData.type || existing[0].type,
            group: settingData.group || existing[0].group,
            label: settingData.label || existing[0].label,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.key, key));
      } else {
        // Create new
        await db.insert(siteSettings).values({
          key,
          value: settingData.value || null,
          valueEn: settingData.valueEn || null,
          type: settingData.type || 'text',
          group: settingData.group || 'general',
          label: settingData.label || key,
        });
      }

      updates.push(key);
    }

    return NextResponse.json({
      success: true,
      updated: updates,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
