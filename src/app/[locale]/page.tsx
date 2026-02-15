import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Destinations from '@/components/Destinations';
import BookingServices from '@/components/BookingServices';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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
