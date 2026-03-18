'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight, Save, Plus, X, Plane, Building2, CreditCard,
  Settings, ImageIcon, Upload, Loader2, Star, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import LocationPicker from '@/components/admin/LocationPicker';
import type { FlightInfo, FlightStop, HotelInfo } from '@/db/schema';

interface Category {
  id: number;
  title: string;
  titleEn: string | null;
  isActive?: boolean | null;
}

const emptyFlight: FlightInfo = {
  airline: '', flightNumber: '',
  departureAirport: '', departureCity: '',
  arrivalAirport: '', arrivalCity: '',
  date: '', departureTime: '', arrivalTime: '',
  stops: [],
};

const emptyHotel: HotelInfo = {
  name: '', stars: 4, roomType: '', roomDescription: '',
  boardBasis: '', checkIn: '', checkOut: '', images: [],
};

const boardBasisOptions = [
  { value: '', label: 'לא צוין' },
  { value: 'RO', label: 'לינה בלבד (RO)' },
  { value: 'BB', label: 'לינה + ארוחת בוקר (BB)' },
  { value: 'HB', label: 'חצי פנסיון (HB)' },
  { value: 'FB', label: 'פנסיון מלא (FB)' },
  { value: 'AI', label: 'הכל כלול (AI)' },
];

const tagColors = [
  { value: 'bg-primary-500', label: 'כחול' },
  { value: 'bg-accent-500', label: 'כתום' },
  { value: 'bg-green-500', label: 'ירוק' },
  { value: 'bg-rose-500', label: 'ורוד' },
  { value: 'bg-amber-500', label: 'זהב' },
  { value: 'bg-violet-500', label: 'סגול' },
];

const currencies = [
  { value: 'ILS', label: '₪ שקל', symbol: '₪' },
  { value: 'USD', label: '$ דולר', symbol: '$' },
  { value: 'EUR', label: '€ אירו', symbol: '€' },
];

type SectionId = 'basic' | 'outbound' | 'return' | 'hotel' | 'pricing' | 'images';

