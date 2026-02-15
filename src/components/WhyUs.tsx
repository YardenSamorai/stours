'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Award, Users, Headphones, Route } from 'lucide-react';

const stats = [
  {
    key: 'experience',
    icon: Award,
    number: '15+',
    color: 'bg-primary-600',
  },
  {
    key: 'clients',
    icon: Users,
    number: '1,200+',
    color: 'bg-accent-500',
  },
  {
    key: 'support',
    icon: Headphones,
    number: '24/7',
    color: 'bg-emerald-500',
  },
  {
    key: 'custom',
    icon: Route,
    number: '100%',
    color: 'bg-violet-500',
  },
];

export default function WhyUs() {
  const t = useTranslations('whyUs');
  const locale = useLocale();
  const isRTL = locale === 'he';

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`mb-14 ${isRTL ? 'text-right' : 'text-left'}`}>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="group bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
              >
                {/* Icon + Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    {stat.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-primary-600 transition-colors">
                  {t(stat.key)}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {t(`${stat.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
