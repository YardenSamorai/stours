'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Category, Deal } from '@/db/schema';
import { MapPin, Calendar, Star, ArrowRight } from 'lucide-react';

interface CategoryDealsProps {
  category: Category;
  deals: Deal[];
  locale: string;
}

export default function CategoryDeals({ category, deals, locale }: CategoryDealsProps) {
  const t = useTranslations('destinations');
  const isRTL = locale === 'he';

  const categoryTitle = locale === 'en' && category.titleEn ? category.titleEn : category.title;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-12 text-center">
          {category.image && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-lg">
              <Image
                src={category.image}
                alt={categoryTitle}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-3">{categoryTitle}</h1>
              </div>
            </div>
          )}
          {!category.image && (
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
              {categoryTitle}
            </h1>
          )}
        </div>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const dealTitle = locale === 'en' && deal.titleEn ? deal.titleEn : deal.title;
              const dealDestination = locale === 'en' && deal.destinationEn ? deal.destinationEn : deal.destination;
              const dealDescription = locale === 'en' && deal.descriptionEn ? deal.descriptionEn : deal.description;

              return (
                <Link
                  key={deal.id}
                  href={`/destinations/${deal.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  {deal.image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={deal.image}
                        alt={dealTitle}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {deal.tag && (
                        <div className="absolute top-4 start-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${deal.tagColor || 'bg-primary-500'}`}
                          >
                            {locale === 'en' && deal.tagEn ? deal.tagEn : deal.tag}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {dealTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{dealDestination}</span>
                    </div>

                    {dealDescription && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {dealDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-slate-700">
                          {deal.rating || '4.5'}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({deal.reviewsCount || 0})
                        </span>
                      </div>
                      {deal.nights && (
                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{deal.nights} {t('nights')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-2xl font-black text-primary-600">
                          {new Intl.NumberFormat('he-IL', {
                            style: 'currency',
                            currency: deal.currency || 'ILS',
                          }).format(Number(deal.price))}
                        </p>
                        {deal.originalPrice && Number(deal.originalPrice) > Number(deal.price) && (
                          <p className="text-sm text-slate-400 line-through">
                            {new Intl.NumberFormat('he-IL', {
                              style: 'currency',
                              currency: deal.currency || 'ILS',
                            }).format(Number(deal.originalPrice))}
                          </p>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 text-primary-600 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {t('bookNow')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500 mb-4">
              {locale === 'he' ? 'אין דילים זמינים בקטגוריה זו כרגע' : 'No deals available in this category at the moment'}
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              {locale === 'he' ? 'צפה בכל הדילים' : 'View all deals'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
