'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Save, Trash2, Loader2, ImageIcon, Upload, Images } from 'lucide-react';
import CategoryImagePicker from '@/components/admin/CategoryImagePicker';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchCategory();
  }, [resolvedParams.id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/${resolvedParams.id}`);
      if (!res.ok) throw new Error('Category not found');
      const data = await res.json();
      setFormData({
        title: data.title || '',
        titleEn: data.titleEn || '',
        slug: data.slug || '',
        image: data.image || '',
        link: data.link || '',
        isActive: data.isActive ?? true,
        order: data.order || 0,
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('שגיאה בטעינת הקטגוריה');
      router.push('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert('שגיאה בהעלאת התמונה');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update category');

      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('שגיאה בעדכון הקטגוריה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;

    try {
      await fetch(`/api/categories/${resolvedParams.id}`, { method: 'DELETE' });
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('שגיאה במחיקת הקטגוריה');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">עריכת קטגוריה</h1>
            <p className="text-slate-500">{formData.title}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          מחק
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm inline-flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'he'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🇮🇱 עברית
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'en'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🇺🇸 English
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">פרטים בסיסיים</h2>

              {activeTab === 'he' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    שם הקטגוריה (עברית) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="לדוגמה: חוף, הרים, מדבר..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g., Beach, Mountain, Desert..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug (מזהה URL) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="beach, mountain, desert..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  מזהה ייחודי ל-URL (רק אותיות באנגלית, מספרים ומקפים)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  קישור (אופציונלי)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/destinations/beach או https://..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">תמונה</h2>

              {/* Image Selection Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 rounded-xl font-medium text-primary-700 transition-colors"
                >
                  <Images className="w-5 h-5" />
                  בחר מתמונות מוכנות
                </button>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">העלה מהמחשב</span>
                    </>
                  )}
                </label>
              </div>

              {/* OR URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-400">או</span>
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  כתובת תמונה (URL)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">העלה תמונה מהמחשב</span>
                  </>
                )}
              </label>

              {formData.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">תצוגה מקדימה</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 aspect-[3/4] rounded-[50%/40%] overflow-hidden shadow-md bg-slate-100 mb-3">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {formData.title || 'שם הקטגוריה'}
                </span>
              </div>
            </div>

            {/* Order */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">סדר הצגה</h2>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">סטטוס</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded border-slate-300"
                />
                <span className="text-slate-700">פעיל (מוצג באתר)</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </div>
      </form>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <CategoryImagePicker
          value={formData.image}
          onChange={(url) => {
            setFormData({ ...formData, image: url });
            setShowImagePicker(false);
          }}
          categoryName={formData.title || formData.titleEn}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </div>
  );
}
