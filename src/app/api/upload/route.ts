import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

// Check if Vercel Blob is available
const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const uniqueName = `${timestamp}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    // ── Strategy 1: Vercel Blob (production) ──
    if (hasVercelBlob) {
      try {
        const { put } = await import('@vercel/blob');
        const filename = `uploads/${uniqueName}`;
        const blob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: false,
        });
        return NextResponse.json({
          url: blob.url,
          filename: blob.pathname,
        });
      } catch (blobError) {
        console.error('Vercel Blob upload failed, falling back to local:', blobError);
        // Fall through to local upload
      }
    }

    // ── Strategy 2: Local file system (development) ──
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    // Return URL relative to public directory
    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({
      url,
      filename: uniqueName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // ── Vercel Blob URL ──
    if (url.includes('vercel-storage.com') || url.includes('blob.vercel-storage')) {
      if (hasVercelBlob) {
        try {
          const { del } = await import('@vercel/blob');
          await del(url);
          return NextResponse.json({ success: true });
        } catch (blobError) {
          console.error('Vercel Blob delete failed:', blobError);
          return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
        }
      }
      return NextResponse.json({ error: 'Vercel Blob not configured' }, { status: 500 });
    }

    // ── Local file ──
    if (url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      try {
        await unlink(filePath);
      } catch {
        // File may not exist — that's okay
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown file location' }, { status: 400 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
