import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialForm from "@/components/TestimonialForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'he' ? 'דיל טורס - סוכנות נסיעות' : 'Deal Tours - Travel Agency',
    description: locale === 'he'
      ? 'גלה את העולם איתנו - חבילות נופש, טיסות ומלונות במחירים הטובים ביותר'
      : 'Discover the world with us - vacation packages, flights and hotels at the best prices',
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'he';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main>{children}</main>
        <Footer />
        <TestimonialForm />
      </NextIntlClientProvider>
    </div>
  );
}
