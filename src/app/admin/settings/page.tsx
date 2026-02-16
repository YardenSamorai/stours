'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'contact' | 'social'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    siteName: 'דיל טורס',
    siteDescription: 'סוכנות הנסיעות המובילה בישראל',
    siteDescriptionEn: 'Israel\'s leading travel agency',
    phone: '052-511-8536',
    phoneDisplay: '03-1234567', // Phone number displayed in header
    email: 'dealtours.bookings@gmail.com',
    address: 'רחוב דיזנגוף 50, תל אביב',
    addressEn: '50 Dizengoff St, Tel Aviv',
    
    // Hero
    heroTitle: 'גלה את העולם',
    heroTitleEn: 'Discover the World',
    heroSubtitle: 'חופשות חלומיות במחירים שלא תאמינו',
    heroSubtitleEn: 'Dream vacations at unbelievable prices',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    
    // Social
    facebookUrl: 'https://facebook.com/dealtours',
    instagramUrl: 'https://instagram.com/dealtours',
    whatsappNumber: '972525118536',
  });

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        
        // Map API response to settings state
        if (data) {
          setSettings((prev) => ({
            ...prev,
            siteName: data.siteName?.value || prev.siteName,
            siteDescription: data.siteDescription?.value || prev.siteDescription,
            siteDescriptionEn: data.siteDescription?.valueEn || prev.siteDescriptionEn,
            phone: data.phone?.value || prev.phone,
            phoneDisplay: data.phoneDisplay?.value || prev.phoneDisplay,
            email: data.email?.value || prev.email,
            address: data.address?.value || prev.address,
            addressEn: data.address?.valueEn || prev.addressEn,
            heroTitle: data.heroTitle?.value || prev.heroTitle,
            heroTitleEn: data.heroTitle?.valueEn || prev.heroTitleEn,
            heroSubtitle: data.heroSubtitle?.value || prev.heroSubtitle,
            heroSubtitleEn: data.heroSubtitle?.valueEn || prev.heroSubtitleEn,
            heroImage: data.heroImage?.value || prev.heroImage,
            facebookUrl: data.facebookUrl?.value || prev.facebookUrl,
            instagramUrl: data.instagramUrl?.value || prev.instagramUrl,
            whatsappNumber: data.whatsappNumber?.value || prev.whatsappNumber,
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const settingsToSave = {
        siteName: { value: settings.siteName, group: 'general', label: 'שם האתר' },
        siteDescription: { value: settings.siteDescription, valueEn: settings.siteDescriptionEn, group: 'general', label: 'תיאור האתר' },
        phone: { value: settings.phone, group: 'contact', label: 'מספר טלפון (קישור)' },
        phoneDisplay: { value: settings.phoneDisplay, group: 'contact', label: 'מספר טלפון (תצוגה)' },
        email: { value: settings.email, group: 'contact', label: 'אימייל' },
        address: { value: settings.address, valueEn: settings.addressEn, group: 'contact', label: 'כתובת' },
        heroTitle: { value: settings.heroTitle, valueEn: settings.heroTitleEn, group: 'hero', label: 'כותרת Hero' },
        heroSubtitle: { value: settings.heroSubtitle, valueEn: settings.heroSubtitleEn, group: 'hero', label: 'תת כותרת Hero' },
        heroImage: { value: settings.heroImage, group: 'hero', label: 'תמונת Hero', type: 'image' },
        facebookUrl: { value: settings.facebookUrl, group: 'social', label: 'Facebook URL' },
        instagramUrl: { value: settings.instagramUrl, group: 'social', label: 'Instagram URL' },
        whatsappNumber: { value: settings.whatsappNumber, group: 'social', label: 'WhatsApp Number' },
      };

      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('שגיאה בשמירת ההגדרות. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'כללי', icon: Globe },
    { id: 'hero', label: 'Hero', icon: ImageIcon },
    { id: 'contact', label: 'פרטי קשר', icon: Phone },
    { id: 'social', label: 'רשתות חברתיות', icon: Facebook },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">הגדרות האתר</h1>
          <p className="text-slate-500">ערוך את התוכן וההגדרות של האתר</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">נשמר בהצלחה!</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
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
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline ml-2" />
                  מספר טלפון (קישור - tel:)
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="0525118536"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-1">מספר לקישור (ללא מקפים)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline ml-2" />
                  מספר טלפון (תצוגה)
                </label>
                <input
                  type="tel"
                  value={settings.phoneDisplay}
                  onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                  placeholder="03-1234567"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-1">מספר המוצג ב-Header</p>
              </div>
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
