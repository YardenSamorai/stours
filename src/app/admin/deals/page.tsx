'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Star,
  Filter,
  Loader2
} from 'lucide-react';
import type { Deal } from '@/db/schema';

const currencySymbols: Record<string, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<number[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDealActive = async (deal: Deal) => {
    try {
      await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !deal.isActive }),
      });
      fetchDeals();
    } catch (error) {
      console.error('Error updating deal:', error);
    }
  };

  const deleteDeal = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק דיל זה?')) return;
    
    try {
      await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredDeals.map(d => d.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">דילים וחבילות</h1>
          <p className="text-slate-500">נהל את כל הדילים והחבילות באתר ({deals.length} דילים)</p>
        </div>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          דיל חדש
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="חיפוש דילים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600">סינון</span>
          </button>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredDeals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-right">
                    <input
                      type="checkbox"
                      checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-primary-600 rounded border-slate-300"
                    />
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
                      <input
                        type="checkbox"
                        checked={selectedDeals.includes(deal.id)}
                        onChange={() => {
                          setSelectedDeals(prev =>
                            prev.includes(deal.id)
                              ? prev.filter(id => id !== deal.id)
                              : [...prev, deal.id]
                          );
                        }}
                        className="w-4 h-4 text-primary-600 rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {deal.image ? (
                          <img
                            src={deal.image}
                            alt={deal.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-slate-400 text-xs">ללא תמונה</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {deal.title}
                            {deal.isFeatured && (
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <div className="text-sm text-slate-500">{deal.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">
                        {currencySymbols[deal.currency || 'ILS']}{Number(deal.price).toLocaleString()}
                      </span>
                      {deal.currency && deal.currency !== 'ILS' && (
                        <span className="text-xs text-slate-500 ms-1">({deal.currency})</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600">{deal.nights} לילות</span>
                    </td>
                    <td className="p-4">
                      {deal.tag && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {deal.tag}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        deal.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {deal.isActive ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/deals/${deal.id}`}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="עריכה"
                        >
                          <Edit className="w-4 h-4 text-slate-500" />
                        </Link>
                        <button
                          onClick={() => toggleDealActive(deal)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title={deal.isActive ? 'הסתר' : 'הצג'}
                        >
                          {deal.isActive ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteDeal(deal.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="מחק"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 mb-4">לא נמצאו דילים</p>
            <Link
              href="/admin/deals/new"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              צור דיל ראשון
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
