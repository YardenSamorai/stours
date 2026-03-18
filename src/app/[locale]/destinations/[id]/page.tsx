import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Calendar, MapPin, Star, Clock, Check, ArrowRight, ArrowLeft,
  Phone, MessageCircle, Flame, Shield, Award, CreditCard, Plane,
  Building2, Users, Utensils, Moon
} from 'lucide-react';
import { db, deals, siteSettings } from '@/db';
import { eq, and, ne, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import { ProductJsonLd } from '@/components/JsonLd';
import StickyDealBar from '@/components/StickyDealBar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDeal(id: number) {
  try {
    const deal = await db.select().from(deals).where(and(eq(deals.id, id), eq(deals.isActive, true)));
    return deal.length ? deal[0] : null;
  } catch { return null; }
}

async function getRelatedDeals(currentId: number, categoryId: number | null) {
  try {
    if (categoryId) {
      const sameCat = await db.select().from(deals)
        .where(and(eq(deals.isActive, true), ne(deals.id, currentId), eq(deals.categoryId, categoryId)))
        .orderBy(desc(deals.createdAt)).limit(3);
      if (sameCat.length > 0) return sameCat;
    }
    return await db.select().from(deals)
      .where(and(eq(deals.isActive, true), ne(deals.id, currentId)))
      .orderBy(desc(deals.createdAt)).limit(3);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
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
    openGraph: { title, description: description || undefined, images: deal.image ? [deal.image] : undefined },
  };
}

