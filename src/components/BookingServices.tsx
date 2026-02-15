'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Car, Building2, ArrowRight } from 'lucide-react';

export default function BookingServices() {
  const t = useTranslations('bookingServices');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Side — Service Cards */}
          <div className={`relative ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Card 1 — Book Car */}
            <div className="bg-primary-50/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary-100/50 hover:shadow-lg transition-all duration-300 group">
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <Car className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  <span className="relative inline-block">
                    {t('carTitle')}
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[4px] bg-accent-400 rounded-full opacity-70" />
                  </span>
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base mb-5">
                {t('carDescription')}
              </p>
              <button className={`inline-flex items-center gap-2 font-semibold text-slate-800 group/btn hover:gap-3 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('explore')}
                <span className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center group-hover/btn:bg-primary-700 transition-colors">
                  <ArrowRight className={`w-4 h-4 text-white ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </button>
            </div>

            {/* Small decorative curl between cards */}
            <div className={`hidden lg:flex py-1 ${isRTL ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
              <svg
                className="w-10 h-8 text-accent-400"
                viewBox="0 0 40 32"
                fill="none"
              >
                <path
                  d={isRTL
                    ? 'M5 5 C15 2, 25 8, 20 18 C16 26, 8 28, 5 22'
                    : 'M35 5 C25 2, 15 8, 20 18 C24 26, 32 28, 35 22'
                  }
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Card 2 — Book Hotel */}
            <div className="bg-primary-50/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary-100/50 hover:shadow-lg transition-all duration-300 group">
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <Building2 className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                  <span className="relative inline-block">
                    {t('hotelTitle')}
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[4px] bg-accent-400 rounded-full opacity-70" />
                  </span>
                </h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base mb-5">
                {t('hotelDescription')}
              </p>
              <button className={`inline-flex items-center gap-2 font-semibold text-slate-800 group/btn hover:gap-3 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('explore')}
                <span className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center group-hover/btn:bg-primary-700 transition-colors">
                  <ArrowRight className={`w-4 h-4 text-white ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </button>
            </div>

            {/* Decorative arrow — curves from cards toward the image */}
            <svg
              className={`hidden lg:block absolute pointer-events-none z-10 ${
                isRTL
                  ? 'left-[-60px] top-[40%]'
                  : 'right-[-60px] top-[40%]'
              }`}
              width="140"
              height="120"
              viewBox="0 0 140 120"
              fill="none"
            >
              <path
                d={
                  isRTL
                    ? 'M130 20 C100 10, 60 15, 40 40 C20 65, 10 85, 20 105'
                    : 'M10 20 C40 10, 80 15, 100 40 C120 65, 130 85, 120 105'
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
                    ? 'M14 98 L20 105 L27 100'
                    : 'M113 100 L120 105 L126 98'
                }
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Right Side — Image */}
          <div className={`relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] max-w-lg mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"
                alt="Santorini view"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Decorative blurs */}
            <div className={`absolute -bottom-4 ${isRTL ? '-left-4' : '-right-4'} w-20 h-20 bg-accent-400/15 rounded-full blur-xl`} />
            <div className={`absolute -top-4 ${isRTL ? '-right-4' : '-left-4'} w-14 h-14 bg-primary-400/15 rounded-full blur-xl`} />
          </div>
        </div>
      </div>
    </section>
  );
}
