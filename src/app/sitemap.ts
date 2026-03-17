import { MetadataRoute } from 'next';
import { db, blogPosts, categories } from '@/db';
import { eq, desc } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['he', 'en'];

  const staticPages = ['', '/destinations', '/services', '/blog', '/about', '/contact'];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' as const : 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));

    blogEntries = locales.flatMap((locale) =>
      posts.map((post) => ({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    );
  } catch {}

  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const cats = await db.select({ slug: categories.slug, updatedAt: categories.updatedAt })
      .from(categories)
      .where(eq(categories.isActive, true));

    categoryEntries = locales.flatMap((locale) =>
      cats.filter(c => c.slug).map((cat) => ({
        url: `${BASE_URL}/${locale}/categories/${cat.slug}`,
        lastModified: cat.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    );
  } catch {}

  return [...staticEntries, ...blogEntries, ...categoryEntries];
}
