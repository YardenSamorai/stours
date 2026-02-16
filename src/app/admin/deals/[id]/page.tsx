'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Save, 
  Plus,
  X,
  Loader2
} from 'lucide-react';
import type { Deal } from '@/db/schema';
import LocationPicker from '@/components/admin/LocationPicker';
import ImageUploader from '@/components/admin/ImageUploader';

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    destination: '',
    destinationEn: '',
    country: '',
    countryEn: '',
    description: '',
    descriptionEn: '',
    price: '',
    originalPrice: '',
    currency: 'ILS',
    nights: '1',
    image: '',
    tag: '',
    tagEn: '',
    tagColor: 'bg-primary-500',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    includes: [''],
    includesEn: [''],
  });

  const [categories, setCategories] = useState<Array<{ id: number; title: string; titleEn: string | null }>>([]);

  const currencies = [
    { value: 'ILS', label: '₪ שקל', symbol: '₪' },
    { value: 'USD', label: '$ דולר', symbol: '$' },
    { value: 'EUR', label: '€ אירו', symbol: '€' },
  ];

  useEffect(() => {
    fetchDeal();
    fetchCategories();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data.filter((c: any) => c.isActive !== false));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const fetchDeal = async () => {
    try {
      const res = await fetch(`/api/deals/${id}`);
      if (!res.ok) throw new Error('Deal not found');
      const data: Deal = await res.json();
      
      setFormData({
        title: data.title || '',
        titleEn: data.titleEn || '',
        destination: data.destination || '',
        destinationEn: data.destinationEn || '',
        country: data.country || '',
        countryEn: data.countryEn || '',
        description: data.description || '',
        descriptionEn: data.descriptionEn || '',
        price: data.price?.toString() || '',
        originalPrice: data.originalPrice?.toString() || '',
        currency: data.currency || 'ILS',
        nights: data.nights?.toString() || '1',
        image: data.image || '',
        tag: data.tag || '',
        tagEn: data.tagEn || '',
        tagColor: data.tagColor || 'bg-primary-500',
        categoryId: data.categoryId?.toString() || '',
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        includes: (data.includes as string[])?.length ? data.includes as string[] : [''],
        includesEn: (data.includesEn as string[])?.length ? data.includesEn as string[] : [''],
      });
    } catch (error) {
      console.error('Error fetching deal:', error);
      alert('לא ניתן לטעון את הדיל');
      router.push('/admin/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price,
          originalPrice: formData.originalPrice || null,
          nights: parseInt(formData.nights),
          categoryId: formData.categoryId || null,
          includes: formData.includes.filter(i => i.trim()),
          includesEn: formData.includesEn.filter(i => i.trim()),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update deal');
      }
      
      router.push('/admin/deals');
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('שגיאה בעדכון הדיל. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInclude = (lang: 'he' | 'en') => {
    if (lang === 'he') {
      setFormData({ ...formData, includes: [...formData.includes, ''] });
    } else {
      setFormData({ ...formData, includesEn: [...formData.includesEn, ''] });
    }
  };

  const removeInclude = (index: number, lang: 'he' | 'en') => {
    if (lang === 'he') {
      setFormData({
        ...formData,
        includes: formData.includes.filter((_, i) => i !== index),
      });
    } else {
      setFormData({
        ...formData,
        includesEn: formData.includesEn.filter((_, i) => i !== index),
      });
    }
  };

  const updateInclude = (index: number, value: string, lang: 'he' | 'en') => {
    if (lang === 'he') {
      const newIncludes = [...formData.includes];
      newIncludes[index] = value;
      setFormData({ ...formData, includes: newIncludes });
    } else {
      const newIncludes = [...formData.includesEn];
      newIncludes[index] = value;
      setFormData({ ...formData, includesEn: newIncludes });
    }
  };

  const tagColors = [
    { value: 'bg-primary-500', label: 'כחול' },
    { value: 'bg-accent-500', label: 'כתום' },
    { value: 'bg-green-500', label: 'ירוק' },
    { value: 'bg-rose-500', label: 'ורוד' },
    { value: 'bg-amber-500', label: 'זהב' },
    { value: 'bg-violet-500', label: 'סגול' },
  ];

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
      <div className="flex items-center gap-4">
        <Link
          href="/admin/deals"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">עריכת דיל</h1>
          <p className="text-slate-500">עדכן את פרטי הדיל</p>
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
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      שם הדיל *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="לדוגמה: סנטוריני, יוון"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  {/* Location Picker */}
                  <LocationPicker
                    value={formData.destination}
                    onChange={(location) => {
                      setFormData({
                        ...formData,
                        destination: location.destination,
                        destinationEn: location.destinationEn || formData.destinationEn,
                        country: location.country,
                        countryEn: location.countryEn || formData.countryEn,
                      });
                    }}
                    placeholder="חפש עיר או יעד..."
                    label="יעד"
                  />
                  
                  {/* Country (Auto-filled) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      מדינה
                      {formData.country && (
                        <span className="text-green-600 text-xs ms-2">✓ מולא אוטומטית</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="תמולא אוטומטית לפי היעד"
className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      תיאור
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="תיאור הדיל..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deal Name (English)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g., Santorini, Greece"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Destination
                      </label>
                      <input
                        type="text"
                        value={formData.destinationEn}
                        onChange={(e) => setFormData({ ...formData, destinationEn: e.target.value })}
                        placeholder="Santorini"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.countryEn}
                        onChange={(e) => setFormData({ ...formData, countryEn: e.target.value })}
                        placeholder="Greece"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Deal description..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      dir="ltr"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Includes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {activeTab === 'he' ? 'מה כולל הדיל' : 'What\'s Included'}
              </h2>
              
              {(activeTab === 'he' ? formData.includes : formData.includesEn).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateInclude(index, e.target.value, activeTab)}
                    placeholder={activeTab === 'he' ? 'לדוגמה: טיסות הלוך ושוב' : 'e.g., Round-trip flights'}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir={activeTab === 'he' ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="button"
                    onClick={() => removeInclude(index, activeTab)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addInclude(activeTab)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                הוסף פריט
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">מחיר</h2>
              
              {/* Currency Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  מטבע
                </label>
                <div className="flex gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: curr.value })}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.currency === curr.value
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  מחיר ({currencies.find(c => c.value === formData.currency)?.symbol}) *
                </label>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {currencies.find(c => c.value === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2499"
                    className="w-full ps-10 pe-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  מחיר מקורי (לפני הנחה)
                </label>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {currencies.find(c => c.value === formData.currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="2999"
                    className="w-full ps-10 pe-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  מספר לילות
                </label>
                <input
                  type="number"
                  value={formData.nights}
                  onChange={(e) => setFormData({ ...formData, nights: e.target.value })}
                  min="1"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="תמונת הדיל"
              />
            </div>

            {/* Tag */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">תגית</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  טקסט התגית {activeTab === 'he' ? '(עברית)' : '(English)'}
                </label>
                <input
                  type="text"
                  value={activeTab === 'he' ? formData.tag : formData.tagEn}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [activeTab === 'he' ? 'tag' : 'tagEn']: e.target.value 
                  })}
                  placeholder={activeTab === 'he' ? 'פופולרי, מבצע, חדש...' : 'Popular, Sale, New...'}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir={activeTab === 'he' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  צבע התגית
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, tagColor: color.value })}
                      className={`w-8 h-8 rounded-lg ${color.value} ${
                        formData.tagColor === color.value
                          ? 'ring-2 ring-offset-2 ring-slate-400'
                          : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">הגדרות</h2>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded border-slate-300"
                />
                <span className="text-slate-700">פעיל (מוצג באתר)</span>
              </label>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  קטגוריה
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">ללא קטגוריה</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.title} {cat.titleEn ? `(${cat.titleEn})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded border-slate-300"
                />
                <span className="text-slate-700">מומלץ (מוצג בדף הבית)</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'שומר...' : 'עדכן דיל'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
