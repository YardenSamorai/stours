'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Plane, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import TicketField from './ticket/TicketField';
import Barcode from './ticket/Barcode';

/* ── Decorative QR placeholder ─────────────────────────────── */
function QRPlaceholder() {
  const grid = [
    [1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,1,0,0,1,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,1,1,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,1,0,0,0,0,0],
    [1,0,1,0,1,1,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,1,0,1,0,1,0],
    [1,1,1,1,1,0,1,0,0,1,1,0,1],
    [1,0,0,0,1,0,0,1,1,0,1,0,0],
    [1,0,1,0,1,0,1,1,0,0,1,1,1],
    [1,0,0,0,1,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,0,0,1,1,0,1,0,1],
  ];
  return (
    <div className="grid gap-[1.5px]" style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}>
      {grid.flat().map((cell, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[0.5px] ${
            cell ? 'bg-primary-800/80' : 'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Plane-path decoration ──────────────────────────────────── */
function PlanePath({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-1">
      <div className="h-[1.5px] flex-1 border-t-2 border-dashed border-slate-200" />
      <Plane
        className={`w-3.5 h-3.5 text-primary-400/70 flex-shrink-0 ${
          isRTL ? 'rotate-180' : ''
        }`}
      />
      <div className="h-[1.5px] flex-1 border-t-2 border-dashed border-slate-200" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CTA — LUXURY BOARDING PASS
   ═══════════════════════════════════════════════════════════════ */
export default function CTA() {
  const t = useTranslations('cta');
  const locale = useLocale();
  const isRTL = locale === 'he';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* Date */
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = today
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase();
  const year = today.getFullYear();

  /* Validation */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim() && !lastName.trim()) errs.firstName = t('nameRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || `${firstName.trim()}.${lastName.trim()}@lead.dealtours.co.il`,
        }),
      });
      if (!res.ok) throw new Error('fail');
      setIsSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch {
      setSubmitError(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── RENDER ──────────────────────────────────────────────── */
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.025]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Soft glow orbs */}
      <div className="absolute top-0 start-1/4 w-[700px] h-[700px] bg-primary-500/[0.07] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-[500px] h-[500px] bg-accent-400/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* ── Section Heading ── */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-primary-300/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* ── TICKET ── */}
        <div className="max-w-[1060px] mx-auto">
          {isSubmitted ? (
            /* ✓ Success */
            <div
              className="bg-white/[0.97] backdrop-blur-sm rounded-2xl p-14 text-center"
              style={{
                boxShadow:
                  '0 40px 80px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-slate-800 text-xl font-bold">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className="relative bg-white rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    '0 40px 80px -20px rgba(0,0,0,0.3), 0 8px 24px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
              >
                {/* ── FIRST CLASS watermark ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                  <span
                    className="text-[100px] md:text-[140px] font-black text-slate-50 uppercase tracking-[0.18em] whitespace-nowrap opacity-60"
                    style={{ transform: 'rotate(-8deg)' }}
                  >
                    FIRST CLASS
                  </span>
                </div>

                {/* ── Ticket Header ── */}
                <div className="relative bg-gradient-to-r from-primary-800 via-primary-850 to-primary-900 px-5 md:px-8 py-3.5 flex items-center justify-between">
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Brand */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-white/[0.06]">
                      <Plane className={`w-4 h-4 text-white/90 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                    <span className="text-base font-bold text-white flex items-baseline">
                      <span className="text-lg text-accent-400">{locale === 'he' ? 'דיל' : 'Deal'}</span>
                      <span className="text-white/70"> {locale === 'he' ? 'טורס' : 'Tours'}</span>
                    </span>
                  </div>

                  {/* Boarding Pass label */}
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium">
                      {t('boardingPass')}
                    </span>
                    <div className="px-3 py-0.5 bg-accent-400/[0.12] border border-accent-400/20 rounded-full">
                      <span className="text-accent-300/90 text-[10px] font-bold tracking-[0.2em] uppercase">
                        FIRST CLASS
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Ticket Body — Horizontal Layout ── */}
                <div className="relative flex flex-col lg:flex-row">

                  {/* ▸ STUB (left/start side) — Date + QR + VIP */}
                  <div className={`lg:w-[180px] flex-shrink-0 p-5 md:p-6 flex flex-row lg:flex-col items-center justify-around lg:justify-center gap-4 lg:gap-5 relative z-10 ${isRTL ? 'lg:order-3' : 'lg:order-1'}`}>
                    {/* Date */}
                    <div className="text-center">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        {t('date')}
                      </p>
                      <p className="text-[36px] font-black text-primary-700/75 leading-none">
                        {day}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                        {month}
                      </p>
                      <p className="text-[10px] text-slate-400/60">{year}</p>
                    </div>

                    {/* QR Code */}
                    <div
                      className="w-[72px] h-[72px] rounded-lg p-2 border border-slate-200"
                      style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      }}
                    >
                      <QRPlaceholder />
                    </div>

                    {/* VIP Badge */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="px-3 py-1 bg-gradient-to-r from-accent-50 to-accent-100/60 border border-accent-200/40 rounded-full">
                        <span className="text-accent-600/80 text-[9px] font-black tracking-[0.25em] uppercase">
                          ★ VIP
                        </span>
                      </div>
                      <Plane className={`w-3 h-3 text-slate-300/60 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* ▸ PERFORATED DIVIDER — Desktop (vertical) */}
                  <div className={`hidden lg:block relative w-0 z-20 ${isRTL ? 'order-2' : 'order-2'}`}>
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                    <div className="absolute top-7 bottom-7 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-slate-300" />
                    <div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  </div>

                  {/* ▸ PERFORATED DIVIDER — Mobile (horizontal) */}
                  <div className={`lg:hidden relative h-0 z-20 ${isRTL ? 'order-2' : 'order-2'}`}>
                    <div
                      className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                        boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
                      }}
                    />
                    <div className="border-t-2 border-dashed border-slate-300 mx-7" />
                    <div
                      className="absolute -right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
                        boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  </div>

                  {/* ▸ MAIN AREA — form fields */}
                  <div className={`flex-1 p-6 md:p-8 relative z-10 ${isRTL ? 'lg:order-1' : 'lg:order-3'}`}>

                    {/* Row 1: First Name + Last Name */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <TicketField
                        label={t('firstName')}
                        value={firstName}
                        onChange={(v) => {
                          setFirstName(v);
                          setErrors((p) => ({ ...p, firstName: '' }));
                        }}
                        placeholder={isRTL ? 'ישראל' : 'John'}
                        error={errors.firstName}
                        disabled={isSubmitting}
                      />
                      <TicketField
                        label={t('lastName')}
                        value={lastName}
                        onChange={setLastName}
                        placeholder={isRTL ? 'ישראלי' : 'Doe'}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Row 2: Email (full width) */}
                    <div className="mb-5">
                      <TicketField
                        label={t('email')}
                        value={email}
                        onChange={setEmail}
                        placeholder="email@example.com"
                        type="email"
                        disabled={isSubmitting}
                        dir="ltr"
                      />
                    </div>

                    {/* Decorative flight path separator */}
                    <div className="my-4">
                      <PlanePath isRTL={isRTL} />
                    </div>

                    {/* Row 3: Decorative fields — Route / Seat / Gate */}
                    <div className="grid grid-cols-3 gap-5 mb-6">
                      <TicketField
                        label={t('route')}
                        readOnly
                        displayValue={t('routeValue')}
                        gold
                      />
                      <TicketField
                        label={t('seat')}
                        readOnly
                        displayValue={t('seatValue')}
                        gold
                      />
                      <TicketField
                        label={t('gate')}
                        readOnly
                        displayValue={t('gateValue')}
                        gold
                      />
                    </div>

                    {/* Error */}
                    {submitError && (
                      <p className="text-red-500 text-sm text-center mb-3">{submitError}</p>
                    )}

                    {/* Row 4: CTA Button — full width at bottom */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        group w-full py-3.5 rounded-xl font-bold text-[15px]
                        text-white transition-all duration-300
                        flex items-center justify-center gap-2.5
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                      style={{
                        background: isSubmitting
                          ? '#cbd5e1'
                          : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 40%, #1e40af 100%)',
                        boxShadow: isSubmitting
                          ? 'none'
                          : '0 4px 14px -2px rgba(37,99,235,0.35), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.12)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 24px -4px rgba(37,99,235,0.4), 0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (!isSubmitting) {
                          e.currentTarget.style.boxShadow =
                            '0 4px 14px -2px rgba(37,99,235,0.35), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.12)';
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plane className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
                      )}
                      {isSubmitting ? t('submitting') : t('boardNow')}
                    </button>

                    {/* Barcode — bottom of ticket */}
                    <div className="mt-4">
                      <Barcode className="opacity-[0.18]" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-7 mt-10 text-primary-300/50 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-400/50" />
              {t('benefit1')}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-400/50" />
              {t('benefit2')}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-400/50" />
              {t('benefit3')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
