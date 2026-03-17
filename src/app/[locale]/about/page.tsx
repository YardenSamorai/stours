import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Award, Users, Globe, Shield, Heart, Plane } from 'lucide-react';
import type { Metadata } from 'next';
import { db, siteSettings, teamMembers } from '@/db';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHebrew = locale === 'he';
  return {
    title: isHebrew ? 'אודות דיל טורס - הסיפור שלנו' : 'About Deal Tours - Our Story',
    description: isHebrew
      ? 'הכירו את דיל טורס - סוכנות נסיעות עם למעלה מ-15 שנות ניסיון, צוות מומחים ושירות אישי'
      : 'Meet Deal Tours - a travel agency with over 15 years of experience, expert team and personal service',
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: { 'he': `${BASE_URL}/he/about`, 'en': `${BASE_URL}/en/about` },
    },
  };
}

interface StatItem { value: string; label: string; labelEn: string; }
interface ValueItem { title: string; titleEn: string; description: string; descriptionEn: string; }

const defaultValues: ValueItem[] = [
  { title: 'אהבה לטיולים', titleEn: 'Love for Travel', description: 'אנחנו מטיילים בעצמנו ומביאים את החוויות שלנו אליכם', descriptionEn: 'We travel ourselves and bring our experiences to you' },
  { title: 'אמינות', titleEn: 'Reliability', description: 'שקיפות מלאה במחירים ובתנאים, ללא הפתעות', descriptionEn: 'Full transparency in prices and terms, no surprises' },
  { title: 'שירות אישי', titleEn: 'Personal Service', description: 'כל לקוח מקבל יחס אישי ומותאם לצרכים שלו', descriptionEn: 'Every customer gets personalized attention' },
  { title: 'מומחיות גלובלית', titleEn: 'Global Expertise', description: 'ניסיון עשיר ביעדים ברחבי העולם', descriptionEn: 'Rich experience in destinations worldwide' },
];

const defaultStats: StatItem[] = [
  { value: '15,000+', label: 'לקוחות מרוצים', labelEn: 'Happy Customers' },
  { value: '120+', label: 'יעדים', labelEn: 'Destinations' },
  { value: '15', label: 'שנות ניסיון', labelEn: 'Years of Experience' },
  { value: '98%', label: 'שביעות רצון', labelEn: 'Satisfaction' },
];

