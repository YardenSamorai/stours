import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Destinations from '@/components/Destinations';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHebrew = locale === 'he';
  return {
    title: isHebrew ? 'יעדים וחבילות נופש' : 'Destinations & Packages',
    description: isHebrew
      ? 'גלו את היעדים הפופולריים ביותר שלנו - חבילות נופש במחירים מיוחדים ליעדים ברחבי העולם'
      : 'Discover our most popular destinations - vacation packages at special prices to destinations worldwide',
    alternates: {
      canonical: `${BASE_URL}/${locale}/destinations`,
      languages: { 'he': `${BASE_URL}/he/destinations`, 'en': `${BASE_URL}/en/destinations` },
    },
  };
}

export default async function DestinationsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <Destinations />
    </div>
  );
}
