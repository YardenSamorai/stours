'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Deal } from '@/db/schema';
import Image from 'next/image';

const currencySymbols: Record<string, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
};

export default function Destinations() {
  const t = useTranslations('destinations');
  const locale = useLocale();
  const isRTL = locale === 'he';

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      if (Array.isArray(data)) {
        const activeDeals = data.filter((deal: Deal) => deal.isActive);
        const featured = activeDeals.filter((d: Deal) => d.isFeatured);
        setDeals(featured.length > 0 ? featured : activeDeals);
      }
    } catch {
      // No deals to show
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: isRTL ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </section>
    );
  }

  // Don't render the section at all if there are no deals
  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header with Navigation Arrows */}
        <div className="flex items-start justify-between mb-10">
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
              <span className="relative inline-block">
                {t('title')}
                <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-accent-400 rounded-full opacity-80" />
              </span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-md">
              {t('subtitle')}
            </p>
          </div>

          {/* Navigation Arrows */}
          {deals.length > 3 && (
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-primary-500 flex items-center justify-center transition-all duration-200 hover:bg-slate-50"
                aria-label="Previous"
              >
                <ArrowLeft className={`w-5 h-5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all duration-200 shadow-lg shadow-primary-500/30"
                aria-label="Next"
              >
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {deals.map((deal) => {
            const name = isRTL
              ? deal.destination || deal.title
              : deal.destinationEn || deal.titleEn || deal.destination;
            const currency = currencySymbols[deal.currency || 'USD'] || '$';

            return (
              <div
                key={deal.id}
                className="flex-shrink-0 w-[280px] md:w-[300px] bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group border border-slate-100"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden m-3 rounded-xl">
                  {deal.image ? (
                    <Image
                      src={deal.image}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="300px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-5 pb-5 pt-2">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    {name}
                  </h3>

                  {/* Nights & Reviews */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <span>{deal.nights || 1} {t('nights')}</span>
                    <span className="text-slate-300">|</span>
                    <span>{deal.reviewsCount || 0} {t('reviews')}</span>
                  </div>

                  {/* Price & Book Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">
                      {currency}{Number(deal.price).toFixed(2)}
                    </span>
                    <button className="px-5 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white rounded-lg text-sm font-semibold transition-all duration-200">
                      {t('bookNow')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