export default async function DealDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
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
  const savings = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  const whatsappMessage = encodeURIComponent(
    isHebrew ? `שלום, אני מעוניין/ת בחבילה: ${deal.title} - ${destination}` : `Hi, I'm interested in: ${deal.titleEn || deal.title} - ${destination}`
  );
  const whatsappUrl = `https://wa.me/${siteWhatsapp}?text=${whatsappMessage}`;
  const formatPrice = (amount: number) => new Intl.NumberFormat(isHebrew ? 'he-IL' : 'en-US', { style: 'currency', currency }).format(amount);
  const dealUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dealtours.co.il'}/${locale}/destinations/${id}`;

  const boardBasisLabel = (code: string) => ({
    RO: isHebrew ? 'לינה בלבד' : 'Room Only',
    BB: isHebrew ? 'ארוחת בוקר' : 'Bed & Breakfast',
    HB: isHebrew ? 'חצי פנסיון' : 'Half Board',
    FB: isHebrew ? 'פנסיון מלא' : 'Full Board',
    AI: isHebrew ? 'הכל כלול' : 'All Inclusive',
  }[code] || code);

  const hasFlights = deal.outboundFlight && deal.outboundFlight.departureAirport;
  const hasHotel = deal.hotel && deal.hotel.name;
  const allImages = [
    ...(deal.images || []),
    ...(deal.hotel?.images || []),
  ];

  return (
    <>
      <StickyDealBar dealTitle={title} price={formatPrice(price)} whatsappUrl={whatsappUrl} phoneNumber={sitePhone} isHebrew={isHebrew} />
      <ProductJsonLd name={title} description={description} image={deal.image} price={price} currency={currency} url={dealUrl} />

      {/* ============ HERO ============ */}
      <section className="relative pt-24 pb-0">
        <div className="relative h-[350px] md:h-[480px]">
          {deal.image ? (
            <Image src={deal.image} alt={title} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <Link href={`/${locale}/destinations`} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors">
                {isHebrew ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isHebrew ? 'חזרה ליעדים' : 'Back to Destinations'}
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {tag && <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${deal.tagColor || 'bg-primary-500'}`}>{tag}</span>}
                {savings && <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500">{isHebrew ? `חסכו ${savings}%` : `Save ${savings}%`}</span>}
                {deal.freeCancellation && <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-green-500">{isHebrew ? 'ביטול חינם' : 'Free Cancellation'}</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination}</span>
                {deal.nights && <span className="flex items-center gap-1"><Moon className="w-4 h-4" /> {deal.nights} {t('nights')}</span>}
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

      {/* ============ QUICK SUMMARY STRIP ============ */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-stretch -mx-1 py-0">
            {/* Dates */}
            {(hasFlights || deal.departureDate) && (
              <SummaryItem
                icon={<Calendar className="w-5 h-5 text-primary-600" />}
                label={isHebrew ? 'תאריכים' : 'Dates'}
                value={hasFlights && deal.outboundFlight?.date
                  ? `${formatDateShort(deal.outboundFlight.date, isHebrew)}${deal.returnFlight?.date ? ` – ${formatDateShort(deal.returnFlight.date, isHebrew)}` : ''}`
                  : deal.departureDate
                    ? `${formatDateShort(deal.departureDate.toString(), isHebrew)}${deal.returnDate ? ` – ${formatDateShort(deal.returnDate.toString(), isHebrew)}` : ''}`
                    : ''
                }
              />
            )}
            {/* Nights */}
            {deal.nights && (
              <SummaryItem icon={<Moon className="w-5 h-5 text-indigo-500" />} label={isHebrew ? 'לילות' : 'Nights'} value={`${deal.nights}`} />
            )}
            {/* Flight */}
            {hasFlights && (
              <SummaryItem
                icon={<Plane className="w-5 h-5 text-sky-500" />}
                label={isHebrew ? 'טיסה' : 'Flight'}
                value={deal.outboundFlight!.stops?.length ? (isHebrew ? `עם עצירה` : 'With stop') : (isHebrew ? 'ישירה' : 'Direct')}
              />
            )}
            {/* Hotel Board */}
            {hasHotel && deal.hotel!.boardBasis && (
              <SummaryItem icon={<Utensils className="w-5 h-5 text-orange-500" />} label={isHebrew ? 'אירוח' : 'Board'} value={boardBasisLabel(deal.hotel!.boardBasis)} />
            )}
            {/* Price */}
            <div className="flex-1 min-w-[140px] px-1">
              <div className="flex items-center justify-center gap-3 h-full py-4 px-3">
                <div className="text-center">
                  {originalPrice && originalPrice > price && (
                    <span className="text-slate-400 line-through text-xs mr-2">{formatPrice(originalPrice)}</span>
                  )}
                  <span className="text-2xl font-black text-primary-600">{formatPrice(price)}</span>
                  <span className="text-slate-400 text-xs block">{isHebrew ? 'לאדם' : '/person'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* === LEFT: CONTENT === */}
            <div className="lg:col-span-2 space-y-8">

              {/* --- FLIGHT CARDS --- */}
              {hasFlights && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Plane className="w-5 h-5" />
                      {isHebrew ? 'פרטי טיסות' : 'Flight Details'}
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <BoardingPass flight={deal.outboundFlight!} label={isHebrew ? 'הלוך' : 'Outbound'} isHebrew={isHebrew} />
                    {deal.returnFlight && deal.returnFlight.departureAirport && (
                      <BoardingPass flight={deal.returnFlight} label={isHebrew ? 'חזור' : 'Return'} isHebrew={isHebrew} />
                    )}
                  </div>
                </div>
              )}

              {/* --- HOTEL CARD --- */}
              {hasHotel && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {isHebrew ? 'המלון' : 'Hotel'}
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Hotel Main Image */}
                      {deal.hotel!.images && deal.hotel!.images.length > 0 && (
                        <div className="md:w-2/5 flex-shrink-0">
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                            <Image src={deal.hotel!.images[0]} alt={deal.hotel!.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                          </div>
                        </div>
                      )}
                      {/* Hotel Info */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{deal.hotel!.name}</h3>
                          {deal.hotel!.stars > 0 && (
                            <div className="flex gap-0.5 mt-1">{Array.from({ length: deal.hotel!.stars }).map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}</div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {deal.hotel!.roomType && (
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-500 mb-0.5">{isHebrew ? 'סוג חדר' : 'Room Type'}</div>
                              <div className="font-semibold text-slate-800">{deal.hotel!.roomType}</div>
                            </div>
                          )}
                          {deal.hotel!.boardBasis && (
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-500 mb-0.5">{isHebrew ? 'בסיס אירוח' : 'Board Basis'}</div>
                              <div className="font-semibold text-slate-800">{boardBasisLabel(deal.hotel!.boardBasis)}</div>
                            </div>
                          )}
                          {deal.hotel!.checkIn && (
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-500 mb-0.5">{isHebrew ? 'צ׳ק-אין' : 'Check-in'}</div>
                              <div className="font-semibold text-slate-800">{formatDateShort(deal.hotel!.checkIn, isHebrew)}</div>
                            </div>
                          )}
                          {deal.hotel!.checkOut && (
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <div className="text-xs text-slate-500 mb-0.5">{isHebrew ? 'צ׳ק-אאוט' : 'Check-out'}</div>
                              <div className="font-semibold text-slate-800">{formatDateShort(deal.hotel!.checkOut, isHebrew)}</div>
                            </div>
                          )}
                        </div>
                        {deal.hotel!.roomDescription && (
                          <p className="text-slate-600 text-sm leading-relaxed">{deal.hotel!.roomDescription}</p>
                        )}
                      </div>
                    </div>
                    {/* Hotel Gallery */}
                    {deal.hotel!.images && deal.hotel!.images.length > 1 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-6">
                        {deal.hotel!.images.slice(1).map((img, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                            <Image src={img} alt={`${deal.hotel!.name} ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 33vw, 25vw" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- DESCRIPTION --- */}
              {description && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {isHebrew ? 'אודות החבילה' : 'About This Package'}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{description}</p>
                </div>
              )}

              {/* --- WHAT'S INCLUDED --- */}
              {includes && includes.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {isHebrew ? 'מה כלול בחבילה' : "What's Included"}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- CANCELLATION POLICY --- */}
              {(deal.freeCancellation || deal.cancellationPolicy) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <h2 className="text-lg font-bold text-slate-800">{isHebrew ? 'מדיניות ביטול' : 'Cancellation Policy'}</h2>
                    {deal.freeCancellation && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                        <Check className="w-3.5 h-3.5" />
                        {isHebrew ? 'ביטול חינם' : 'Free Cancellation'}
                      </span>
                    )}
                  </div>
                  {deal.cancellationPolicy && (
                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">{deal.cancellationPolicy}</p>
                  )}
                </div>
              )}

              {/* --- DATES FALLBACK (no flights) --- */}
              {!hasFlights && (deal.departureDate || deal.returnDate) && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{isHebrew ? 'תאריכים' : 'Dates'}</h2>
                  <div className="flex flex-wrap gap-6">
                    {deal.departureDate && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-primary-600" /></div>
                        <div>
                          <div className="text-sm text-slate-500">{isHebrew ? 'יציאה' : 'Departure'}</div>
                          <div className="font-semibold text-slate-800">{new Date(deal.departureDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      </div>
                    )}
                    {deal.returnDate && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-accent-600" /></div>
                        <div>
                          <div className="text-sm text-slate-500">{isHebrew ? 'חזרה' : 'Return'}</div>
                          <div className="font-semibold text-slate-800">{new Date(deal.returnDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- GALLERY --- */}
              {allImages.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">{isHebrew ? 'גלריה' : 'Gallery'}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(deal.images || []).map((img, i) => (
                      <div key={`g-${i}`} className={`relative rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 h-64 md:h-80' : 'h-40'}`}>
                        <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* === RIGHT: SIDEBAR === */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary-100">
                  {/* Price Block */}
                  <div className="text-center mb-5 pb-5 border-b border-slate-100">
                    {originalPrice && originalPrice > price && (
                      <div className="text-slate-400 line-through text-lg">{formatPrice(originalPrice)}</div>
                    )}
                    <div className="text-4xl font-black text-primary-600">{formatPrice(price)}</div>
                    <div className="text-sm text-slate-500 mt-1">{isHebrew ? 'לאדם' : 'per person'}</div>
                    {savings && (
                      <div className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                        {isHebrew ? `חיסכון של ${savings}%` : `${savings}% off`}
                      </div>
                    )}
                  </div>

                  {/* Quick Facts */}
                  <div className="space-y-2.5 mb-5 text-sm">
                    <SidebarRow label={isHebrew ? 'יעד' : 'Destination'} value={destination} />
                    {deal.nights && <SidebarRow label={isHebrew ? 'לילות' : 'Nights'} value={`${deal.nights}`} />}
                    {hasFlights && <SidebarRow label={isHebrew ? 'טיסה' : 'Flight'} value={deal.outboundFlight!.airline || (deal.outboundFlight!.stops?.length ? (isHebrew ? 'עם עצירה' : 'With stop') : (isHebrew ? 'ישירה' : 'Direct'))} />}
                    {hasHotel && <SidebarRow label={isHebrew ? 'מלון' : 'Hotel'} value={deal.hotel!.name} />}
                    {hasHotel && deal.hotel!.boardBasis && <SidebarRow label={isHebrew ? 'אירוח' : 'Board'} value={boardBasisLabel(deal.hotel!.boardBasis)} />}
                    {deal.departureDate && <SidebarRow label={isHebrew ? 'יציאה' : 'Departure'} value={new Date(deal.departureDate).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')} />}
                  </div>

                  {/* Urgency */}
                  {deal.spotsLeft != null && deal.spotsLeft > 0 && deal.spotsLeft <= 10 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mb-4 animate-pulse">
                      <Flame className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-bold text-red-700">
                        {isHebrew ? `נותרו ${deal.spotsLeft} מקומות בלבד!` : `Only ${deal.spotsLeft} spots left!`}
                      </span>
                    </div>
                  )}

                  {/* Free Cancellation */}
                  {deal.freeCancellation && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl mb-4">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-bold text-green-700">{isHebrew ? 'ביטול חינם!' : 'Free Cancellation!'}</span>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="space-y-3">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5">
                      <MessageCircle className="w-5 h-5" />
                      {isHebrew ? 'שלחו הודעה בוואטסאפ' : 'WhatsApp Us'}
                    </a>
                    <a href={`tel:${sitePhone}`} className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5">
                      <Phone className="w-5 h-5" />
                      {isHebrew ? 'התקשרו עכשיו' : 'Call Now'}
                    </a>
                    <Link href={`/${locale}/contact`} className="w-full flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-4 rounded-xl font-bold text-lg transition-all">
                      {isHebrew ? 'השאירו פרטים' : 'Contact Us'}
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {[
                      { icon: Shield, text: isHebrew ? 'הזמנה מאובטחת' : 'Secure Booking' },
                      { icon: Clock, text: deal.freeCancellation ? (isHebrew ? 'ביטול חינם' : 'Free cancellation') : (isHebrew ? 'ביטול חינם עד 48 שעות' : 'Free cancellation up to 48h') },
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

      {/* ============ MOBILE STICKY CTA ============ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 truncate">{title}</div>
            <div className="text-lg font-black text-primary-600">{formatPrice(price)}</div>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-3 rounded-xl font-bold text-sm">
            <MessageCircle className="w-4 h-4" />
            {isHebrew ? 'וואטסאפ' : 'WhatsApp'}
          </a>
          <a href={`tel:${sitePhone}`} className="flex items-center gap-1.5 bg-primary-600 text-white px-4 py-3 rounded-xl font-bold text-sm">
            <Phone className="w-4 h-4" />
            {isHebrew ? 'חייגו' : 'Call'}
          </a>
        </div>
      </div>

      {/* ============ RELATED DEALS ============ */}
      {relatedDeals.length > 0 && (
        <section className="py-16 bg-white mb-16 lg:mb-0">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              {isHebrew ? 'דילים נוספים שיעניינו אתכם' : 'More Deals You May Like'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedDeals.map((rd) => {
                const rdTitle = isHebrew ? rd.title : (rd.titleEn || rd.title);
                const rdDest = isHebrew ? rd.destination : (rd.destinationEn || rd.destination);
                return (
                  <Link key={rd.id} href={`/${locale}/destinations/${rd.id}`} className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
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
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {rdDest}</p>
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

/* ============ HELPER COMPONENTS ============ */

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex-1 min-w-[120px] px-1">
      <div className="flex items-center gap-3 py-4 px-3 h-full">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <div className="text-xs text-slate-400 font-medium">{label}</div>
          <div className="font-semibold text-slate-800 text-sm truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-700 text-end max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function BoardingPass({ flight, label, isHebrew }: { flight: any; label: string; isHebrew: boolean }) {
  if (!flight?.departureAirport) return null;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 px-5 py-2.5 flex items-center justify-between border-b border-dashed border-slate-300">
        <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
          <Plane className="w-4 h-4 text-sky-500" /> {label}
        </span>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {flight.airline && <span className="font-medium">{flight.airline}</span>}
          {flight.flightNumber && <span className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">{flight.flightNumber}</span>}
        </div>
      </div>
      {/* Body */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-4">
          {/* Departure */}
          <div className="text-center flex-shrink-0 w-20">
            {flight.departureTime && <div className="text-xl font-black text-slate-800" dir="ltr">{flight.departureTime}</div>}
            <div className="text-2xl font-black text-primary-600 tracking-wider" dir="ltr">{flight.departureAirport}</div>
            <div className="text-xs text-slate-500 mt-0.5">{flight.departureCity}</div>
          </div>
          {/* Route Line */}
          <div className="flex-1 flex flex-col items-center relative py-2">
            <div className="w-full flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0" />
              <div className="h-px flex-1 bg-slate-300 relative">
                {flight.stops?.map((_: any, i: number) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full border-2 border-white" style={{ left: `${((i + 1) / (flight.stops.length + 1)) * 100}%` }} />
                ))}
              </div>
              <div className="w-0 h-0 border-l-[10px] border-l-primary-500 border-y-[5px] border-y-transparent flex-shrink-0" />
            </div>
            {flight.stops && flight.stops.length > 0 ? (
              <span className="text-[11px] text-amber-600 font-semibold mt-1.5 bg-amber-50 px-2 py-0.5 rounded-full">
                {flight.stops.length === 1
                  ? (isHebrew ? `עצירה ב${flight.stops[0].city || flight.stops[0].airport}` : `Stop: ${flight.stops[0].city || flight.stops[0].airport}`)
                  : (isHebrew ? `${flight.stops.length} עצירות` : `${flight.stops.length} stops`)}
              </span>
            ) : (
              <span className="text-[11px] text-green-600 font-semibold mt-1.5 bg-green-50 px-2 py-0.5 rounded-full">{isHebrew ? 'טיסה ישירה' : 'Direct'}</span>
            )}
          </div>
          {/* Arrival */}
          <div className="text-center flex-shrink-0 w-20">
            {flight.arrivalTime && <div className="text-xl font-black text-slate-800" dir="ltr">{flight.arrivalTime}</div>}
            <div className="text-2xl font-black text-primary-600 tracking-wider" dir="ltr">{flight.arrivalAirport}</div>
            <div className="text-xs text-slate-500 mt-0.5">{flight.arrivalCity}</div>
          </div>
        </div>
        {/* Date */}
        {flight.date && (
          <div className="text-center mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
              {new Date(flight.date).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDateShort(dateStr: string, isHebrew: boolean) {
  try {
    return new Date(dateStr).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US', { day: 'numeric', month: 'short' });
  } catch { return dateStr; }
}
