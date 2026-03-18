'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Save,
  Trash2,
  Loader2,
  Plane,
  Building2,
  Package,
  Car,
  Users,
  Shield,
  Map,
  Compass,
  Globe,
  Heart,
  Camera,
  Umbrella
} from 'lucide-react';

const availableIcons = [
  { name: 'Plane', icon: Plane, label: 'מטוס' },
  { name: 'Building2', icon: Building2, label: 'בניין' },
  { name: 'Package', icon: Package, label: 'חבילה' },
  { name: 'Car', icon: Car, label: 'רכב' },
  { name: 'Users', icon: Users, label: 'אנשים' },
  { name: 'Shield', icon: Shield, label: 'מגן' },
  { name: 'Map', icon: Map, label: 'מפה' },
  { name: 'Compass', icon: Compass, label: 'מצפן' },
  { name: 'Globe', icon: Globe, label: 'גלובוס' },
  { name: 'Heart', icon: Heart, label: 'לב' },
  { name: 'Camera', icon: Camera, label: 'מצלמה' },
  { name: 'Umbrella', icon: Umbrella, label: 'מטריה' },
];

const colorPresets = [
  { gradient: 'from-blue-500 to-cyan-400', bgLight: 'bg-blue-50', iconBg: 'bg-blue-500', label: 'כחול' },
  { gradient: 'from-violet-500 to-purple-400', bgLight: 'bg-violet-50', iconBg: 'bg-violet-500', label: 'סגול' },
  { gradient: 'from-orange-500 to-amber-400', bgLight: 'bg-orange-50', iconBg: 'bg-orange-500', label: 'כתום' },
  { gradient: 'from-emerald-500 to-green-400', bgLight: 'bg-emerald-50', iconBg: 'bg-emerald-500', label: 'ירוק' },
  { gradient: 'from-rose-500 to-pink-400', bgLight: 'bg-rose-50', iconBg: 'bg-rose-500', label: 'ורוד' },
  { gradient: 'from-indigo-500 to-blue-400', bgLight: 'bg-indigo-50', iconBg: 'bg-indigo-500', label: 'אינדיגו' },
  { gradient: 'from-teal-500 to-cyan-400', bgLight: 'bg-teal-50', iconBg: 'bg-teal-500', label: 'טורקיז' },
  { gradient: 'from-amber-500 to-yellow-400', bgLight: 'bg-amber-50', iconBg: 'bg-amber-500', label: 'זהב' },
];

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    icon: 'Plane',
    gradient: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    link: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchService();
  }, [resolvedParams.id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${resolvedParams.id}`);
      if (!res.ok) throw new Error('Service not found');
      const data = await res.json();
      setFormData({
        key: data.key || '',
        title: data.title || '',
        titleEn: data.titleEn || '',
        description: data.description || '',
        descriptionEn: data.descriptionEn || '',
        icon: data.icon || 'Plane',
        gradient: data.gradient || 'from-blue-500 to-cyan-400',
        bgLight: data.bgLight || 'bg-blue-50',
        iconBg: data.iconBg || 'bg-blue-500',
        link: data.link || '',
        isActive: data.isActive ?? true,
        order: data.order || 0,
      });
    } catch (error) {
      console.error('Error fetching service:', error);
      alert('שגיאה בטעינת השירות');
      router.push('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/services/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('שגיאה בעדכון השירות. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק שירות זה?')) return;
    
    try {
      await fetch(`/api/services/${resolvedParams.id}`, { method: 'DELETE' });
      router.push('/admin/services');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('שגיאה במחיקת השירות');
    }
  };

  const setColorPreset = (preset: typeof colorPresets[0]) => {
    setFormData({
      ...formData,
      gradient: preset.gradient,
      bgLight: preset.bgLight,
      iconBg: preset.iconBg,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const selectedIcon = availableIcons.find(i => i.name === formData.icon);
  const IconComponent = selectedIcon?.icon || Plane;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">עריכת שירות</h1>
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">פרטים בסיסיים</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  מזהה (key) *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                  placeholder="לדוגמה: flights, hotels, car_rental"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  dir="ltr"
                />
              </div>

              {activeTab === 'he' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      שם השירות *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="לדוגמה: טיסות"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      תיאור
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="תיאור קצר של השירות..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g., Flights"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder="Brief description of the service..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      dir="ltr"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  קישור (אופציונלי)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/services/flights או https://..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">אייקון</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableIcons.map((iconOption) => (
                  <button
                    key={iconOption.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconOption.name })}
                    className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                      formData.icon === iconOption.name
                        ? 'bg-primary-100 ring-2 ring-primary-500'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    title={iconOption.label}
                  >
                    <iconOption.icon className="w-6 h-6 text-slate-700" />
                    <span className="text-xs text-slate-600">{iconOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">צבע</h2>
              <div className="grid grid-cols-4 gap-3">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setColorPreset(preset)}
                    className={`p-4 rounded-xl transition-all ${
                      formData.iconBg === preset.iconBg
                        ? 'ring-2 ring-primary-500 ring-offset-2'
                        : ''
                    }`}
                  >
                    <div className={`w-full h-12 ${preset.iconBg} rounded-lg mb-2`} />
                    <span className="text-sm text-slate-600">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">תצוגה מקדימה</h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className={`w-14 h-14 ${formData.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {formData.title || 'שם השירות'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {formData.description || 'תיאור השירות יופיע כאן...'}
                </p>
              </div>
            </div>

            {/* Order */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
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
    </div>
  );
}
