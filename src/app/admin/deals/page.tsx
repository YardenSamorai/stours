'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Eye, EyeOff, Star, Filter, Loader2,
  MapPin, Moon, Plane, Building2
} from 'lucide-react';
import type { Deal } from '@/db/schema';

const currencySymbols: Record<string, string> = { ILS: '₪', USD: '$', EUR: '€' };

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);

  useEffect(() => { fetchDeals(); }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      setDeals(data);
    } catch (error) { console.error('Error fetching deals:', error); }
    finally { setLoading(false); }
  };

  const toggleDealActive = async (deal: Deal) => {
    try {
      await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !deal.isActive }),
      });
      fetchDeals();
    } catch (error) { console.error('Error updating deal:', error); }
  };

  const deleteDeal = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק דיל זה?')) return;
    try {
      await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      fetchDeals();
    } catch (error) { console.error('Error deleting deal:', error); }
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    setSelectedDeals(prev =>
      prev.length === filteredDeals.length ? [] : filteredDeals.map(d => d.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">דילים וחבילות</h1>
          <p className="text-xs sm:text-sm text-slate-500">{deals.length} דילים</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">דיל חדש</span>
          <span className="xs:hidden">חדש</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש דילים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 sm:pr-10 pl-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {filteredDeals.length > 0 ? (
        <>
          {/* ===== MOBILE: Card Layout ===== */}
          <div className="space-y-3 md:hidden">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  {deal.image ? (
                    <img src={deal.image} alt={deal.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-400 text-[10px]">ללא תמונה</span>
                    </div>
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm truncate flex items-center gap-1">
                          {deal.title}
                          {deal.isFeatured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {deal.destination}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                        deal.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {deal.isActive ? 'פעיל' : 'מוסתר'}
                      </span>
                    </div>
                    {/* Meta row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="font-bold text-primary-600 text-sm">
                        {currencySymbols[deal.currency || 'ILS']}{Number(deal.price).toLocaleString()}
                      </span>
                      {deal.nights && (
                        <span className="flex items-center gap-0.5">
                          <Moon className="w-3 h-3" /> {deal.nights}
                        </span>
                      )}
                      {deal.tag && (
                        <span className="px-1.5 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-medium">
                          {deal.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Actions bar */}
                <div className="flex border-t border-slate-100 divide-x divide-slate-100">
                  <Link href={`/admin/deals/${deal.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                    <Edit className="w-3.5 h-3.5" /> עריכה
                  </Link>
                  <button onClick={() => toggleDealActive(deal)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                    {deal.isActive ? <><EyeOff className="w-3.5 h-3.5" /> הסתר</> : <><Eye className="w-3.5 h-3.5" /> הצג</>}
                  </button>
                  <button onClick={() => deleteDeal(deal.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> מחק
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP: Table Layout ===== */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-right">
                    <input type="checkbox" checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0} onChange={toggleSelectAll} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
                  </th>
                  <th className="p-4 text-right font-semibold text-slate-600">דיל</th>
                  <th className="p-4 text-right font-semibold text-slate-600">מחיר</th>
                  <th className="p-4 text-right font-semibold text-slate-600">לילות</th>
                  <th className="p-4 text-right font-semibold text-slate-600">תגית</th>
                  <th className="p-4 text-right font-semibold text-slate-600">סטטוס</th>
                  <th className="p-4 text-right font-semibold text-slate-600">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedDeals.includes(deal.id)} onChange={() => setSelectedDeals(prev => prev.includes(deal.id) ? prev.filter(id => id !== deal.id) : [...prev, deal.id])} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {deal.image ? (
                          <img src={deal.image} alt={deal.title} className="w-16 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-slate-400 text-xs">ללא תמונה</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {deal.title}
                            {deal.isFeatured && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                          </div>
                          <div className="text-sm text-slate-500">{deal.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">
                        {currencySymbols[deal.currency || 'ILS']}{Number(deal.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4"><span className="text-slate-600">{deal.nights} לילות</span></td>
                    <td className="p-4">
                      {deal.tag && <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">{deal.tag}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${deal.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {deal.isActive ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/deals/${deal.id}`} className="p-2 hover:bg-slate-100 rounded-lg" title="עריכה"><Edit className="w-4 h-4 text-slate-500" /></Link>
                        <button onClick={() => toggleDealActive(deal)} className="p-2 hover:bg-slate-100 rounded-lg" title={deal.isActive ? 'הסתר' : 'הצג'}>
                          {deal.isActive ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
                        </button>
                        <button onClick={() => deleteDeal(deal.id)} className="p-2 hover:bg-red-50 rounded-lg" title="מחק"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <p className="text-slate-500 mb-4">לא נמצאו דילים</p>
          <Link href="/admin/deals/new" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
            <Plus className="w-5 h-5" /> צור דיל ראשון
          </Link>
        </div>
      )}
    </div>
  );
}
