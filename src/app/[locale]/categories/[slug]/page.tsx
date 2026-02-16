import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { db, categories, deals } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
import { useTranslations } from 'next-intl';
import CategoryDeals from '@/components/CategoryDeals';

export async function generateStaticParams() {
  const allCategories = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.isActive, true));

  return allCategories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // Fetch category
  const category = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);

  if (!category.length) {
    notFound();
  }

  const cat = category[0];

  // Fetch deals for this category
  const categoryDeals = await db
    .select()
    .from(deals)
    .where(and(eq(deals.categoryId, cat.id), eq(deals.isActive, true)))
    .orderBy(desc(deals.createdAt));

  return <CategoryDeals category={cat} deals={categoryDeals} locale={locale} />;
}
