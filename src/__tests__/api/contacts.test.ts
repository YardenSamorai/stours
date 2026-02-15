/**
 * Tests for Contacts API Routes
 */

import { GET, POST } from '@/app/api/contacts/route';
import { NextRequest } from 'next/server';
import { db, contactSubmissions } from '@/db';

jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
  contactSubmissions: {},
}));

describe('Contacts API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact submission', async () => {
      const submission = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '050-1234567',
        destination: 'Paris',
        message: 'I want to book a trip',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 1, ...submission, isRead: false },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/contacts', {
        method: 'POST',
        body: JSON.stringify(submission),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('John Doe');
      expect(data.email).toBe('john@example.com');
      expect(data.isRead).toBe(false);
    });

    it('should handle missing optional fields', async () => {
      const minimalSubmission = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 1, ...minimalSubmission, isRead: false },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/contacts', {
        method: 'POST',
        body: JSON.stringify(minimalSubmission),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('Jane Doe');
    });

    it('should handle database errors', async () => {
      const submission = {
        name: 'Test',
        email: 'test@example.com',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/contacts', {
        method: 'POST',
        body: JSON.stringify(submission),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to submit contact form');
    });

    // BUG FOUND: No email validation
    it('should validate email format (BUG: currently missing)', async () => {
      const invalidSubmission = {
        name: 'Test',
        email: 'invalid-email',
      };

      // This test documents that email validation is missing
      // In a real scenario, this should return 400 with validation error
      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 1, ...invalidSubmission },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/contacts', {
        method: 'POST',
        body: JSON.stringify(invalidSubmission),
      });

      const response = await POST(request);
      const data = await response.json();

      // Currently accepts invalid email - this is a bug
      expect(response.status).toBe(201);
      // TODO: Should validate email and return 400 for invalid format
    });
  });

  describe('GET /api/contacts', () => {
    it('should return all contact submissions', async () => {
      const mockSubmissions = [
        { id: 1, name: 'John', email: 'john@example.com', isRead: false },
        { id: 2, name: 'Jane', email: 'jane@example.com', isRead: true },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockSubmissions),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSubmissions);
    });
  });
});
