import { ClerkProvider } from '@clerk/nextjs';
import { heIL } from '@clerk/localizations';
import './globals.css';

export const metadata = {
  title: 'Deal Tours - סוכנות נסיעות',
  description: 'סוכנות הנסיעות המובילה בישראל',
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
