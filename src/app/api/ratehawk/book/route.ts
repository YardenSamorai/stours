import { NextResponse } from 'next/server';
import { ratehawk } from '@/lib/ratehawk';

export async function POST(request: Request) {
  try {
    // Check if RateHawk is configured
    if (!ratehawk.isReady()) {
      return NextResponse.json({
        error: 'RateHawk API is not configured',
        configured: false,
      }, { status: 503 });
    }

    const body = await request.json();
    
    const { rate_id, guests } = body;

    // Validate required fields
    if (!rate_id || !guests || !guests.length) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['rate_id', 'guests'],
      }, { status: 400 });
    }

    // First, check availability with pre-book
    const availability = await ratehawk.checkAvailability(rate_id);
    
    if (!availability.available) {
      return NextResponse.json({
        error: 'Rate is no longer available',
        available: false,
      }, { status: 409 });
    }

    // Create the booking
    const booking = await ratehawk.createBooking({
      rate_id,
      guests,
      payment: { type: 'deposit' },
    });

    return NextResponse.json({
      booking,
      success: true,
    });

  } catch (error) {
    console.error('RateHawk booking error:', error);
    return NextResponse.json({
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
