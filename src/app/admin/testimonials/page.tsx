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
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Testimonial } from '@/db/schema';

type FilterType = 'all' | 'pending' | 'active';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !testimonial.isActive }),
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק המלצה זו?')) return;
    
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const pendingCount = testimonials.filter(t => !t.isActive).length;
  const activeCount = testimonials.filter(t => t.isActive).length;

  const filteredTestimonials = testimonials
    .filter(t => {
      if (filter === 'pending') return !t.isActive;
      if (filter === 'active') return t.isActive;
      return true;
    })
    .filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.destination?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

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
          <h1 className="text-2xl font-bold text-slate-800">המלצות</h1>
          <p className="text-slate-500">נהל את המלצות הלקוחות ({testimonials.length} המלצות)</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          המלצה חדשה
        </Link>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">
              {pendingCount} המלצות ממתינות לאישור
            </h3>
            <p className="text-sm text-amber-700">
              לקוחות השאירו המלצות חדשות. לחץ על כפתור העין כדי לאשר ולפרסם.
            </p>
          </div>
          <button
            onClick={() => setFilter('pending')}
            className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-lg font-medium transition-colors"
          >
            הצג ממתינות
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            הכל ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'pending'
                ? 'bg-amber-100 text-amber-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            ממתינות ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            מאושרות ({activeCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש המלצות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      {filteredTestimonials.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative ${
                !testimonial.isActive ? 'ring-2 ring-amber-300 ring-offset-2' : ''
              }`}
            >
              {/* Pending Badge */}
              {!testimonial.isActive && (
                <div className="absolute -top-3 -right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Clock className="w-3 h-3" />
                  ממתינה לאישור
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-800">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testimonial.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {testimonial.isActive ? 'פעיל' : 'ממתין'}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 mb-4 line-clamp-3">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {testimonial.destination && (
                  <span className="text-sm text-slate-500">
                    טיול ל{testimonial.destination}
                  </span>
                )}
                <div className="flex items-center gap-2 ms-auto">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}`}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="ערוך"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Link>
                  <button
                    onClick={() => toggleActive(testimonial)}
                    className={`p-2 rounded-lg transition-colors ${
                      testimonial.isActive
                        ? 'hover:bg-slate-100'
                        : 'hover:bg-green-100 bg-green-50'
                    }`}
                    title={testimonial.isActive ? 'הסתר' : 'אשר ופרסם'}
                  >
                    {testimonial.isActive ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 mb-4">
            {filter === 'pending' 
              ? 'אין המלצות ממתינות לאישור' 
              : filter === 'active'
              ? 'אין המלצות מאושרות'
              : 'לא נמצאו המלצות'}
          </p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף המלצה ראשונה
          </Link>
        </div>
      )}
    </div>
  );
}
