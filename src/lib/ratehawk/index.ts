/**
 * RateHawk API Integration
 * 
 * This module provides integration with the RateHawk B2B travel platform.
 * 
 * SETUP REQUIRED:
 * 1. Register at RateHawk (https://www.ratehawk.com)
 * 2. Request API credentials from your Account Manager
 * 3. Add the following to your .env.local:
 *    - RATEHAWK_API_KEY=your_api_key
 *    - RATEHAWK_KEY_ID=your_key_id
 *    - RATEHAWK_API_URL=https://api.ratehawk.com (or sandbox URL)
 * 
 * Documentation: https://docs.ratehawk.com
 */

// Types for RateHawk API
export interface RateHawkConfig {
  apiKey: string;
  keyId: string;
  baseUrl: string;
  isSandbox: boolean;
}

export interface HotelSearchParams {
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  residency: string; // ISO country code (e.g., 'il')
  language: string; // Language code (e.g., 'he', 'en')
  guests: {
    adults: number;
    children?: number[];
  }[];
  region_id?: number;
  hotel_ids?: string[];
  currency?: string;
}

export interface HotelResult {
  id: string;
  name: string;
  star_rating: number;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  rates: HotelRate[];
}

export interface HotelRate {
  rate_id: string;
  room_name: string;
  board: string; // e.g., 'breakfast', 'all-inclusive'
  cancellation_type: 'free' | 'non_refundable' | 'partial';
  price: {
    amount: number;
    currency: string;
  };
  package_only?: boolean;
}

export interface BookingParams {
  rate_id: string;
  guests: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }[];
  payment?: {
    type: 'deposit' | 'full';
  };
}

export interface BookingResult {
  booking_id: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  hotel: {
    name: string;
    address: string;
  };
  dates: {
    checkin: string;
    checkout: string;
  };
  total_price: {
    amount: number;
    currency: string;
  };
  cancellation_policy: string;
}

class RateHawkClient {
  private config: RateHawkConfig;
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      apiKey: process.env.RATEHAWK_API_KEY || '',
      keyId: process.env.RATEHAWK_KEY_ID || '',
      baseUrl: process.env.RATEHAWK_API_URL || 'https://api.ratehawk.com',
      isSandbox: process.env.RATEHAWK_SANDBOX === 'true',
    };
    
    this.isConfigured = !!(this.config.apiKey && this.config.keyId);
  }

  /**
   * Check if RateHawk is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Get authentication headers for API requests
   */
  private getHeaders(): HeadersInit {
    const credentials = Buffer.from(`${this.config.keyId}:${this.config.apiKey}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Make API request to RateHawk
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object
  ): Promise<T> {
    if (!this.isConfigured) {
      throw new Error('RateHawk API is not configured. Please add API credentials to .env.local');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`RateHawk API Error: ${response.status} - ${error.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search for hotels
   */
  async searchHotels(params: HotelSearchParams): Promise<HotelResult[]> {
    const response = await this.request<{ data: { hotels: HotelResult[] } }>(
      '/hotel/v1/search',
      'POST',
      params
    );
    return response.data.hotels;
  }

  /**
   * Get hotel details
   */
  async getHotelDetails(hotelId: string, language: string = 'en'): Promise<HotelResult> {
    const response = await this.request<{ data: HotelResult }>(
      `/hotel/v1/hotels/${hotelId}?language=${language}`
    );
    return response.data;
  }

  /**
   * Check rate availability (Pre-book)
   */
  async checkAvailability(rateId: string): Promise<{ available: boolean; price: { amount: number; currency: string } }> {
    const response = await this.request<{ data: { available: boolean; price: { amount: number; currency: string } } }>(
      '/hotel/v1/prebook',
      'POST',
      { rate_id: rateId }
    );
    return response.data;
  }

  /**
   * Create a booking
   */
  async createBooking(params: BookingParams): Promise<BookingResult> {
    const response = await this.request<{ data: BookingResult }>(
      '/hotel/v1/book',
      'POST',
      params
    );
    return response.data;
  }

  /**
   * Get booking details
   */
  async getBooking(bookingId: string): Promise<BookingResult> {
    const response = await this.request<{ data: BookingResult }>(
      `/hotel/v1/bookings/${bookingId}`
    );
    return response.data;
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<{ success: boolean; refund_amount?: number }> {
    const response = await this.request<{ data: { success: boolean; refund_amount?: number } }>(
      `/hotel/v1/bookings/${bookingId}/cancel`,
      'POST'
    );
    return response.data;
  }

  /**
   * Search for regions/locations
   */
  async searchRegions(query: string, language: string = 'en'): Promise<{ id: number; name: string; type: string }[]> {
    const response = await this.request<{ data: { regions: { id: number; name: string; type: string }[] } }>(
      `/hotel/v1/regions?query=${encodeURIComponent(query)}&language=${language}`
    );
    return response.data.regions;
  }
}

// Export singleton instance
export const ratehawk = new RateHawkClient();

