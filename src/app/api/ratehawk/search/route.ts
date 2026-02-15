import { NextResponse } from 'next/server';
import { ratehawk } from '@/lib/ratehawk';

export async function POST(request: Request) {
  try {
    // Check if RateHawk is configured
    if (!ratehawk.isReady()) {
      return NextResponse.json({
        error: 'RateHawk API is not configured',
        message: 'Please contact the administrator to set up RateHawk integration',
        configured: false,
      }, { status: 503 });
    }

    const body = await request.json();
    
    const { checkin, checkout, destination, guests, language = 'he' } = body;

    // Validate required fields
    if (!checkin || !checkout || !destination) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['checkin', 'checkout', 'destination'],
      }, { status: 400 });
    }

    // Search for region first
    const regions = await ratehawk.searchRegions(destination, language);
    
    if (!regions.length) {
      return NextResponse.json({
        hotels: [],
        message: 'No regions found for the specified destination',
      });
    }

    // Search hotels in the found region
    const hotels = await ratehawk.searchHotels({
      checkin,
      checkout,
      residency: 'il',
      language,
      guests: guests || [{ adults: 2 }],
      region_id: regions[0].id,
      currency: 'ILS',
    });

    return NextResponse.json({
      hotels,
      region: regions[0],
      search_params: { checkin, checkout, destination },
    });

  } catch (error) {
    console.error('RateHawk search error:', error);
    return NextResponse.json({
      error: 'Failed to search hotels',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
