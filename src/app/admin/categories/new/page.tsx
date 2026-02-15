'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Save, ImageIcon, Upload, Loader2 } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
  });

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
        setFormData({ ...formData, image: data.url });
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create category');
      }

      router.push('/admin/categories');
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(error.message || 'שגיאה ביצירת הקטגוריה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">קטגוריה חדשה</h1>
          <p className="text-slate-500">הוסף קטגוריה חדשה לאתר</p>
        </div>
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

              {/* OR Upload */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-400">או</span>
                </div>
              </div>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
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

              {/* Image Preview */}
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
              <p className="text-xs text-slate-500">מספר נמוך = מוצג קודם</p>
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
              {isSubmitting ? 'שומר...' : 'שמור קטגוריה'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
