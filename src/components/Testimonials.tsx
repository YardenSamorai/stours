'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Star, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Testimonial } from '@/db/schema';
import Image from 'next/image';

/* ── Decorative Quote Icon ──────────────────────────────── */
function QuoteIcon() {
  return (
    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/20 mb-6">
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 md:w-10 md:h-10 text-white"
        fill="currentColor"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>
    </div>
  );
}

/* ── Decorative Circle Ring with Dots ───────────────────── */
function DecorativeRing() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 300"
      fill="none"
    >
      {/* Thin blue circle ring */}
      <circle
        cx="150"
        cy="150"
        r="140"
        stroke="#3b82f6"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.35"
      />
      {/* Outer accent ring - partial */}
      <circle
        cx="150"
        cy="150"
        r="148"
        stroke="#93c5fd"
        strokeWidth="1"
        strokeDasharray="3 12"
        opacity="0.2"
      />
      {/* Blue dots */}
      <circle cx="150" cy="8" r="5" fill="#3b82f6" opacity="0.6" />
      <circle cx="10" cy="170" r="4" fill="#3b82f6" opacity="0.8" />
      <circle cx="260" cy="60" r="3" fill="#93c5fd" opacity="0.5" />
    </svg>
  );
}

/* ── Yellow Curved Arrow ────────────────────────────────── */
function YellowArrow({ isRTL }: { isRTL: boolean }) {
  return (
    <svg
      className={`absolute -bottom-4 ${isRTL ? '-left-2 scale-x-[-1]' : '-right-2'} w-16 h-16 pointer-events-none`}
      viewBox="0 0 60 60"
      fill="none"
    >
      <path
        d="M10 10 C 25 10, 45 20, 45 40"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 35 L 45 42 L 50 35"
        stroke="#f59e0b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const isRTL = locale === 'he';

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?active=true');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (direction: 'next' | 'prev') => {
    if (animating || testimonials.length <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
      setAnimating(false);
    }, 200);
  };

  if (loading) {
    return (
      <section className="py-24 bg-slate-50/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[activeIndex];

  return (
    <section className="py-24 bg-slate-50/70 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Section Header ── */}
        <div className="flex items-start justify-between mb-16">
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
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

          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigate('prev')}
                disabled={animating}
                className="w-11 h-11 rounded-full border-2 border-slate-300 hover:border-primary-600 flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
                aria-label="Previous"
              >
                <ArrowLeft className={`w-4 h-4 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => navigate('next')}
                disabled={animating}
                className="w-11 h-11 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md shadow-primary-600/20 disabled:opacity-50"
                aria-label="Next"
              >
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* ── Testimonial Content ── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-opacity duration-200 ${
            animating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* ▸ LEFT — Person Image with Decorations */}
          <div className={`flex justify-center ${isRTL ? 'lg:order-2' : ''}`}>
            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px]">
              {/* Decorative ring + dots */}
              <DecorativeRing />

              {/* Soft blue background circle */}
              <div className="absolute inset-4 md:inset-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 opacity-60" />

              {/* Person image */}
              <div className="absolute inset-8 md:inset-10 rounded-full overflow-hidden shadow-xl border-4 border-white">
                {current.avatar ? (
                  <Image
                    src={current.avatar}
                    alt={isRTL ? current.name : current.nameEn || current.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-7xl font-bold">
                    {current.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Yellow curved arrow */}
              <YellowArrow isRTL={isRTL} />
            </div>
          </div>

          {/* ▸ RIGHT — Quote & Details */}
          <div className={`${isRTL ? 'lg:order-1 text-right' : 'text-left'} text-center lg:text-start`}>
            {/* Quote icon */}
            <div className={`${isRTL ? 'flex justify-end lg:justify-start' : ''}`}>
              <QuoteIcon />
            </div>

            {/* Testimonial text */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-lg">
              {isRTL ? current.text : current.textEn || current.text}
            </p>

            {/* Divider */}
            <div className="w-12 h-[2px] bg-slate-200 mb-6 mx-auto lg:mx-0" />

            {/* Author info */}
            <div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">
                {isRTL ? current.name : current.nameEn || current.name}
              </h4>
              {current.role && (
                <p className="text-slate-400 text-sm mb-3">
                  {isRTL ? current.role : current.roleEn || current.role}
                </p>
              )}
              {/* Star rating */}
              <div className={`flex items-center gap-1.5 ${isRTL ? 'justify-end lg:justify-start' : 'justify-center lg:justify-start'}`}>
                <span className="text-lg font-black text-slate-800">
                  {current.rating || 5}
                </span>
                <Star className="w-5 h-5 fill-accent-400 text-accent-400" />
              </div>
            </div>

            {/* Pagination dots */}
            {testimonials.length > 1 && (
              <div className={`flex items-center gap-2 mt-8 ${isRTL ? 'justify-end lg:justify-start' : 'justify-center lg:justify-start'}`}>
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!animating) {
                        setAnimating(true);
                        setTimeout(() => {
                          setActiveIndex(idx);
                          setAnimating(false);
                        }, 200);
                      }
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-8 h-2.5 bg-primary-600'
                        : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
