/**
 * Tests for Deals API Routes
 * Tests cover GET, POST, PATCH, DELETE operations
 */

import { GET, POST } from '@/app/api/deals/route';
import { GET as GETById, PATCH, DELETE } from '@/app/api/deals/[id]/route';
import { NextRequest } from 'next/server';
import { db, deals } from '@/db';
import { eq } from 'drizzle-orm';

// Mock the database
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  deals: {
    id: 'id',
    title: 'title',
  },
}));

describe('Deals API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/deals', () => {
    it('should return all deals', async () => {
      const mockDeals = [
        { id: 1, title: 'Deal 1', price: '1000', isActive: true },
        { id: 2, title: 'Deal 2', price: '2000', isActive: true },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockDeals),
        }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDeals);
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
      expect(data.error).toBe('Failed to fetch deals');
    });
  });

  describe('POST /api/deals', () => {
    it('should create a new deal with valid data', async () => {
      const newDeal = {
        title: 'Test Deal',
        destination: 'Paris',
        price: '1500',
        currency: 'ILS',
        isActive: true,
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...newDeal }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/deals', {
        method: 'POST',
        body: JSON.stringify(newDeal),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject(newDeal);
      expect(data.id).toBe(1);
    });

    it('should handle missing required fields', async () => {
      const invalidDeal = {
        destination: 'Paris',
        // Missing title and price
      };

      const request = new NextRequest('http://localhost/api/deals', {
        method: 'POST',
        body: JSON.stringify(invalidDeal),
      });

      // This should fail at database level, but we should handle it gracefully
      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockRejectedValue(new Error('Missing required field')),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create deal');
    });

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost/api/deals', {
        method: 'POST',
        body: 'invalid json',
      });

      await expect(POST(request)).rejects.toThrow();
    });

    it('should set default values correctly', async () => {
      const minimalDeal = {
        title: 'Test Deal',
        destination: 'Paris',
        price: '1000',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...minimalDeal, currency: 'ILS', isActive: true }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/deals', {
        method: 'POST',
        body: JSON.stringify(minimalDeal),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.currency).toBe('ILS');
      expect(data.isActive).toBe(true);
    });
  });

  describe('GET /api/deals/[id]', () => {
    it('should return a single deal by id', async () => {
      const mockDeal = { id: 1, title: 'Deal 1', price: '1000' };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockDeal]),
        }),
      });

      const params = Promise.resolve({ id: '1' });
      const response = await GETById(new NextRequest('http://localhost/api/deals/1'), { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockDeal);
    });

    it('should return 404 for non-existent deal', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const params = Promise.resolve({ id: '999' });
      const response = await GETById(new NextRequest('http://localhost/api/deals/999'), { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Deal not found');
    });

    it('should handle invalid id format', async () => {
      const params = Promise.resolve({ id: 'invalid' });
      
      // This should fail when trying to parse 'invalid' as integer
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const response = await GETById(new NextRequest('http://localhost/api/deals/invalid'), { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Deal not found');
    });
  });

  describe('PATCH /api/deals/[id]', () => {
    it('should update an existing deal', async () => {
      const updateData = { title: 'Updated Deal', price: '2000' };
      const updatedDeal = { id: 1, ...updateData, updatedAt: new Date() };

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedDeal]),
          }),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/deals/1', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated Deal');
    });

    it('should return 404 when updating non-existent deal', async () => {
      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '999' });
      const request = new NextRequest('http://localhost/api/deals/999', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated' }),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Deal not found');
    });
  });

  describe('DELETE /api/deals/[id]', () => {
    it('should delete an existing deal', async () => {
      const mockDelete = {
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, title: 'Deleted Deal' }]),
        }),
      };

      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/deals/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Deal deleted successfully');
    });

    it('should return 404 when deleting non-existent deal', async () => {
      const mockDelete = {
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      };

      (db.delete as jest.Mock).mockReturnValue(mockDelete);

      const params = Promise.resolve({ id: '999' });
      const request = new NextRequest('http://localhost/api/deals/999', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Deal not found');
    });
  });
});
