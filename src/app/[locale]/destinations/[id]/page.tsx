import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Star, Clock, Check, ArrowRight, ArrowLeft, Phone, MessageCircle, Flame, Shield, Award, CreditCard } from 'lucide-react';
import { db, deals, siteSettings } from '@/db';
import { eq, and, ne, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import { ProductJsonLd } from '@/components/JsonLd';
import StickyDealBar from '@/components/StickyDealBar';

export const revalidate = 0;

async function getDeal(id: number) {
  try {
    const deal = await db.select()
      .from(deals)
      .where(and(eq(deals.id, id), eq(deals.isActive, true)));
    return deal.length ? deal[0] : null;
  } catch {
    return null;
  }
}

async function getRelatedDeals(currentId: number, categoryId: number | null) {
  try {
    if (categoryId) {
      const sameCat = await db.select()
        .from(deals)
        .where(and(eq(deals.isActive, true), ne(deals.id, currentId), eq(deals.categoryId, categoryId)))
        .orderBy(desc(deals.createdAt))
        .limit(3);
      if (sameCat.length > 0) return sameCat;
    }
    const fallback = await db.select()
      .from(deals)
      .where(and(eq(deals.isActive, true), ne(deals.id, currentId)))
      .orderBy(desc(deals.createdAt))
      .limit(3);
    return fallback;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const numericId = parseInt(id);
  if (isNaN(numericId)) return { title: 'Not Found' };

  const deal = await getDeal(numericId);
  if (!deal) return { title: 'Not Found' };

  const isHebrew = locale === 'he';
  const title = isHebrew ? deal.title : (deal.titleEn || deal.title);
  const description = isHebrew ? deal.description : (deal.descriptionEn || deal.description);

  return {
    title: `${title} | ${isHebrew ? 'דיל טורס' : 'Deal Tours'}`,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: deal.image ? [deal.image] : undefined,
    },
  };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');
  const isHebrew = locale === 'he';

  const numericId = parseInt(id);
  if (isNaN(numericId)) notFound();

  const deal = await getDeal(numericId);
  if (!deal) notFound();

  const relatedDeals = await getRelatedDeals(deal.id, deal.categoryId);

  const contactRows = await db.select().from(siteSettings).where(eq(siteSettings.group, 'contact'));
  const socialRows = await db.select().from(siteSettings).where(eq(siteSettings.group, 'social'));
  const allSettings: Record<string, string> = {};
  [...contactRows, ...socialRows].forEach(r => { if (r.value) allSettings[r.key] = r.value; });
  const sitePhone = allSettings.phone || '0525118536';
  const siteWhatsapp = allSettings.whatsappNumber || '972525118536';

  const title = isHebrew ? deal.title : (deal.titleEn || deal.title);
  const destination = isHebrew ? deal.destination : (deal.destinationEn || deal.destination);
  const description = isHebrew ? deal.description : (deal.descriptionEn || deal.description);
  const includes = isHebrew ? deal.includes : (deal.includesEn || deal.includes);
  const tag = isHebrew ? deal.tag : (deal.tagEn || deal.tag);
  const currency = deal.currency || 'ILS';
  const price = Number(deal.price);
  const originalPrice = deal.originalPrice ? Number(deal.originalPrice) : null;
  const savings = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const whatsappMessage = encodeURIComponent(
    isHebrew
      ? `שלום, אני מעוניין/ת בחבילה: ${deal.title} - ${destination}`
      : `Hi, I'm interested in: ${deal.titleEn || deal.title} - ${destination}`
  );

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat(isHebrew ? 'he-IL' : 'en-US', { style: 'currency', currency }).format(amount);

  const dealUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il'}/${locale}/destinations/${id}`;

  return (
    <>
      <StickyDealBar
        dealTitle={title}
        price={formatPrice(price)}
        whatsappUrl={`https://wa.me/${siteWhatsapp}?text=${whatsappMessage}`}
        phoneNumber={sitePhone}
        isHebrew={isHebrew}
      />
      <ProductJsonLd
        name={title}
        description={description}
        image={deal.image}
        price={price}
        currency={currency}
        url={dealUrl}
      />
      {/* Hero */}
      <section className="relative pt-24 pb-0">
        <div className="relative h-[350px] md:h-[450px]">
          {deal.image ? (
            <Image
              src={deal.image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <Link
                href={`/${locale}/destinations`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
              >
                {isHebrew ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isHebrew ? 'חזרה ליעדים' : 'Back to Destinations'}
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {tag && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${deal.tagColor || 'bg-primary-500'}`}>
                    {tag}
                  </span>
                )}
                {savings && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                    {isHebrew ? `חסכו ${savings}%` : `Save ${savings}%`}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {destination}
                </span>
                {deal.nights && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {deal.nights} {t('nights')}
                  </span>
                )}
                {deal.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {deal.rating} ({deal.reviewsCount || 0} {isHebrew ? 'ביקורות' : 'reviews'})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {description && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {isHebrew ? 'אודות החבילה' : 'About This Package'}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{description}</p>
                </div>
              )}

              {/* What's Included */}
              {includes && includes.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {isHebrew ? 'מה כלול בחבילה' : "What's Included"}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              {(deal.departureDate || deal.returnDate) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {isHebrew ? 'תאריכים' : 'Dates'}
                  </h2>
                  <div className="flex flex-wrap gap-6">
                    {deal.departureDate && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">{isHebrew ? 'יציאה' : 'Departure'}</div>
                          <div className="font-semibold text-slate-800">
                            {new Date(deal.departureDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    )}
                    {deal.returnDate && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">{isHebrew ? 'חזרה' : 'Return'}</div>
                          <div className="font-semibold text-slate-800">
                            {new Date(deal.returnDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {deal.images && deal.images.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {isHebrew ? 'גלריה' : 'Gallery'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {deal.images.map((img, index) => (
                      <div key={index} className="relative h-40 rounded-xl overflow-hidden">
                        <Image src={img} alt={`${title} ${index + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary-100">
                  {/* Price */}
                  <div className="text-center mb-6">
                    {originalPrice && originalPrice > price && (
                      <div className="text-slate-400 line-through text-lg">{formatPrice(originalPrice)}</div>
                    )}
                    <div className="text-4xl font-black text-primary-600">{formatPrice(price)}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {isHebrew ? 'לאדם' : 'per person'}
                    </div>
                    {savings && (
                      <div className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                        {isHebrew ? `חיסכון של ${savings}%` : `${savings}% off`}
                      </div>
                    )}
                  </div>

                  {/* Deal Info */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isHebrew ? 'יעד' : 'Destination'}</span>
                      <span className="font-medium text-slate-700">{destination}</span>
                    </div>
                    {deal.nights && (
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">{isHebrew ? 'לילות' : 'Nights'}</span>
                        <span className="font-medium text-slate-700">{deal.nights}</span>
                      </div>
                    )}
                    {deal.departureDate && (
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">{isHebrew ? 'יציאה' : 'Departure'}</span>
                        <span className="font-medium text-slate-700">
                          {new Date(deal.departureDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Urgency */}
                  {deal.spotsLeft != null && deal.spotsLeft > 0 && deal.spotsLeft <= 10 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mb-4">
                      <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-bold text-red-700">
                        {isHebrew ? `נותרו ${deal.spotsLeft} מקומות בלבד!` : `Only ${deal.spotsLeft} spots left!`}
                      </span>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="space-y-3">
                    <a
                      href={`https://wa.me/${siteWhatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {isHebrew ? 'שלחו הודעה בוואטסאפ' : 'WhatsApp Us'}
                    </a>
                    <a
                      href={`tel:${sitePhone}`}
                      className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      {isHebrew ? 'התקשרו עכשיו' : 'Call Now'}
                    </a>
                    <Link
                      href={`/${locale}/contact`}
                      className="w-full flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-4 rounded-xl font-bold text-lg transition-all"
                    >
                      {isHebrew ? 'השאירו פרטים' : 'Contact Us'}
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {[
                      { icon: Shield, text: isHebrew ? 'הזמנה מאובטחת' : 'Secure Booking' },
                      { icon: Clock, text: isHebrew ? 'ביטול חינם עד 48 שעות' : 'Free cancellation up to 48h' },
                      { icon: Award, text: isHebrew ? '15+ שנות ניסיון' : '15+ years experience' },
                      { icon: CreditCard, text: isHebrew ? 'תשלום בכל האמצעים' : 'All payment methods' },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <badge.icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Deals */}
      {relatedDeals.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {isHebrew ? 'דילים נוספים שיעניינו אתכם' : 'More Deals You May Like'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedDeals.map((rd) => {
                const rdTitle = isHebrew ? rd.title : (rd.titleEn || rd.title);
                const rdDest = isHebrew ? rd.destination : (rd.destinationEn || rd.destination);
                return (
                  <Link
                    key={rd.id}
                    href={`/${locale}/destinations/${rd.id}`}
                    className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="relative h-44">
                      {rd.image ? (
                        <Image src={rd.image} alt={rdTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{rdTitle}</h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {rdDest}
                      </p>
                      <div className="mt-3 text-lg font-black text-primary-600">
                        {new Intl.NumberFormat(isHebrew ? 'he-IL' : 'en-US', { style: 'currency', currency: rd.currency || 'ILS' }).format(Number(rd.price))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
