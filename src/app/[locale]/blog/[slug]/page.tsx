import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ArrowRight, ArrowLeft, Tag, User, Eye } from 'lucide-react';
import { db, blogPosts } from '@/db';
import { eq, and, desc, ne } from 'drizzle-orm';
import type { Metadata } from 'next';
import { ArticleJsonLd } from '@/components/JsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import sanitizeHtml from 'sanitize-html';

async function getBlogPost(slug: string) {
  try {
    const post = await db.select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)));

    if (!post.length) return null;

    await db.update(blogPosts)
      .set({ viewsCount: (post[0].viewsCount || 0) + 1 })
      .where(eq(blogPosts.id, post[0].id));

    return post[0];
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getRelatedPosts(currentId: number, category: string | null) {
  try {
    let query = db.select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, true),
          ne(blogPosts.id, currentId)
        )
      )
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3);

    return await query;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const isHebrew = locale === 'he';
  const title = isHebrew ? (post.metaTitle || post.title) : (post.metaTitleEn || post.titleEn || post.metaTitle || post.title);
  const description = isHebrew ? (post.metaDescription || post.excerpt) : (post.metaDescriptionEn || post.excerptEn || post.metaDescription || post.excerpt);

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: post.image ? [post.image] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        'he': `${BASE_URL}/he/blog/${slug}`,
        'en': `${BASE_URL}/en/blog/${slug}`,
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isHebrew = locale === 'he';

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category);

  const title = isHebrew ? post.title : (post.titleEn || post.title);
  const rawContent = isHebrew ? post.content : (post.contentEn || post.content);
  const content = sanitizeHtml(rawContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'video', 'source', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading', 'class', 'style'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
      '*': ['class', 'style', 'dir', 'id'],
    },
  });
  const excerpt = isHebrew ? post.excerpt : (post.excerptEn || post.excerpt);
  const category = isHebrew ? post.category : (post.categoryEn || post.category);

  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il'}/${locale}/blog/${slug}`;

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={excerpt}
        image={post.image}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={post.authorName}
        url={blogUrl}
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {post.image && (
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={title}
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
        )}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {category && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-100 text-sm mb-6">
                <Tag className="w-4 h-4" />
                {category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            {excerpt && (
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                {excerpt}
              </p>
            )}
            <div className="flex items-center justify-center gap-6 text-primary-200 text-sm">
              {post.authorName && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.authorName}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {post.viewsCount !== null && post.viewsCount > 0 && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {post.viewsCount.toLocaleString()} {isHebrew ? 'צפיות' : 'views'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-slate-50" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 19.3C1200 16.7 1320 11 1380 8.30001L1440 5.70001V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-10 transition-colors"
            >
              {isHebrew ? (
                <>
                  <ArrowRight className="w-5 h-5" />
                  חזרה לבלוג
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </>
              )}
            </Link>

            {/* Post Image */}
            {post.image && (
              <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg h-[300px] md:h-[500px]">
                <Image
                  src={post.image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-8 ${isHebrew ? 'justify-end' : 'justify-start'}`}>
                {(isHebrew ? post.tags : (post.tagsEn || post.tags)).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <article
              dir={isHebrew ? 'rtl' : 'ltr'}
              className={`prose prose-lg max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-slate-700 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-lg ${isHebrew ? 'text-right' : 'text-left'}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Author Card */}
            {post.authorName && (
              <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm flex items-center gap-4">
                {post.authorImage ? (
                  <Image
                    src={post.authorImage}
                    alt={post.authorName}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">{isHebrew ? 'נכתב על ידי' : 'Written by'}</p>
                  <p className="text-lg font-semibold text-slate-800">{post.authorName}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {isHebrew ? 'פוסטים נוספים' : 'More Posts'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44">
                    {relatedPost.image ? (
                      <Image
                        src={relatedPost.image}
                        alt={isHebrew ? relatedPost.title : relatedPost.titleEn || relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-5">
                    {relatedPost.publishedAt && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(relatedPost.publishedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {isHebrew ? relatedPost.title : relatedPost.titleEn || relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {isHebrew ? relatedPost.excerpt : relatedPost.excerptEn || relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
