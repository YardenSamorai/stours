'use client';

import { useTranslations, useLocale } from 'next-intl';
import ImageGrid from './ImageGrid';
import SearchBar from './SearchBar';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-slate-50 pb-20">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative container mx-auto px-4 pt-28 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div
              className={`relative space-y-6 ${isRTL ? 'lg:order-2' : 'lg:order-1'} text-center lg:text-start`}
            >
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                <span className="block">{t('title')}</span>
                <span className="block text-primary-600 mt-1 relative inline-block">
                  {t('titleHighlight')}
                  {/* Yellow underline */}
                  <span className="absolute -bottom-1 left-0 right-0 h-[6px] bg-accent-400 rounded-full opacity-80" />
                </span>{' '}
                <span className="block mt-1">{t('titleEnd')}</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md mx-auto lg:mx-0">
                {t('subtitle')}
              </p>

              {/* Decorative Arrow — curves from text down toward search bar */}
              <svg
                className={`hidden lg:block absolute pointer-events-none z-10 ${
                  isRTL
                    ? 'left-4 bottom-[-120px]'
                    : 'left-4 bottom-[-120px]'
                }`}
                width="120"
                height="160"
                viewBox="0 0 120 160"
                fill="none"
              >
                <path
                  d={
                    isRTL
                      ? 'M100 0 C105 40, 80 60, 60 80 C40 100, 20 120, 30 155'
                      : 'M20 0 C15 40, 40 60, 60 80 C80 100, 100 120, 90 155'
                  }
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Arrowhead */}
                <path
                  d={
                    isRTL
                      ? 'M24 148 L30 155 L37 150'
                      : 'M83 150 L90 155 L96 148'
                  }
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Image Collage Column */}
            <div className={`hidden lg:block ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
              <ImageGrid />
            </div>

            {/* Mobile Image */}
            <div className="block lg:hidden">
              <div className="rounded-2xl overflow-hidden shadow-lg max-w-sm mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80"
                  alt="Travel destination"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar — positioned to overlap hero bottom */}
      <div className="relative z-20 -mt-10 mb-8">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
