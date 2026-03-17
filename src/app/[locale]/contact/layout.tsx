import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHebrew = locale === 'he';
  return {
    title: isHebrew ? 'צור קשר - דיל טורס' : 'Contact Us - Deal Tours',
    description: isHebrew
      ? 'צרו קשר עם דיל טורס - נשמח לעזור לכם לתכנן את הטיול המושלם. טלפון, ווטסאפ או טופס יצירת קשר'
      : 'Contact Deal Tours - we\'d love to help you plan the perfect trip. Phone, WhatsApp or contact form',
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: { 'he': `${BASE_URL}/he/contact`, 'en': `${BASE_URL}/en/contact` },
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
