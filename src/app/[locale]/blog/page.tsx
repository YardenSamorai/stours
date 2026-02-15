import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { db, blogPosts } from '@/db';
import { eq, desc } from 'drizzle-orm';

async function getBlogPosts() {
  try {
    const posts = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isHebrew = locale === 'he';
  
  const posts = await getBlogPosts();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {isHebrew ? 'הבלוג שלנו' : 'Our Blog'}
            </h1>
            <p className="text-xl text-primary-100">
              {isHebrew 
                ? 'טיפים, המלצות וחוויות מעולם הנסיעות'
                : 'Tips, recommendations and travel experiences'
              }
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-slate-50" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 19.3C1200 16.7 1320 11 1380 8.30001L1440 5.70001V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" />
          </svg>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              {/* Featured Post */}
              <div className="mb-12">
                <Link
                  href={`/${locale}/blog/${posts[0].slug}`}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto">
                      {posts[0].image ? (
                        <img
                          src={posts[0].image}
                          alt={isHebrew ? posts[0].title : posts[0].titleEn || posts[0].title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                      )}
                      <div className="absolute top-4 start-4">
                        <span className="px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-semibold">
                          {isHebrew ? 'מומלץ' : 'Featured'}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        {posts[0].category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            {isHebrew ? posts[0].category : posts[0].categoryEn || posts[0].category}
                          </span>
                        )}
                        {posts[0].publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(posts[0].publishedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4 group-hover:text-primary-600 transition-colors">
                        {isHebrew ? posts[0].title : posts[0].titleEn || posts[0].title}
                      </h2>
                      {posts[0].excerpt && (
                        <p className="text-slate-600 mb-6 text-lg">
                          {isHebrew ? posts[0].excerpt : posts[0].excerptEn || posts[0].excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                        {isHebrew ? 'קרא עוד' : 'Read More'}
                        <ArrowLeft className={`w-5 h-5 ${isHebrew ? '' : 'rotate-180'}`} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Posts Grid */}
              {posts.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(1).map((post) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="relative h-48">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={isHebrew ? post.title : post.titleEn || post.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {post.category && (
                          <span className="absolute bottom-4 start-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                            {isHebrew ? post.category : post.categoryEn || post.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.publishedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {isHebrew ? post.title : post.titleEn || post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-slate-600 line-clamp-2">
                            {isHebrew ? post.excerpt : post.excerptEn || post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Tag className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {isHebrew ? 'אין פוסטים עדיין' : 'No posts yet'}
              </h2>
              <p className="text-slate-600">
                {isHebrew 
                  ? 'בקרוב נפרסם תכנים מעניינים - הישארו מעודכנים!'
                  : 'We\'ll publish interesting content soon - stay tuned!'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
