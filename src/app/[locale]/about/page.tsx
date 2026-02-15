import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Award, Users, Globe, Shield, Heart, Plane, CheckCircle } from 'lucide-react';

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('about');

  const values = [
    { icon: Heart, title: 'אהבה לטיולים', desc: 'אנחנו מטיילים בעצמנו ומביאים את החוויות שלנו אליכם' },
    { icon: Shield, title: 'אמינות', desc: 'שקיפות מלאה במחירים ובתנאים, ללא הפתעות' },
    { icon: Users, title: 'שירות אישי', desc: 'כל לקוח מקבל יחס אישי ומותאם לצרכים שלו' },
    { icon: Globe, title: 'מומחיות גלובלית', desc: 'ניסיון עשיר ביעדים ברחבי העולם' },
  ];

  const team = [
    { name: 'יעל כהן', role: 'מנכ״לית', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
    { name: 'אורי לוי', role: 'מנהל מכירות', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
    { name: 'מיכל אברהם', role: 'מומחית אירופה', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
    { name: 'דני ברק', role: 'מומחה מזרח רחוק', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  ];

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
              הכירו אותנו
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
        {/* Wave */}
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
                📖 הסיפור שלנו
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                {t('subtitle')}
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  S-Tours נולדה מתוך תשוקה אמיתית לטיולים. הקמנו את החברה לפני למעלה מ-15 שנה עם חזון ברור: להפוך כל חלום של טיול למציאות.
                </p>
                <p>
                  אנחנו מאמינים שטיול הוא לא רק חופשה - זו חוויה שמשנה את החיים. לכן אנחנו שמים דגש על כל פרט קטן, מרגע התכנון ועד החזרה הביתה.
                </p>
                <p>
                  עם צוות של מומחים מנוסים ותשוקה אמיתית לשירות, אנחנו כאן כדי להבטיח שהטיול שלכם יהיה מושלם.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
                alt="נוף טבעי מרהיב"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -start-6 bg-accent-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">15+</div>
                <div className="text-accent-100">שנות ניסיון</div>
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
              💎 הערכים שלנו
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              {t('whyUs')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
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
              <h3 className="text-2xl font-bold mb-4">{t('mission')}</h3>
              <p className="text-primary-100 text-lg leading-relaxed">
                {t('missionText')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl p-10 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('vision')}</h3>
              <p className="text-accent-100 text-lg leading-relaxed">
                {t('visionText')}
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
              👥 הצוות שלנו
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              הכירו את המומחים
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                  <p className="text-primary-600">{member.role}</p>
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
            {[
              { value: '15,000+', label: 'לקוחות מרוצים' },
              { value: '120+', label: 'יעדים' },
              { value: '15', label: 'שנות ניסיון' },
              { value: '98%', label: 'שביעות רצון' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-black text-accent-400 mb-2">{stat.value}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
