import { db, blogPosts } from '@/db';
import { eq, desc } from 'drizzle-orm';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function GET() {
  try {
    const posts = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(50);

    const items = posts.map(post => {
      const title = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const description = (post.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date(post.createdAt!).toUTCString();

      return `    <item>
      <title>${title}</title>
      <link>${BASE_URL}/he/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/he/blog/${post.slug}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${post.category.replace(/&/g, '&amp;')}</category>` : ''}
      ${post.authorName ? `<dc:creator>${post.authorName.replace(/&/g, '&amp;')}</dc:creator>` : ''}
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>דיל טורס - בלוג</title>
    <link>${BASE_URL}/he/blog</link>
    <description>טיפים, המלצות וחוויות מעולם הנסיעות</description>
    <language>he</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new Response('<rss version="2.0"><channel><title>Error</title></channel></rss>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
