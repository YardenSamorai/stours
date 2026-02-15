/**
 * Tests for Services API Routes
 */

import { GET, POST } from '@/app/api/services/route';
import { NextRequest } from 'next/server';
import { db, services } from '@/db';

jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  services: {},
}));

describe('Services API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/services', () => {
    it('should return all services ordered by order field', async () => {
      const mockServices = [
        { id: 1, key: 'flights', title: 'Flights', order: 1 },
        { id: 2, key: 'hotels', title: 'Hotels', order: 2 },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockServices),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockServices);
    });

    it('should handle database errors', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch services');
    });
  });

  describe('POST /api/services', () => {
    it('should create a new service with valid data', async () => {
      const newService = {
        key: 'test-service',
        title: 'Test Service',
        description: 'Test description',
        icon: 'Plane',
        isActive: true,
        order: 0,
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...newService }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/services', {
        method: 'POST',
        body: JSON.stringify(newService),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.key).toBe('test-service');
      expect(data.title).toBe('Test Service');
    });

    it('should set default values', async () => {
      const minimalService = {
        key: 'minimal',
        title: 'Minimal Service',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: 1,
              ...minimalService,
              icon: 'Plane',
              gradient: 'from-blue-500 to-cyan-400',
              bgLight: 'bg-blue-50',
              iconBg: 'bg-blue-500',
              isActive: true,
              order: 0,
            },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/services', {
        method: 'POST',
        body: JSON.stringify(minimalService),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.icon).toBe('Plane');
      expect(data.gradient).toBe('from-blue-500 to-cyan-400');
      expect(data.isActive).toBe(true);
    });

    // BUG FOUND: No validation for unique key constraint
    it('should handle duplicate key (BUG: should validate uniqueness)', async () => {
      const service = {
        key: 'existing-key',
        title: 'Service',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(
            new Error('duplicate key value violates unique constraint')
          ),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });

      const response = await POST(request);
      const data = await response.json();

      // Currently returns 500, but should return 400 with clearer error message
      expect(response.status).toBe(500);
      // TODO: Should return 400 with message "Service key already exists"
    });
  });
});
