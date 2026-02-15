/**
 * Tests for Upload API Route
 */

import { POST, DELETE } from '@/app/api/upload/route';
import { NextRequest } from 'next/server';
import { put, del } from '@vercel/blob';

jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  del: jest.fn(),
}));

describe('Upload API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/upload', () => {
    it('should upload a valid image file', async () => {
      const mockFile = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      const mockBlob = {
        url: 'https://blob.vercel-storage.com/test.jpg',
        pathname: 'deals/123-test.jpg',
      };

      (put as jest.Mock).mockResolvedValue(mockBlob);

      const formData = new FormData();
      formData.append('file', mockFile);

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.url).toBe(mockBlob.url);
      expect(data.filename).toBe(mockBlob.pathname);
      expect(put).toHaveBeenCalled();
    });

    it('should reject non-image files', async () => {
      const mockFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      const formData = new FormData();
      formData.append('file', mockFile);

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid file type');
    });

    it('should reject files larger than 5MB', async () => {
      // Create a mock file larger than 5MB
      const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
      const mockFile = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('file', mockFile);

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('File too large');
    });

    it('should handle missing file', async () => {
      const formData = new FormData();

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('No file provided');
    });

    it('should handle upload errors', async () => {
      const mockFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      (put as jest.Mock).mockRejectedValue(new Error('Upload failed'));

      const formData = new FormData();
      formData.append('file', mockFile);

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to upload file');
    });

    it('should accept valid image types', async () => {
      const validTypes = [
        { type: 'image/jpeg', name: 'test.jpg' },
        { type: 'image/png', name: 'test.png' },
        { type: 'image/webp', name: 'test.webp' },
        { type: 'image/gif', name: 'test.gif' },
      ];

      for (const fileInfo of validTypes) {
        const mockFile = new File(['content'], fileInfo.name, {
          type: fileInfo.type,
        });

        const mockBlob = {
          url: `https://blob.vercel-storage.com/${fileInfo.name}`,
          pathname: `deals/123-${fileInfo.name}`,
        };

        (put as jest.Mock).mockResolvedValue(mockBlob);

        const formData = new FormData();
        formData.append('file', mockFile);

        const request = new NextRequest('http://localhost/api/upload', {
          method: 'POST',
          body: formData,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.url).toBeDefined();
      }
    });
  });

  describe('DELETE /api/upload', () => {
    it('should delete a file', async () => {
      const url = 'https://blob.vercel-storage.com/test.jpg';
      (del as jest.Mock).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({ url }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(del).toHaveBeenCalledWith(url);
    });

    it('should handle missing URL', async () => {
      const request = new NextRequest('http://localhost/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({}),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('No URL provided');
    });

    it('should handle delete errors', async () => {
      const url = 'https://blob.vercel-storage.com/test.jpg';
      (del as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const request = new NextRequest('http://localhost/api/upload', {
        method: 'DELETE',
        body: JSON.stringify({ url }),
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to delete file');
    });
  });
});
