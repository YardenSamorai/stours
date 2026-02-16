'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';

// Fallback categories when DB is empty
const defaultCategories = [
  {
    id: 1,
    title: 'פירמידות',
    titleEn: 'Pyramid',
    slug: 'pyramid',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&q=80',
    link: null,
    isActive: true,
    order: 0,
  },
  {
    id: 2,
    title: 'הרים',
    titleEn: 'Mountain',
    slug: 'mountain',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
    link: null,
    isActive: true,
    order: 1,
  },
  {
    id: 3,
    title: 'מסגד',
    titleEn: 'The Mosque',
    slug: 'mosque',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&q=80',
    link: null,
    isActive: true,
    order: 2,
  },
  {
    id: 4,
    title: 'מדבר',
    titleEn: 'Desert',
    slug: 'desert',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80',
    link: null,
    isActive: true,
    order: 3,
  },
  {
    id: 5,
    title: 'מגדל',
    titleEn: 'Tower',
    slug: 'tower',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
    link: null,
    isActive: true,
    order: 4,
  },
  {
    id: 6,
    title: 'חוף',
    titleEn: 'Beach',
    slug: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    link: null,
    isActive: true,
    order: 5,
  },
];

type CategoryItem = {
  id: number;
  title: string;
  titleEn: string | null;
  slug: string | null;
  image: string | null;
  link: string | null;
  isActive: boolean | null;
  order: number | null;
};

export default function Categories() {
  const t = useTranslations('categories');
  const locale = useLocale();
  const isRTL = locale === 'he';
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Filter only active categories
          const active = data.filter((c: CategoryItem) => c.isActive);
          if (active.length > 0) {
            setCategories(active);
          }
        }
      } catch {
        // Keep default categories on error
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`mb-14 max-w-lg ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            <span className="relative inline-block">
              {t('title')}
              <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-accent-400 rounded-full opacity-80" />
            </span>
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Categories Grid - Oval Cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-5 md:gap-6">
          {categories.map((category) => {
            const label = isRTL
              ? category.title
              : category.titleEn || category.title;

            // Use slug for category page, or link if provided, or no link
            const categoryUrl = category.slug 
              ? `/categories/${category.slug}`
              : category.link || null;

            return (
              <div
                key={category.id}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Oval Image */}
                {categoryUrl ? (
                  <Link href={categoryUrl} className="block w-full">
                    <div className="relative w-full aspect-[3/4] rounded-[50%/40%] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={label}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 30vw, 16vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <span className="text-slate-400 text-xl">📷</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="relative w-full aspect-[3/4] rounded-[50%/40%] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={label}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 30vw, 16vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <span className="text-slate-400 text-xl">📷</span>
                        </div>
                      )}
                    </div>
                  )}

                {/* Label */}
                {categoryUrl ? (
                  <Link href={categoryUrl}>
                    <span className="mt-4 text-sm md:text-base font-semibold text-slate-700 group-hover:text-primary-600 transition-colors block">
                      {label}
                    </span>
                  </Link>
                ) : (
                  <span className="mt-4 text-sm md:text-base font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
