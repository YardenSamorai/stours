'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Loader2,
  ImageIcon,
  GripVertical
} from 'lucide-react';
import type { Category } from '@/db/schema';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      await fetch(`/api/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.titleEn && c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-slate-800">קטגוריות</h1>
          <p className="text-slate-500">נהל את הקטגוריות המוצגות בדף הבית ({categories.length} קטגוריות)</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          קטגוריה חדשה
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש קטגוריות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
                !category.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-48 bg-slate-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                {/* Status Badge */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  category.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {category.isActive ? 'פעיל' : 'מוסתר'}
                </span>
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-slate-900/60 text-white">
                  סדר: {category.order}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{category.title}</h3>
                {category.titleEn && (
                  <p className="text-sm text-slate-500 mb-3" dir="ltr">{category.titleEn}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="עריכה"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Link>
                  <button
                    onClick={() => toggleActive(category)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={category.isActive ? 'הסתר' : 'הצג'}
                  >
                    {category.isActive ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
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
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">לא נמצאו קטגוריות</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף קטגוריה ראשונה
          </Link>
        </div>
      )}
    </div>
  );
}
