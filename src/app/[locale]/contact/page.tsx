import { setRequestLocale } from 'next-intl/server';
import { db, siteSettings } from '@/db';
import { eq } from 'drizzle-orm';
import ContactPageClient from './ContactPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getContactSettings() {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.group, 'contact'));

  const s: Record<string, { value: string | null; valueEn: string | null }> = {};
  rows.forEach(row => {
    s[row.key] = { value: row.value, valueEn: row.valueEn };
  });

  const socialRows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.group, 'social'));

  socialRows.forEach(row => {
    s[row.key] = { value: row.value, valueEn: row.valueEn };
  });

  return s;
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getContactSettings();

  const contactSettings = {
    phone: settings.phone?.value || '052-511-8536',
    phoneDisplay: settings.phoneDisplay?.value || '052-511-8536',
    email: settings.email?.value || 'Stours.bookings@gmail.com',
    businessHours: locale === 'he'
      ? settings.businessHours?.value || 'א׳-ה׳ 09:00-19:00'
      : settings.businessHours?.valueEn || 'Sun-Thu 09:00-19:00',
    businessHoursFriday: locale === 'he'
      ? settings.businessHoursFriday?.value || ''
      : settings.businessHoursFriday?.valueEn || '',
    whatsappNumber: settings.whatsappNumber?.value || '972525118536',
  };

  return <ContactPageClient settings={contactSettings} locale={locale} />;
}