const defaultTeam = [
  { name: 'יעל כהן', nameEn: 'Yael Cohen', role: 'מנכ״לית', roleEn: 'CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'אורי לוי', nameEn: 'Ori Levi', role: 'מנהל מכירות', roleEn: 'Sales Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'מיכל אברהם', nameEn: 'Michal Avraham', role: 'מומחית אירופה', roleEn: 'Europe Specialist', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
  { name: 'דני ברק', nameEn: 'Dani Barak', role: 'מומחה מזרח רחוק', roleEn: 'Far East Specialist', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
];

const valueIcons = [Heart, Shield, Users, Globe];

async function getAboutData() {
  const [settingsRows, teamRows] = await Promise.all([
    db.select().from(siteSettings).where(eq(siteSettings.group, 'about')),
    db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.order)),
  ]);

  const s: Record<string, { value: string | null; valueEn: string | null }> = {};
  settingsRows.forEach(row => {
    s[row.key] = { value: row.value, valueEn: row.valueEn };
  });

  let stats = defaultStats;
  let values = defaultValues;

  if (s.aboutStats?.value) {
    try { stats = JSON.parse(s.aboutStats.value); } catch { /* keep defaults */ }
  }
  if (s.aboutValues?.value) {
    try { values = JSON.parse(s.aboutValues.value); } catch { /* keep defaults */ }
  }

  const team = teamRows.length > 0 ? teamRows : defaultTeam;

  return { s, stats, values, team };
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isHebrew = locale === 'he';

  const { s, stats, values, team } = await getAboutData();

  const get = (key: string, fallback: string, fallbackEn?: string) => {
    const entry = s[key];
    if (!entry) return fallback;
    if (isHebrew) return entry.value || fallback;
    return entry.valueEn || fallbackEn || entry.value || fallback;
  };

  const heroTitle = isHebrew ? 'אודות דיל טורס' : 'About Deal Tours';
  const heroDescription = isHebrew
    ? 'דיל טורס הוקמה מתוך אהבה לטיולים ותשוקה לשירות. אנחנו כאן כדי להפוך כל חלום לחוויה אמיתית.'
    : 'Deal Tours was founded out of love for travel and passion for service. We\'re here to turn every dream into a real experience.';

  const storyHeading = get('aboutStoryHeading',
    'יותר מ-15 שנים של חוויות בלתי נשכחות',
    'Over 15 years of unforgettable experiences'
  );

  const storyHtml = get('aboutStoryText',
    '<p>דיל טורס נולדה מתוך תשוקה אמיתית לטיולים. הקמנו את החברה לפני למעלה מ-15 שנה עם חזון ברור: להפוך כל חלום של טיול למציאות.</p><p>אנחנו מאמינים שטיול הוא לא רק חופשה - זו חוויה שמשנה את החיים. לכן אנחנו שמים דגש על כל פרט קטן, מרגע התכנון ועד החזרה הביתה.</p><p>עם צוות של מומחים מנוסים ותשוקה אמיתית לשירות, אנחנו כאן כדי להבטיח שהטיול שלכם יהיה מושלם.</p>',
    '<p>Deal Tours was born out of a true passion for travel. We established the company over 15 years ago with a clear vision: to turn every travel dream into reality.</p>'
  );

  const storyImage = get('aboutStoryImage',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
  );

  const badgeNumber = get('aboutBadgeNumber', '15+');
  const badgeLabel = get('aboutBadgeLabel', 'שנות ניסיון', 'Years of Experience');

  const missionTitle = get('aboutMissionTitle', isHebrew ? 'המשימה שלנו' : 'Our Mission');
  const missionText = get('aboutMissionText',
    isHebrew ? 'להנגיש טיולים איכותיים לכל אחד ולהעניק שירות אישי ומקצועי' : 'To make quality travel accessible to everyone and provide personal and professional service'
  );
  const visionTitle = get('aboutVisionTitle', isHebrew ? 'החזון שלנו' : 'Our Vision');
  const visionText = get('aboutVisionText',
    isHebrew ? 'להיות סוכנות הנסיעות המובילה והאמינה ביותר בישראל' : 'To be the leading and most trusted travel agency in Israel'
  );

  const valuesTitle = isHebrew ? 'למה לבחור בנו?' : 'Why Choose Us?';

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6">
              <Plane className="w-4 h-4" />
              {isHebrew ? 'הכירו אותנו' : 'Get to Know Us'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
            <path d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 19.3C1200 16.7 1320 11 1380 8.30001L1440 5.70001V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" />
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
                {isHebrew ? 'הסיפור שלנו' : 'Our Story'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                {storyHeading}
              </h2>
              <div
                className="space-y-4 text-lg text-slate-600 leading-relaxed prose prose-p:my-3"
                dangerouslySetInnerHTML={{ __html: storyHtml }}
              />
            </div>
            <div className="relative">
              <Image
                src={storyImage}
                alt={isHebrew ? 'נוף טבעי מרהיב' : 'Beautiful natural landscape'}
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -start-6 bg-accent-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">{badgeNumber}</div>
                <div className="text-accent-100">{badgeLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              {isHebrew ? 'הערכים שלנו' : 'Our Values'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              {valuesTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {isHebrew ? value.title : (value.titleEn || value.title)}
                  </h3>
                  <p className="text-slate-600">
                    {isHebrew ? value.description : (value.descriptionEn || value.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{missionTitle}</h3>
              <p className="text-primary-100 text-lg leading-relaxed">
                {missionText}
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{visionTitle}</h3>
              <p className="text-accent-100 text-lg leading-relaxed">
                {visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
              {isHebrew ? 'הצוות שלנו' : 'Our Team'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              {isHebrew ? 'הכירו את המומחים' : 'Meet the Experts'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden h-64">
                  <Image
                    src={member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80'}
                    alt={isHebrew ? member.name : ((member as any).nameEn || member.name)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-800">
                    {isHebrew ? member.name : ((member as any).nameEn || member.name)}
                  </h3>
                  <p className="text-primary-600">
                    {isHebrew ? (member.role || '') : ((member as any).roleEn || member.role || '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-black text-accent-400 mb-2">{stat.value}</div>
                <div className="text-primary-200">
                  {isHebrew ? stat.label : (stat.labelEn || stat.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
