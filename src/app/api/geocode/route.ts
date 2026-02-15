import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }
  
  try {
    // Using Nominatim (OpenStreetMap) - free geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1&accept-language=he`,
      {
        headers: {
          'User-Agent': 'Deal Tours Travel Agency (dealtours.bookings@gmail.com)',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      return NextResponse.json([], { status: 500 });
    }
    
    const data = await response.json();
    
    const locations = data
      .filter((item: any) => item.address?.country) // Only results with country
      .map((item: any) => ({
        name: item.address?.city || item.address?.town || item.address?.village || item.name || '',
        country: item.address?.country || '',
        countryCode: item.address?.country_code?.toUpperCase() || '',
        city: item.address?.city || item.address?.town || item.address?.village,
        state: item.address?.state || item.address?.region,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      }));
    
    // Remove duplicates based on name + country
    const uniqueLocations = locations.filter((loc: any, index: number, self: any[]) => 
      index === self.findIndex(l => l.name === loc.name && l.country === loc.country)
    );
    
    return NextResponse.json(uniqueLocations);
  } catch (error) {
    console.error('Geocode error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
