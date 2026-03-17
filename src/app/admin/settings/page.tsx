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
  CheckCircle,
  Info,
  Plus,
  Trash2
} from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  labelEn: string;
}

interface ValueItem {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'contact' | 'social' | 'about'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    siteName: 'דיל טורס',
    siteDescription: 'סוכנות הנסיעות המובילה בישראל',
    siteDescriptionEn: 'Israel\'s leading travel agency',
    phone: '052-511-8536',
    phoneDisplay: '03-1234567',
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
    tiktokUrl: '',
    youtubeUrl: '',
    whatsappNumber: '972525118536',

    // Banner
    urgencyBanner: '',
    urgencyBannerEn: '',

    // About
    aboutStoryHeading: 'יותר מ-15 שנים של חוויות בלתי נשכחות',
    aboutStoryHeadingEn: 'Over 15 years of unforgettable experiences',
    aboutStoryText: '<p>דיל טורס נולדה מתוך תשוקה אמיתית לטיולים. הקמנו את החברה לפני למעלה מ-15 שנה עם חזון ברור: להפוך כל חלום של טיול למציאות.</p><p>אנחנו מאמינים שטיול הוא לא רק חופשה - זו חוויה שמשנה את החיים. לכן אנחנו שמים דגש על כל פרט קטן, מרגע התכנון ועד החזרה הביתה.</p><p>עם צוות של מומחים מנוסים ותשוקה אמיתית לשירות, אנחנו כאן כדי להבטיח שהטיול שלכם יהיה מושלם.</p>',
    aboutStoryTextEn: '<p>Deal Tours was born out of a true passion for travel. We established the company over 15 years ago with a clear vision: to turn every travel dream into reality.</p>',
    aboutStoryImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    aboutBadgeNumber: '15+',
    aboutBadgeLabel: 'שנות ניסיון',
    aboutBadgeLabelEn: 'Years of Experience',
    aboutMissionTitle: 'המשימה שלנו',
    aboutMissionTitleEn: 'Our Mission',
    aboutMissionText: '',
    aboutMissionTextEn: '',
    aboutVisionTitle: 'החזון שלנו',
    aboutVisionTitleEn: 'Our Vision',
    aboutVisionText: '',
    aboutVisionTextEn: '',
  });

  const [aboutStats, setAboutStats] = useState<StatItem[]>([
    { value: '15,000+', label: 'לקוחות מרוצים', labelEn: 'Happy Customers' },
    { value: '120+', label: 'יעדים', labelEn: 'Destinations' },
    { value: '15', label: 'שנות ניסיון', labelEn: 'Years of Experience' },
    { value: '98%', label: 'שביעות רצון', labelEn: 'Satisfaction' },
  ]);

  const [aboutValues, setAboutValues] = useState<ValueItem[]>([
    { title: 'אהבה לטיולים', titleEn: 'Love for Travel', description: 'אנחנו מטיילים בעצמנו ומביאים את החוויות שלנו אליכם', descriptionEn: 'We travel ourselves and bring our experiences to you' },
    { title: 'אמינות', titleEn: 'Reliability', description: 'שקיפות מלאה במחירים ובתנאים, ללא הפתעות', descriptionEn: 'Full transparency in prices and terms, no surprises' },
    { title: 'שירות אישי', titleEn: 'Personal Service', description: 'כל לקוח מקבל יחס אישי ומותאם לצרכים שלו', descriptionEn: 'Every customer gets personalized attention' },
    { title: 'מומחיות גלובלית', titleEn: 'Global Expertise', description: 'ניסיון עשיר ביעדים ברחבי העולם', descriptionEn: 'Rich experience in destinations worldwide' },
  ]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        
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
            tiktokUrl: data.tiktokUrl?.value || prev.tiktokUrl,
            youtubeUrl: data.youtubeUrl?.value || prev.youtubeUrl,
            whatsappNumber: data.whatsappNumber?.value || prev.whatsappNumber,
            urgencyBanner: data.urgencyBanner?.value || prev.urgencyBanner,
            urgencyBannerEn: data.urgencyBanner?.valueEn || prev.urgencyBannerEn,
            aboutStoryHeading: data.aboutStoryHeading?.value || prev.aboutStoryHeading,
            aboutStoryHeadingEn: data.aboutStoryHeading?.valueEn || prev.aboutStoryHeadingEn,
            aboutStoryText: data.aboutStoryText?.value || prev.aboutStoryText,
            aboutStoryTextEn: data.aboutStoryText?.valueEn || prev.aboutStoryTextEn,
            aboutStoryImage: data.aboutStoryImage?.value || prev.aboutStoryImage,
            aboutBadgeNumber: data.aboutBadgeNumber?.value || prev.aboutBadgeNumber,
            aboutBadgeLabel: data.aboutBadgeLabel?.value || prev.aboutBadgeLabel,
            aboutBadgeLabelEn: data.aboutBadgeLabel?.valueEn || prev.aboutBadgeLabelEn,
            aboutMissionTitle: data.aboutMissionTitle?.value || prev.aboutMissionTitle,
            aboutMissionTitleEn: data.aboutMissionTitle?.valueEn || prev.aboutMissionTitleEn,
            aboutMissionText: data.aboutMissionText?.value || prev.aboutMissionText,
            aboutMissionTextEn: data.aboutMissionText?.valueEn || prev.aboutMissionTextEn,
            aboutVisionTitle: data.aboutVisionTitle?.value || prev.aboutVisionTitle,
            aboutVisionTitleEn: data.aboutVisionTitle?.valueEn || prev.aboutVisionTitleEn,
            aboutVisionText: data.aboutVisionText?.value || prev.aboutVisionText,
            aboutVisionTextEn: data.aboutVisionText?.valueEn || prev.aboutVisionTextEn,
          }));

          if (data.aboutStats?.value) {
            try {
              setAboutStats(JSON.parse(data.aboutStats.value));
            } catch { /* keep defaults */ }
          }
          if (data.aboutValues?.value) {
            try {
              setAboutValues(JSON.parse(data.aboutValues.value));
            } catch { /* keep defaults */ }
          }
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
      const settingsToSave: Record<string, { value: string; valueEn?: string; group: string; label: string; type?: string }> = {
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
        tiktokUrl: { value: settings.tiktokUrl, group: 'social', label: 'TikTok URL' },
        youtubeUrl: { value: settings.youtubeUrl, group: 'social', label: 'YouTube URL' },
        whatsappNumber: { value: settings.whatsappNumber, group: 'social', label: 'WhatsApp Number' },
        urgencyBanner: { value: settings.urgencyBanner, valueEn: settings.urgencyBannerEn, group: 'general', label: 'באנר דחיפות' },
        aboutStoryHeading: { value: settings.aboutStoryHeading, valueEn: settings.aboutStoryHeadingEn, group: 'about', label: 'כותרת סיפור' },
        aboutStoryText: { value: settings.aboutStoryText, valueEn: settings.aboutStoryTextEn, group: 'about', label: 'טקסט סיפור', type: 'html' },
        aboutStoryImage: { value: settings.aboutStoryImage, group: 'about', label: 'תמונת סיפור', type: 'image' },
        aboutBadgeNumber: { value: settings.aboutBadgeNumber, group: 'about', label: 'מספר תג' },
        aboutBadgeLabel: { value: settings.aboutBadgeLabel, valueEn: settings.aboutBadgeLabelEn, group: 'about', label: 'תווית תג' },
        aboutMissionTitle: { value: settings.aboutMissionTitle, valueEn: settings.aboutMissionTitleEn, group: 'about', label: 'כותרת משימה' },
        aboutMissionText: { value: settings.aboutMissionText, valueEn: settings.aboutMissionTextEn, group: 'about', label: 'טקסט משימה' },
        aboutVisionTitle: { value: settings.aboutVisionTitle, valueEn: settings.aboutVisionTitleEn, group: 'about', label: 'כותרת חזון' },
        aboutVisionText: { value: settings.aboutVisionText, valueEn: settings.aboutVisionTextEn, group: 'about', label: 'טקסט חזון' },
        aboutStats: { value: JSON.stringify(aboutStats), group: 'about', label: 'סטטיסטיקות', type: 'json' },
        aboutValues: { value: JSON.stringify(aboutValues), group: 'about', label: 'ערכים', type: 'json' },
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
    { id: 'about', label: 'אודות', icon: Info },
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

            {/* Urgency Banner */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-md font-semibold text-slate-700 mb-3">באנר דחיפות (מעל ההדר)</h3>
              <p className="text-xs text-slate-500 mb-3">השאירו ריק כדי להסתיר. לדוגמה: &quot;מבצע מוגבל! 20% הנחה על חבילות ליוון — נגמר ביום שישי&quot;</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט (עברית)</label>
                  <input
                    type="text"
                    value={settings.urgencyBanner}
                    onChange={(e) => setSettings({ ...settings, urgencyBanner: e.target.value })}
                    placeholder="מבצע מוגבל! 20% הנחה..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט (English)</label>
                  <input
                    type="text"
                    value={settings.urgencyBannerEn}
                    onChange={(e) => setSettings({ ...settings, urgencyBannerEn: e.target.value })}
                    placeholder="Limited offer! 20% off..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
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
                TikTok URL
              </label>
              <input
                type="url"
                value={settings.tiktokUrl}
                onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@..."
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

        {activeTab === 'about' && (
          <div className="space-y-8">
            {/* Story Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
                סיפור החברה
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת (עברית)</label>
                  <input
                    type="text"
                    value={settings.aboutStoryHeading}
                    onChange={(e) => setSettings({ ...settings, aboutStoryHeading: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת (English)</label>
                  <input
                    type="text"
                    value={settings.aboutStoryHeadingEn}
                    onChange={(e) => setSettings({ ...settings, aboutStoryHeadingEn: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט (עברית) — HTML</label>
                  <textarea
                    value={settings.aboutStoryText}
                    onChange={(e) => setSettings({ ...settings, aboutStoryText: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                    placeholder="<p>פסקה ראשונה</p><p>פסקה שנייה</p>"
                  />
                  <p className="text-xs text-slate-500 mt-1">ניתן לכתוב HTML (תגיות p, strong, em וכו&apos;)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט (English) — HTML</label>
                  <textarea
                    value={settings.aboutStoryTextEn}
                    onChange={(e) => setSettings({ ...settings, aboutStoryTextEn: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                    dir="ltr"
                    placeholder="<p>First paragraph</p><p>Second paragraph</p>"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">תמונת סיפור</label>
                <input
                  type="url"
                  value={settings.aboutStoryImage}
                  onChange={(e) => setSettings({ ...settings, aboutStoryImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
                {settings.aboutStoryImage && (
                  <img src={settings.aboutStoryImage} alt="Story Preview" className="mt-3 w-48 h-32 object-cover rounded-xl" />
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">מספר תג (למשל 15+)</label>
                  <input
                    type="text"
                    value={settings.aboutBadgeNumber}
                    onChange={(e) => setSettings({ ...settings, aboutBadgeNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">תווית תג (עברית)</label>
                  <input
                    type="text"
                    value={settings.aboutBadgeLabel}
                    onChange={(e) => setSettings({ ...settings, aboutBadgeLabel: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">תווית תג (English)</label>
                  <input
                    type="text"
                    value={settings.aboutBadgeLabelEn}
                    onChange={(e) => setSettings({ ...settings, aboutBadgeLabelEn: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 pb-4 border-b border-slate-200">
                משימה וחזון
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת משימה (עברית)</label>
                  <input
                    type="text"
                    value={settings.aboutMissionTitle}
                    onChange={(e) => setSettings({ ...settings, aboutMissionTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת משימה (English)</label>
                  <input
                    type="text"
                    value={settings.aboutMissionTitleEn}
                    onChange={(e) => setSettings({ ...settings, aboutMissionTitleEn: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט משימה (עברית)</label>
                  <textarea
                    value={settings.aboutMissionText}
                    onChange={(e) => setSettings({ ...settings, aboutMissionText: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט משימה (English)</label>
                  <textarea
                    value={settings.aboutMissionTextEn}
                    onChange={(e) => setSettings({ ...settings, aboutMissionTextEn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת חזון (עברית)</label>
                  <input
                    type="text"
                    value={settings.aboutVisionTitle}
                    onChange={(e) => setSettings({ ...settings, aboutVisionTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">כותרת חזון (English)</label>
                  <input
                    type="text"
                    value={settings.aboutVisionTitleEn}
                    onChange={(e) => setSettings({ ...settings, aboutVisionTitleEn: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט חזון (עברית)</label>
                  <textarea
                    value={settings.aboutVisionText}
                    onChange={(e) => setSettings({ ...settings, aboutVisionText: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">טקסט חזון (English)</label>
                  <textarea
                    value={settings.aboutVisionTextEn}
                    onChange={(e) => setSettings({ ...settings, aboutVisionTextEn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">ערכים</h2>
                <button
                  type="button"
                  onClick={() => setAboutValues([...aboutValues, { title: '', titleEn: '', description: '', descriptionEn: '' }])}
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" /> הוסף ערך
                </button>
              </div>
              {aboutValues.map((val, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setAboutValues(aboutValues.filter((_, i) => i !== idx))}
                    className="absolute top-3 left-3 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => { const c = [...aboutValues]; c[idx] = { ...c[idx], title: e.target.value }; setAboutValues(c); }}
                      placeholder="כותרת (עברית)"
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <input
                      type="text"
                      value={val.titleEn}
                      onChange={(e) => { const c = [...aboutValues]; c[idx] = { ...c[idx], titleEn: e.target.value }; setAboutValues(c); }}
                      placeholder="Title (English)"
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <textarea
                      value={val.description}
                      onChange={(e) => { const c = [...aboutValues]; c[idx] = { ...c[idx], description: e.target.value }; setAboutValues(c); }}
                      placeholder="תיאור (עברית)"
                      rows={2}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                    />
                    <textarea
                      value={val.descriptionEn}
                      onChange={(e) => { const c = [...aboutValues]; c[idx] = { ...c[idx], descriptionEn: e.target.value }; setAboutValues(c); }}
                      placeholder="Description (English)"
                      rows={2}
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">סטטיסטיקות</h2>
                <button
                  type="button"
                  onClick={() => setAboutStats([...aboutStats, { value: '', label: '', labelEn: '' }])}
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" /> הוסף סטטיסטיקה
                </button>
              </div>
              {aboutStats.map((stat, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                  <button
                    type="button"
                    onClick={() => setAboutStats(aboutStats.filter((_, i) => i !== idx))}
                    className="absolute top-3 left-3 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => { const c = [...aboutStats]; c[idx] = { ...c[idx], value: e.target.value }; setAboutStats(c); }}
                      placeholder="ערך (למשל 15,000+)"
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => { const c = [...aboutStats]; c[idx] = { ...c[idx], label: e.target.value }; setAboutStats(c); }}
                      placeholder="תווית (עברית)"
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <input
                      type="text"
                      value={stat.labelEn}
                      onChange={(e) => { const c = [...aboutStats]; c[idx] = { ...c[idx], labelEn: e.target.value }; setAboutStats(c); }}
                      placeholder="Label (English)"
                      className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
