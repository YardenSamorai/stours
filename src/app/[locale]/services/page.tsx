import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Services from '@/components/Services';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHebrew = locale === 'he';
  return {
    title: isHebrew ? 'השירותים שלנו' : 'Our Services',
    description: isHebrew
      ? 'שירותי תיירות מקצועיים - חבילות נופש, טיסות, מלונות, השכרת רכב, ביטוח נסיעות ועוד'
      : 'Professional travel services - vacation packages, flights, hotels, car rentals, travel insurance and more',
    alternates: {
      canonical: `${BASE_URL}/${locale}/services`,
      languages: { 'he': `${BASE_URL}/he/services`, 'en': `${BASE_URL}/en/services` },
    },
  };
}

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-20">
      <Services />
    </div>
  );
}
