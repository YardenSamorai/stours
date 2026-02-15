import { NextResponse } from 'next/server';
import { ratehawk } from '@/lib/ratehawk';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if RateHawk is configured
    if (!ratehawk.isReady()) {
      return NextResponse.json({
        error: 'RateHawk API is not configured',
        configured: false,
      }, { status: 503 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'he';

    const hotel = await ratehawk.getHotelDetails(id, language);

    return NextResponse.json({ hotel });

  } catch (error) {
    console.error('RateHawk hotel details error:', error);
    return NextResponse.json({
      error: 'Failed to fetch hotel details',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
