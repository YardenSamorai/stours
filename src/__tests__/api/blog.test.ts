/**
 * Tests for Blog API Routes
 */

import { GET, POST } from '@/app/api/blog/route';
import { GET as GETById, PATCH, DELETE } from '@/app/api/blog/[id]/route';
import { NextRequest } from 'next/server';
import { db, blogPosts } from '@/db';
import { eq } from 'drizzle-orm';

jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  blogPosts: {
    id: 'id',
    slug: 'slug',
    isPublished: 'is_published',
  },
}));

describe('Blog API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/blog', () => {
    it('should return all blog posts', async () => {
      const mockPosts = [
        { id: 1, slug: 'post-1', title: 'Post 1', isPublished: true },
        { id: 2, slug: 'post-2', title: 'Post 2', isPublished: false },
      ];

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue(mockPosts),
        }),
      });

      const request = new NextRequest('http://localhost/api/blog');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPosts);
    });

    it('should filter published posts only', async () => {
      const publishedPosts = [
        { id: 1, slug: 'post-1', title: 'Post 1', isPublished: true },
      ];

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(publishedPosts),
      };

      (db.select as jest.Mock).mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/blog?published=true');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(publishedPosts);
      expect(mockQuery.where).toHaveBeenCalled();
    });
  });

  describe('POST /api/blog', () => {
    it('should create a new blog post with auto-generated slug', async () => {
      const newPost = {
        title: 'Test Blog Post',
        content: 'This is the content',
        isPublished: false,
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 1, slug: 'test-blog-post', ...newPost },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/blog', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.slug).toBe('test-blog-post');
      expect(data.title).toBe('Test Blog Post');
    });

    it('should use provided slug if given', async () => {
      const newPost = {
        title: 'Test Post',
        slug: 'custom-slug',
        content: 'Content',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 1, ...newPost }]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/blog', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.slug).toBe('custom-slug');
    });

    it('should set publishedAt when publishing', async () => {
      const newPost = {
        title: 'Published Post',
        content: 'Content',
        isPublished: true,
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: 1,
              ...newPost,
              publishedAt: new Date(),
            },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/blog', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.isPublished).toBe(true);
    });

    it('should handle slug generation with special characters', async () => {
      const newPost = {
        title: 'Test Post with Special Chars! @#$%',
        content: 'Content',
      };

      const mockInsert = {
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            { id: 1, slug: 'test-post-with-special-chars', ...newPost },
          ]),
        }),
      };

      (db.insert as jest.Mock).mockReturnValue(mockInsert);

      const request = new NextRequest('http://localhost/api/blog', {
        method: 'POST',
        body: JSON.stringify(newPost),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      // Slug should be cleaned
      expect(data.slug).not.toContain('!');
      expect(data.slug).not.toContain('@');
    });
  });

  describe('GET /api/blog/[id]', () => {
    it('should return blog post by numeric id', async () => {
      const mockPost = { id: 1, slug: 'post-1', title: 'Post 1', viewsCount: 0 };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockPost]),
        }),
      });

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/blog/1');
      const response = await GETById(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPost);
    });

    it('should return blog post by slug', async () => {
      const mockPost = { id: 1, slug: 'my-post', title: 'My Post', viewsCount: 0 };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockPost]),
        }),
      });

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: 'my-post' });
      const request = new NextRequest('http://localhost/api/blog/my-post');
      const response = await GETById(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPost);
    });

    it('should increment views count', async () => {
      const mockPost = { id: 1, slug: 'post-1', viewsCount: 5 };

      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockPost]),
        }),
      });

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/blog/1');
      await GETById(request, { params });

      expect(mockUpdate.set).toHaveBeenCalledWith({ viewsCount: 6 });
    });

    it('should return 404 for non-existent post', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const params = Promise.resolve({ id: '999' });
      const request = new NextRequest('http://localhost/api/blog/999');
      const response = await GETById(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Blog post not found');
    });
  });

  describe('PATCH /api/blog/[id]', () => {
    it('should update blog post', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedPost = { id: 1, ...updateData, updatedAt: new Date() };

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedPost]),
          }),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/blog/1', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated Title');
    });

    it('should set publishedAt when publishing for first time', async () => {
      const updateData = { isPublished: true };
      const updatedPost = {
        id: 1,
        ...updateData,
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdate = {
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedPost]),
          }),
        }),
      };

      (db.update as jest.Mock).mockReturnValue(mockUpdate);

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost/api/blog/1', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.publishedAt).toBeDefined();
    });
  });
});