export default function NewDealPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSection, setActiveSection] = useState<SectionId>('basic');

  const [formData, setFormData] = useState({
    title: '', titleEn: '',
    destination: '', destinationEn: '',
    country: '', countryEn: '',
    description: '', descriptionEn: '',
    price: '', originalPrice: '', currency: 'ILS', nights: '1',
    image: '', images: [] as string[],
    tag: '', tagEn: '', tagColor: 'bg-primary-500',
    categoryId: '',
    spotsLeft: '',
    isActive: true, isFeatured: false,
    includes: [''], includesEn: [''],
    freeCancellation: false, cancellationPolicy: '',
  });

  const [outbound, setOutbound] = useState<FlightInfo>({ ...emptyFlight });
  const [returnFlight, setReturnFlight] = useState<FlightInfo>({ ...emptyFlight });
  const [noReturn, setNoReturn] = useState(false);
  const [hotel, setHotel] = useState<HotelInfo>({ ...emptyHotel });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCategories(data.filter((c: any) => c.isActive !== false));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const hasOutbound = outbound.departureAirport || outbound.airline;
      const hasHotel = hotel.name;
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price,
          originalPrice: formData.originalPrice || null,
          nights: parseInt(formData.nights),
          categoryId: formData.categoryId || null,
          spotsLeft: formData.spotsLeft ? parseInt(formData.spotsLeft) : null,
          includes: formData.includes.filter(i => i.trim()),
          includesEn: formData.includesEn.filter(i => i.trim()),
          outboundFlight: hasOutbound ? outbound : null,
          returnFlight: hasOutbound && !noReturn ? returnFlight : null,
          hotel: hasHotel ? hotel : null,
        }),
      });
      if (!response.ok) throw new Error('Failed to create deal');
      router.push('/admin/deals');
    } catch {
      alert('שגיאה ביצירת הדיל. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections: { id: SectionId; label: string; icon: any }[] = [
    { id: 'basic', label: 'פרטים בסיסיים', icon: Settings },
    { id: 'outbound', label: 'טיסה הלוך', icon: Plane },
    { id: 'return', label: 'טיסה חזור', icon: Plane },
    { id: 'hotel', label: 'מלון', icon: Building2 },
    { id: 'pricing', label: 'תמחור ומדיניות', icon: CreditCard },
    { id: 'images', label: 'תמונות', icon: ImageIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/deals" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowRight className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">דיל חדש</h1>
          <p className="text-slate-500">הוסף דיל או חבילת נופש חדשה</p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-wrap gap-1">
        {sections.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-all ${
              activeSection === s.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Info */}
        {activeSection === 'basic' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">פרטים בסיסיים</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">שם הדיל (עברית) *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="לדוגמה: חבילת נופש סנטוריני" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deal Name (English)</label>
                  <input type="text" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} placeholder="e.g., Santorini Vacation Package" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" dir="ltr" />
                </div>
              </div>

              <LocationPicker value={formData.destination} onChange={(loc) => setFormData({ ...formData, destination: loc.destination, destinationEn: loc.destinationEn, country: loc.country, countryEn: loc.countryEn })} placeholder="חפש עיר או יעד..." label="יעד" />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">תיאור (עברית)</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="תיאור קצר של הדיל..." rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description (English)</label>
                  <textarea value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} placeholder="Short deal description..." rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" dir="ltr" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">קטגוריה</label>
                  <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">ללא קטגוריה</option>
                    {categories.map(c => <option key={c.id} value={c.id.toString()}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">תגית</label>
                  <input type="text" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="מבצע, חדש, פופולרי..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">צבע תגית</label>
                  <div className="flex gap-2 pt-1">
                    {tagColors.map(c => (
                      <button key={c.value} type="button" onClick={() => setFormData({ ...formData, tagColor: c.value })} className={`w-8 h-8 rounded-lg ${c.value} ${formData.tagColor === c.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`} title={c.label} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-primary-600 rounded" />
                  <span className="text-slate-700">פעיל (מוצג באתר)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 text-primary-600 rounded" />
                  <span className="text-slate-700">מומלץ (מוצג בדף הבית)</span>
                </label>
              </div>
            </div>

            {/* Includes */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">מה כולל הדיל</h2>
              {formData.includes.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={item} onChange={e => { const n = [...formData.includes]; n[i] = e.target.value; setFormData({ ...formData, includes: n }); }} placeholder="לדוגמה: WiFi חינם" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <button type="button" onClick={() => setFormData({ ...formData, includes: formData.includes.filter((_, idx) => idx !== i) })} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, includes: [...formData.includes, ''] })} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                <Plus className="w-5 h-5" /> הוסף פריט
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: Outbound Flight */}
        {activeSection === 'outbound' && (
          <FlightSection title="טיסה הלוך" flight={outbound} onChange={setOutbound} icon="✈️" />
        )}

        {/* SECTION 3: Return Flight */}
        {activeSection === 'return' && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer bg-white rounded-2xl p-4 shadow-sm">
              <input type="checkbox" checked={noReturn} onChange={e => setNoReturn(e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
              <span className="text-slate-700 font-medium">ללא טיסת חזור (כיוון אחד בלבד)</span>
            </label>
            {!noReturn && (
              <FlightSection title="טיסה חזור" flight={returnFlight} onChange={setReturnFlight} icon="🔄" />
            )}
          </div>
        )}

        {/* SECTION 4: Hotel */}
        {activeSection === 'hotel' && (
          <HotelSection hotel={hotel} onChange={setHotel} />
        )}

        {/* SECTION 5: Pricing & Policy */}
        {activeSection === 'pricing' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">תמחור ומדיניות</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">מטבע</label>
              <div className="flex gap-2">
                {currencies.map(c => (
                  <button key={c.value} type="button" onClick={() => setFormData({ ...formData, currency: c.value })} className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${formData.currency === c.value ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{c.label}</button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">מחיר *</label>
                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="2499" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">מחיר מקורי (לפני הנחה)</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="2999" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">מספר לילות</label>
                <input type="number" value={formData.nights} onChange={e => setFormData({ ...formData, nights: e.target.value })} min="1" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">מקומות שנותרו</label>
              <input type="number" value={formData.spotsLeft} onChange={e => setFormData({ ...formData, spotsLeft: e.target.value })} min="0" placeholder="ריק = ללא הגבלה" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-xs" />
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-md font-semibold text-slate-800">מדיניות ביטול</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-12 h-7 rounded-full transition-colors ${formData.freeCancellation ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.freeCancellation ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-slate-700 font-medium">ביטול חינם</span>
                {formData.freeCancellation && <span className="text-green-600 text-sm">✓ פעיל</span>}
              </label>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">פירוט מדיניות ביטול</label>
                <textarea value={formData.cancellationPolicy} onChange={e => setFormData({ ...formData, cancellationPolicy: e.target.value })} placeholder="לדוגמה: ביטול חינם עד 14 יום לפני תאריך היציאה" rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: Images */}
        {activeSection === 'images' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <ImageUploader value={formData.image} onChange={url => setFormData({ ...formData, image: url })} label="תמונה ראשית של הדיל" />
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">גלריית תמונות נוספות</h2>
              <MultiImageUploader images={formData.images} onChange={imgs => setFormData({ ...formData, images: imgs })} />
            </div>
          </div>
        )}

        {/* Submit - always visible */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 w-full sm:w-auto bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg">
            <Save className="w-5 h-5" />
            {isSubmitting ? 'שומר...' : 'שמור דיל'}
          </button>
          <Link href="/admin/deals" className="px-6 py-4 text-slate-600 hover:text-slate-800 font-medium">ביטול</Link>
        </div>
      </form>
    </div>
  );
}

/* ========== Flight Section Component ========== */
function FlightSection({ title, flight, onChange, icon }: { title: string; flight: FlightInfo; onChange: (f: FlightInfo) => void; icon: string }) {
  const update = (key: keyof FlightInfo, value: any) => onChange({ ...flight, [key]: value });

  const addStop = () => onChange({ ...flight, stops: [...flight.stops, { airport: '', city: '', duration: '' }] });
  const removeStop = (i: number) => onChange({ ...flight, stops: flight.stops.filter((_, idx) => idx !== i) });
  const updateStop = (i: number, key: keyof FlightStop, value: string) => {
    const stops = [...flight.stops];
    stops[i] = { ...stops[i], [key]: value };
    onChange({ ...flight, stops });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">{icon} {title}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">חברת תעופה</label>
          <input type="text" value={flight.airline} onChange={e => update('airline', e.target.value)} placeholder="אל על, ריינאייר, וויזאייר..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">מספר טיסה</label>
          <input type="text" value={flight.flightNumber} onChange={e => update('flightNumber', e.target.value)} placeholder="LY001" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" dir="ltr" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl space-y-3">
          <h3 className="font-semibold text-blue-800 text-sm">🛫 מוצא</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">קוד שדה (IATA)</label>
              <input type="text" value={flight.departureAirport} onChange={e => update('departureAirport', e.target.value.toUpperCase())} placeholder="TLV" maxLength={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-mono font-bold text-lg" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">עיר</label>
              <input type="text" value={flight.departureCity} onChange={e => update('departureCity', e.target.value)} placeholder="תל אביב" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-xl space-y-3">
          <h3 className="font-semibold text-green-800 text-sm">🛬 יעד</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">קוד שדה (IATA)</label>
              <input type="text" value={flight.arrivalAirport} onChange={e => update('arrivalAirport', e.target.value.toUpperCase())} placeholder="ATH" maxLength={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-mono font-bold text-lg" dir="ltr" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">עיר</label>
              <input type="text" value={flight.arrivalCity} onChange={e => update('arrivalCity', e.target.value)} placeholder="אתונה" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">תאריך</label>
          <input type="date" value={flight.date} onChange={e => update('date', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">שעת המראה</label>
          <input type="time" value={flight.departureTime} onChange={e => update('departureTime', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">שעת נחיתה</label>
          <input type="time" value={flight.arrivalTime} onChange={e => update('arrivalTime', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" dir="ltr" />
        </div>
      </div>

      {/* Stops */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">עצירות ביניים</h3>
          <button type="button" onClick={addStop} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
            <Plus className="w-4 h-4" /> הוסף עצירה
          </button>
        </div>
        {flight.stops.length === 0 && <p className="text-slate-400 text-sm">טיסה ישירה (ללא עצירות)</p>}
        {flight.stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <span className="text-amber-600 font-bold text-sm">#{i + 1}</span>
            <input type="text" value={stop.airport} onChange={e => updateStop(i, 'airport', e.target.value.toUpperCase())} placeholder="IST" maxLength={3} className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-center font-mono" dir="ltr" />
            <input type="text" value={stop.city} onChange={e => updateStop(i, 'city', e.target.value)} placeholder="איסטנבול" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg" />
            <input type="text" value={stop.duration} onChange={e => updateStop(i, 'duration', e.target.value)} placeholder="2 שעות" className="w-28 px-3 py-2 border border-slate-200 rounded-lg" />
            <button type="button" onClick={() => removeStop(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Hotel Section Component ========== */
function HotelSection({ hotel, onChange }: { hotel: HotelInfo; onChange: (h: HotelInfo) => void }) {
  const update = (key: keyof HotelInfo, value: any) => onChange({ ...hotel, [key]: value });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-3">🏨 מלון</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">שם המלון</label>
          <input type="text" value={hotel.name} onChange={e => update('name', e.target.value)} placeholder="Santorini Grand Hotel" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">דירוג כוכבים</label>
          <div className="flex gap-1 pt-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => update('stars', n)} className="p-1">
                <Star className={`w-7 h-7 transition-colors ${n <= hotel.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">סוג חדר</label>
          <input type="text" value={hotel.roomType} onChange={e => update('roomType', e.target.value)} placeholder="Standard / Superior / Suite..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">בסיס אירוח</label>
          <select value={hotel.boardBasis} onChange={e => update('boardBasis', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            {boardBasisOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">תיאור החדר</label>
        <textarea value={hotel.roomDescription} onChange={e => update('roomDescription', e.target.value)} placeholder="חדר מרווח עם מרפסת ונוף לים, מיזוג, WiFi..." rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">צ׳ק-אין</label>
          <input type="date" value={hotel.checkIn} onChange={e => update('checkIn', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">צ׳ק-אאוט</label>
          <input type="date" value={hotel.checkOut} onChange={e => update('checkOut', e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {/* Hotel Images */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="font-semibold text-slate-700">תמונות מלון וחדר</h3>
        <MultiImageUploader images={hotel.images} onChange={imgs => update('images', imgs)} />
      </div>
    </div>
  );
}

/* ========== Multi Image Uploader Component ========== */
function MultiImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    const newImages = [...images];
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          newImages.push(data.url);
        }
      } catch { /* skip failed uploads */ }
    }
    onChange(newImages);
    setUploading(false);
  };

  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-400 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary-500 transition-colors">
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          <span className="text-xs font-medium">{uploading ? 'מעלה...' : 'העלאת תמונות'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />
    </div>
  );
}
