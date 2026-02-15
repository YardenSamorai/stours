'use client';

import { useState } from 'react';
import { 
  Save, 
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'contact' | 'social'>('general');
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    siteName: 'דיל טורס',
    siteDescription: 'סוכנות הנסיעות המובילה בישראל',
    siteDescriptionEn: 'Israel\'s leading travel agency',
    phone: '052-511-8536',
    email: 'Stours.bookings@gmail.com',
    address: 'רחוב דיזנגוף 50, תל אביב',
    addressEn: '50 Dizengoff St, Tel Aviv',
    
    // Hero
    heroTitle: 'גלה את העולם',
    heroTitleEn: 'Discover the World',
    heroSubtitle: 'חופשות חלומיות במחירים שלא תאמינו',
    heroSubtitleEn: 'Dream vacations at unbelievable prices',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    
    // Social
    facebookUrl: 'https://facebook.com/stours',
    instagramUrl: 'https://instagram.com/stours',
    whatsappNumber: '972525118536',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save to database
    console.log('Saving settings:', settings);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'כללי', icon: Globe },
    { id: 'hero', label: 'Hero', icon: ImageIcon },
    { id: 'contact', label: 'פרטי קשר', icon: Phone },
    { id: 'social', label: 'רשתות חברתיות', icon: Facebook },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">הגדרות האתר</h1>
          <p className="text-slate-500">ערוך את התוכן וההגדרות של האתר</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
              הגדרות כלליות
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                שם האתר
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תיאור האתר (עברית)
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תיאור האתר (English)
                </label>
                <textarea
                  value={settings.siteDescriptionEn}
                  onChange={(e) => setSettings({ ...settings, siteDescriptionEn: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
              הגדרות Hero (באנר ראשי)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  כותרת ראשית (עברית)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  כותרת ראשית (English)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleEn}
                  onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תת כותרת (עברית)
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תת כותרת (English)
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitleEn}
                  onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                תמונת רקע
              </label>
              <input
                type="url"
                value={settings.heroImage}
                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
              {settings.heroImage && (
                <img
                  src={settings.heroImage}
                  alt="Hero Preview"
                  className="mt-4 w-full h-48 object-cover rounded-xl"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
              פרטי התקשרות
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="w-4 h-4 inline ml-2" />
                טלפון
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline ml-2" />
                אימייל
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline ml-2" />
                  כתובת (עברית)
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline ml-2" />
                  כתובת (English)
                </label>
                <input
                  type="text"
                  value={settings.addressEn}
                  onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
              רשתות חברתיות
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Facebook className="w-4 h-4 inline ml-2" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Instagram className="w-4 h-4 inline ml-2" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MessageSquare className="w-4 h-4 inline ml-2" />
                מספר WhatsApp (כולל קידומת מדינה)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="972525118536"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
              <p className="text-xs text-slate-500 mt-1">
                דוגמה: 972525118536 (ללא מקף או רווח)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
