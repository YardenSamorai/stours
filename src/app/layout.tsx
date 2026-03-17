import { ClerkProvider } from '@clerk/nextjs';
import { heIL } from '@clerk/localizations';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'דיל טורס - סוכנות נסיעות | Deal Tours',
    template: '%s | דיל טורס',
  },
  description: 'סוכנות הנסיעות המובילה בישראל - חבילות נופש, טיסות ומלונות במחירים הטובים ביותר',
  openGraph: {
    type: 'website',
    siteName: 'Deal Tours - דיל טורס',
    locale: 'he_IL',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <GoogleAnalytics />
        <ClerkProvider 
          localization={heIL}
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
              card: 'shadow-xl',
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
