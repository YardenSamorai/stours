'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isRTL = locale === 'he';

  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');

  return (
    <div className="bg-white rounded-2xl shadow-xl px-6 py-5 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-end gap-4">
        {/* Location */}
        <div className="flex-1 w-full">
          <label className="block text-slate-500 text-xs font-semibold mb-1.5 uppercase tracking-wide text-start">
            {t('searchPlaceholder')}
          </label>
          <div className="relative">
            <MapPin className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t('searchInputPlaceholder')}
              className={`w-full ${isRTL ? 'pr-6 pl-2' : 'pl-6 pr-2'} py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none border-b-2 border-slate-100 focus:border-primary-500 transition-colors text-sm bg-transparent`}
            />
            <ChevronDown className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none`} />
          </div>
        </div>

        {/* Divider - desktop only */}
        <div className="hidden md:block w-px h-10 bg-slate-200" />

        {/* Date */}
        <div className="flex-1 w-full">
          <label className="block text-slate-500 text-xs font-semibold mb-1.5 uppercase tracking-wide text-start">
            {t('departure')}
          </label>
          <div className="relative">
            <Calendar className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full ${isRTL ? 'pr-6 pl-2' : 'pl-6 pr-2'} py-2 text-slate-800 focus:outline-none border-b-2 border-slate-100 focus:border-primary-500 transition-colors text-sm bg-transparent`}
            />
          </div>
        </div>

        {/* Divider - desktop only */}
        <div className="hidden md:block w-px h-10 bg-slate-200" />

        {/* Guests */}
        <div className="flex-1 w-full">
          <label className="block text-slate-500 text-xs font-semibold mb-1.5 uppercase tracking-wide text-start">
            {t('travelers')}
          </label>
          <div className="relative">
            <Users className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={`w-full ${isRTL ? 'pr-6 pl-2' : 'pl-6 pr-2'} py-2 text-slate-800 focus:outline-none border-b-2 border-slate-100 focus:border-primary-500 transition-colors text-sm bg-transparent appearance-none cursor-pointer`}
            >
              <option value="1">{t('traveler1')}</option>
              <option value="2">{t('traveler2')}</option>
              <option value="3">{t('traveler3')}</option>
              <option value="4">{t('traveler4')}</option>
              <option value="5">{t('traveler5')}</option>
            </select>
            <ChevronDown className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none`} />
          </div>
        </div>

        {/* Search Button */}
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 flex items-center gap-2 whitespace-nowrap shrink-0 w-full md:w-auto justify-center">
          <Search className="w-4 h-4" />
          {t('search')}
        </button>
      </div>
    </div>
  );
}
