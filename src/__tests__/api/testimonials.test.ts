/**
 * Tests for Testimonials API Routes
 */

import { GET, POST } from '@/app/api/testimonials/route';
import { NextRequest } from 'next/server';
import { db, testimonials } from '@/db';

jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
  testimonials: {
    isActive: 'is_active',
  },
}));

describe('Testimonials API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/testimonials', () => {
    it('should return all testimonials', async () => {
      const mockTestimonials = [
        { id: 1, name: 'John', text: 'Great service!', rating: 5, isActive: true },
        { id: 2, name: 'Jane', text: 'Amazing trip!', rating: 5, isActive: false },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockTestimonials),
        }),
      });

      const request = new NextRequest('http://localhost/api/testimonials');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTestimonials);
    });

    it('should filter active testimonials only', async () => {
      const activeTestimonials = [
        { id: 1, name: 'John', text: 'Great!', rating: 5, isActive: true },
      ];

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(activeTestimonials),
      };

      (db.select as jest.Mock).mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/testimonials?active=true');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(activeTestimonials);
      expect(mockQuery.where).toHaveBeenCalled();
    });
  });

  describe('POST /api/testimonials', () => {
    it('should create a new testimonial', async () => {
      const newTestimonial = {
        name: 'John Doe',
        text: 'Amazing experience!',
        rating: 5,
        isActive: true,
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...newTestimonial }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(newTestimonial),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('John Doe');
      expect(data.text).toBe('Amazing experience!');
      expect(data.rating).toBe(5);
    });

    it('should set default rating to 5', async () => {
      const testimonial = {
        name: 'Jane',
        text: 'Great!',
        // rating not provided
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...testimonial, rating: 5 }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonial),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.rating).toBe(5);
    });

    // BUG FOUND: No validation for rating range
    it('should validate rating range (BUG: currently missing)', async () => {
      const invalidTestimonial = {
        name: 'Test',
        text: 'Test',
        rating: 10, // Invalid: should be 1-5
      };

      // Currently accepts invalid rating
      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...invalidTestimonial }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(invalidTestimonial),
      });

      const response = await POST(request);
      const data = await response.json();

      // Currently accepts invalid rating - this is a bug
      expect(response.status).toBe(201);
      // TODO: Should validate rating is between 1-5 and return 400 for invalid values
    });
  });
});
