'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Loader2, CheckCircle } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ExitIntentPopup() {
  const locale = useLocale();
  const isHebrew = locale === 'he';
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_popup_shown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem('exit_popup_shown')) {
        setShow(true);
        sessionStorage.setItem('exit_popup_shown', '1');
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: `${phone.trim()}@lead.dealtours.co.il`,
          message: isHebrew ? 'פנייה מפופאפ - מבקש/ת שיחזרו אליי' : 'Exit popup lead - please call back',
        }),
      });
      setSuccess(true);
      setTimeout(() => setShow(false), 3000);
    } catch {
      alert(isHebrew ? 'שגיאה, נסו שוב' : 'Error, please try again');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShow(false)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" dir="rtl" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center text-white relative">
          <button onClick={() => setShow(false)} className="absolute top-3 end-3 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-1">
            {isHebrew ? 'חכו! יש לנו הצעה מיוחדת' : 'Wait! We have a special offer'}
          </h2>
          <p className="text-primary-100 text-sm">
            {isHebrew ? 'השאירו פרטים ונחזור אליכם עם הצעה אישית תוך שעה' : 'Leave your details and we\'ll get back to you within an hour with a personal offer'}
          </p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-bold text-slate-800">{isHebrew ? 'תודה רבה!' : 'Thank you!'}</p>
              <p className="text-sm text-slate-500">{isHebrew ? 'ניצור קשר בהקדם' : 'We\'ll contact you soon'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isHebrew ? 'השם שלכם' : 'Your name'}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={isHebrew ? 'מספר טלפון' : 'Phone number'}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {saving
                  ? (isHebrew ? 'שולח...' : 'Sending...')
                  : (isHebrew ? 'רוצה הצעה אישית!' : 'Get a personal offer!')
                }
              </button>
              <p className="text-center text-xs text-slate-400">
                {isHebrew ? 'ללא התחייבות. נחזור אליכם תוך שעה.' : 'No commitment. We\'ll respond within an hour.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
