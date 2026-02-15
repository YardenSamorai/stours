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
  GripVertical,
  Loader2,
  Settings,
  Plane,
  Building2,
  Package,
  Car,
  Users,
  Shield,
  Map,
  Compass
} from 'lucide-react';
import type { Service, SectionSetting } from '@/db/schema';

const iconMap: Record<string, any> = {
  Plane,
  Building2,
  Package,
  Car,
  Users,
  Shield,
  Map,
  Compass,
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [sectionSettings, setSectionSettings] = useState<SectionSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchSectionSettings();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionSettings = async () => {
    try {
      const res = await fetch('/api/section-settings?key=services');
      const data = await res.json();
      setSectionSettings(data);
    } catch (error) {
      console.error('Error fetching section settings:', error);
    }
  };

  const toggleServiceActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק שירות זה?')) return;
    
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const updateSectionSettings = async (updates: Partial<SectionSetting>) => {
    try {
      await fetch('/api/section-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: 'services',
          ...sectionSettings,
          ...updates,
        }),
      });
      fetchSectionSettings();
    } catch (error) {
      console.error('Error updating section settings:', error);
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.key.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-slate-800">שירותים</h1>
          <p className="text-slate-500">נהל את השירותים המוצגים באתר ({services.length} שירותים)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
              showSettings 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            הגדרות תצוגה
          </button>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            שירות חדש
          </Link>
        </div>
      </div>

      {/* Section Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            הגדרות סקשן השירותים
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                הצג סקשן
              </label>
              <button
                onClick={() => updateSectionSettings({ isVisible: !sectionSettings?.isVisible })}
                className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${
                  sectionSettings?.isVisible !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {sectionSettings?.isVisible !== false ? '✓ מוצג' : '✗ מוסתר'}
              </button>
            </div>

            {/* Grid Columns */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                עמודות בגריד
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => updateSectionSettings({ gridCols: cols })}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                      (sectionSettings?.gridCols || 3) === cols
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Items */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                מקסימום פריטים
              </label>
              <select
                value={sectionSettings?.maxItems || 6}
                onChange={(e) => updateSectionSettings({ maxItems: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {[3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                צבע רקע
              </label>
              <select
                value={sectionSettings?.backgroundColor || ''}
                onChange={(e) => updateSectionSettings({ backgroundColor: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">ברירת מחדל</option>
                <option value="bg-white">לבן</option>
                <option value="bg-slate-50">אפור בהיר</option>
                <option value="bg-primary-50">כחול בהיר</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש שירותים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon || 'Plane'] || Plane;
            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow ${
                  !service.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">סדר: {service.order}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {service.isActive ? 'פעיל' : 'מוסתר'}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {service.description || 'אין תיאור'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-mono">{service.key}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="עריכה"
                    >
                      <Edit className="w-4 h-4 text-slate-500" />
                    </Link>
                    <button
                      onClick={() => toggleServiceActive(service)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title={service.isActive ? 'הסתר' : 'הצג'}
                    >
                      {service.isActive ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="מחק"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 mb-4">לא נמצאו שירותים</p>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף שירות ראשון
          </Link>
        </div>
      )}
    </div>
  );
}
