import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Hero from '@/components/Hero';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHebrew = locale === 'he';
  return {
    title: isHebrew ? 'דיל טורס - חבילות נופש וטיסות במחירים מיוחדים' : 'Deal Tours - Vacation Packages & Flights at Special Prices',
    description: isHebrew
      ? 'דיל טורס - סוכנות הנסיעות המובילה בישראל. חבילות נופש, טיסות זולות, מלונות ועוד במחירים שלא תמצאו בשום מקום אחר.'
      : 'Deal Tours - Israel\'s leading travel agency. Vacation packages, cheap flights, hotels and more at unbeatable prices.',
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { 'he': `${BASE_URL}/he`, 'en': `${BASE_URL}/en` },
    },
  };
}
import Categories from '@/components/Categories';
import Destinations from '@/components/Destinations';
import BookingServices from '@/components/BookingServices';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import { OrganizationJsonLd } from '@/components/JsonLd';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <Categories />
      <Destinations />
      <BookingServices />
      <Services />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  );
}
