'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { 
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
  Umbrella,
  ArrowRight,
  Loader2
} from 'lucide-react';

const iconMap: Record<string, any> = {
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
  Umbrella,
};

interface ServiceData {
  id: number;
  key: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  icon: string;
  gradient: string;
  bgLight: string;
  iconBg: string;
  link?: string;
  isActive: boolean;
  order: number;
}

interface SectionSettings {
  isVisible: boolean;
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  badge?: string;
  badgeEn?: string;
  gridCols: number;
  maxItems: number;
  backgroundColor?: string;
}

// Default services for when database is empty
const defaultServices = [
  { 
    key: 'flights', 
    icon: 'Plane',
    gradient: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-50',
    iconBg: 'bg-blue-500'
  },
  { 
    key: 'hotels', 
    icon: 'Building2',
    gradient: 'from-violet-500 to-purple-400',
    bgLight: 'bg-violet-50',
    iconBg: 'bg-violet-500'
  },
  { 
    key: 'packages', 
    icon: 'Package',
    gradient: 'from-orange-500 to-amber-400',
    bgLight: 'bg-orange-50',
    iconBg: 'bg-orange-500'
  },
  { 
    key: 'carRental', 
    icon: 'Car',
    gradient: 'from-emerald-500 to-green-400',
    bgLight: 'bg-emerald-50',
    iconBg: 'bg-emerald-500'
  },
  { 
    key: 'tours', 
    icon: 'Users',
    gradient: 'from-indigo-500 to-blue-400',
    bgLight: 'bg-indigo-50',
    iconBg: 'bg-indigo-500'
  },
];

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale();
  const isRTL = locale === 'he';
  const [services, setServices] = useState<ServiceData[]>([]);
  const [settings, setSettings] = useState<SectionSettings>({
    isVisible: true,
    gridCols: 3,
    maxItems: 6,
  });
  const [loading, setLoading] = useState(true);
  const [useDefaults, setUseDefaults] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, settingsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/section-settings?key=services'),
      ]);
      
      const servicesData = await servicesRes.json();
      const settingsData = await settingsRes.json();
      
      if (Array.isArray(servicesData) && servicesData.length > 0) {
        const activeServices = servicesData
          .filter((s: ServiceData) => s.isActive)
          .sort((a: ServiceData, b: ServiceData) => a.order - b.order);
        setServices(activeServices);
        setUseDefaults(false);
      } else {
        setUseDefaults(true);
      }
      
      if (settingsData && !settingsData.error) {
        setSettings({
          isVisible: settingsData.isVisible ?? true,
          title: settingsData.title,
          titleEn: settingsData.titleEn,
          subtitle: settingsData.subtitle,
          subtitleEn: settingsData.subtitleEn,
          badge: settingsData.badge,
          badgeEn: settingsData.badgeEn,
          gridCols: settingsData.gridCols || 3,
          maxItems: settingsData.maxItems || 6,
          backgroundColor: settingsData.backgroundColor,
        });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setUseDefaults(true);
    } finally {
      setLoading(false);
    }
  };

  if (!settings.isVisible) {
    return null;
  }

  const displayServices = useDefaults ? defaultServices : services.slice(0, settings.maxItems);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`mb-14 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            <span className="relative inline-block">
              {locale === 'en' && settings.titleEn ? settings.titleEn : (settings.title || t('title'))}
              <span className="absolute -bottom-1 left-0 right-0 h-[5px] bg-accent-400 rounded-full opacity-80" />
            </span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-md">
            {locale === 'en' && settings.subtitleEn ? settings.subtitleEn : (settings.subtitle || t('subtitle'))}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Services Grid — Card Layout */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service) => {
              const IconComponent = iconMap[service.icon] || Plane;
              
              const title = useDefaults 
                ? t(`${service.key}.title`)
                : (locale === 'en' && service.titleEn ? service.titleEn : service.title);

              const description = useDefaults
                ? t(`${service.key}.description`)
                : (locale === 'en' && service.descriptionEn ? service.descriptionEn : service.description);

              return (
                <div
                  key={service.key}
                  className="group bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 ${service.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {title}
                  </h3>

                  {/* Description */}
                  {description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {description}
                    </p>
                  )}

                  {/* Learn More Link */}
                  <div className={`inline-flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('learnMore')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
