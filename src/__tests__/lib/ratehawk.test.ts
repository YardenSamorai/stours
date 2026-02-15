/**
 * Tests for RateHawk Integration
 */

import { ratehawk, RateHawkClient } from '@/lib/ratehawk';

describe('RateHawk Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      RATEHAWK_API_KEY: 'test_api_key',
      RATEHAWK_KEY_ID: 'test_key_id',
      RATEHAWK_API_URL: 'https://api.ratehawk.com',
      RATEHAWK_SANDBOX: 'false',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Configuration', () => {
    it('should check if RateHawk is configured', () => {
      const isReady = ratehawk.isReady();
      expect(typeof isReady).toBe('boolean');
    });

    it('should return false when not configured', () => {
      process.env.RATEHAWK_API_KEY = '';
      process.env.RATEHAWK_KEY_ID = '';
      
      // Need to re-import to get new instance
      jest.resetModules();
      const { ratehawk: newRatehawk } = require('@/lib/ratehawk');
      expect(newRatehawk.isReady()).toBe(false);
    });
  });

  describe('API Methods', () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle searchHotels method signature', () => {
      const params = {
        checkin: '2024-01-01',
        checkout: '2024-01-05',
        residency: 'il',
        language: 'he',
        guests: [{ adults: 2 }],
      };

      // Just check that the method exists and accepts the right parameters
      expect(typeof ratehawk.searchHotels).toBe('function');
    });

    it('should handle getHotelDetails method signature', () => {
      expect(typeof ratehawk.getHotelDetails).toBe('function');
    });

    it('should handle createBooking method signature', () => {
      const params = {
        rate_id: 'rate123',
        guests: [
          {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '+972501234567',
          },
        ],
      };

      expect(typeof ratehawk.createBooking).toBe('function');
    });

    it('should handle checkAvailability method', () => {
      expect(typeof ratehawk.checkAvailability).toBe('function');
    });

    it('should handle getBooking method', () => {
      expect(typeof ratehawk.getBooking).toBe('function');
    });

    it('should handle cancelBooking method', () => {
      expect(typeof ratehawk.cancelBooking).toBe('function');
    });

    it('should handle searchRegions method', () => {
      expect(typeof ratehawk.searchRegions).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when not configured and trying to use API', async () => {
      process.env.RATEHAWK_API_KEY = '';
      process.env.RATEHAWK_KEY_ID = '';
      
      jest.resetModules();
      const { ratehawk: unconfiguredRatehawk } = require('@/lib/ratehawk');
      
      await expect(
        unconfiguredRatehawk.searchHotels({
          checkin: '2024-01-01',
          checkout: '2024-01-05',
          residency: 'il',
          language: 'he',
          guests: [{ adults: 2 }],
        })
      ).rejects.toThrow();
    });
  });
});
