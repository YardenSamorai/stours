'use client';

import { useMemo } from 'react';
import { Check, X, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';

interface BlogFormData {
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  excerpt: string;
  excerptEn: string;
  metaTitle: string;
  metaTitleEn: string;
  metaDescription: string;
  metaDescriptionEn: string;
  image: string;
  slug: string;
  category: string;
  authorName: string;
}

interface CheckItem {
  id: string;
  label: string;
  tip: string;
  passed: boolean;
  weight: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text: string): number {
  const clean = stripHtml(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(w => w.length > 0).length;
}

function countHeadings(html: string, tag: string): number {
  const regex = new RegExp(`<${tag}[\\s>]`, 'gi');
  return (html.match(regex) || []).length;
}

function hasInternalLinks(html: string): boolean {
  return /<a\s[^>]*href=["'][^"']*\/(he|en)\/(destinations|contact|services|blog)/i.test(html);
}

function hasImages(html: string): boolean {
  return /<img\s/i.test(html);
}

function hasImagesWithAlt(html: string): boolean {
  const imgs = html.match(/<img\s[^>]*>/gi) || [];
  if (imgs.length === 0) return false;
  return imgs.every(img => /alt=["'][^"']+["']/i.test(img));
}

export default function SeoChecklist({ formData }: { formData: BlogFormData }) {
  const checks = useMemo<CheckItem[]>(() => {
    const content = formData.content;
    const wordCount = countWords(content);
    const metaDescLen = formData.metaDescription.length;
    const metaTitleLen = (formData.metaTitle || formData.title).length;
    const h2Count = countHeadings(content, 'h2');
    const h1InContent = countHeadings(content, 'h1');

    return [
      {
        id: 'title',
        label: 'כותרת פוסט מוגדרת',
        tip: 'כותרת היא הדבר הראשון שגוגל רואה. ודא שהיא ברורה וכוללת מילת מפתח.',
        passed: formData.title.length >= 10,
        weight: 15,
      },
      {
        id: 'meta-title',
        label: `Meta Title (${metaTitleLen} תווים, מומלץ 30-60)`,
        tip: 'זו הכותרת שמופיעה בתוצאות גוגל. אם ריק, הכותרת הרגילה תוצג.',
        passed: metaTitleLen >= 30 && metaTitleLen <= 60,
        weight: 10,
      },
      {
        id: 'meta-desc',
        label: `Meta Description (${metaDescLen} תווים, מומלץ 120-160)`,
        tip: 'התיאור שמופיע מתחת לכותרת בגוגל. כתוב משפט שמזמין ללחוץ.',
        passed: metaDescLen >= 120 && metaDescLen <= 160,
        weight: 10,
      },
      {
        id: 'content-length',
        label: `אורך תוכן: ${wordCount} מילים (מינימום 300, מומלץ 800+)`,
        tip: 'פוסטים ארוכים ומפורטים מדורגים גבוה יותר. שאף ל-800+ מילים.',
        passed: wordCount >= 300,
        weight: 20,
      },
      {
        id: 'content-excellent',
        label: `תוכן מעמיק (800+ מילים)`,
        tip: 'תוכן של 800+ מילים נחשב מעמיק ומקבל דירוג גבוה יותר בגוגל.',
        passed: wordCount >= 800,
        weight: 5,
      },
      {
        id: 'excerpt',
        label: 'תקציר מוגדר',
        tip: 'תקציר טוב עוזר לגוגל להבין את הנושא ומוצג ברשימת הבלוג.',
        passed: formData.excerpt.length >= 50,
        weight: 5,
      },
      {
        id: 'image',
        label: 'תמונה ראשית מוגדרת',
        tip: 'תמונה ראשית חשובה גם ל-SEO וגם לשיתוף ברשתות חברתיות.',
        passed: formData.image.length > 0,
        weight: 10,
      },
      {
        id: 'h2-headings',
        label: `כותרות H2 בתוכן (${h2Count} נמצאו, מומלץ 2+)`,
        tip: 'חלוקה לסעיפים עם <h2> עוזרת לגוגל להבין את מבנה המאמר.',
        passed: h2Count >= 2,
        weight: 10,
      },
      {
        id: 'no-h1',
        label: 'ללא H1 בתוכן (הכותרת הראשית היא H1)',
        tip: 'כותרת הפוסט כבר מוצגת כ-H1. H1 נוסף בתוכן מבלבל את גוגל.',
        passed: h1InContent === 0,
        weight: 5,
      },
      {
        id: 'internal-links',
        label: 'קישורים פנימיים לדפים אחרים באתר',
        tip: 'הוסף קישורים לדילים, שירותים, או מאמרים אחרים. לדוגמה: <a href="/he/destinations/1">הדיל שלנו</a>',
        passed: hasInternalLinks(content),
        weight: 10,
      },
      {
        id: 'slug',
        label: 'Slug URL מוגדר',
        tip: 'כתובת URL נקייה וברורה עוזרת לגוגל. עדיף באנגלית.',
        passed: formData.slug.length >= 3,
        weight: 5,
      },
      {
        id: 'category',
        label: 'קטגוריה מוגדרת',
        tip: 'קטגוריה עוזרת לגוגל לסווג את התוכן ומשפרת ניווט באתר.',
        passed: formData.category.length > 0,
        weight: 3,
      },
      {
        id: 'author',
        label: 'שם מחבר מוגדר',
        tip: 'מחבר ידוע מגביר אמינות (E-E-A-T) ומופיע ב-Schema markup.',
        passed: formData.authorName.length > 0,
        weight: 2,
      },
    ];
  }, [formData]);

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks.reduce((s, c) => s + (c.passed ? c.weight : 0), 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const passedCount = checks.filter(c => c.passed).length;
  const failedChecks = checks.filter(c => !c.passed);

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const scoreLabel = score >= 80 ? 'מצוין! המאמר מוכן לקידום' : score >= 50 ? 'סביר, אבל אפשר לשפר' : 'חלש - צריך שיפור';

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Score Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            ציון SEO
          </h2>
          <span className={`text-2xl font-black ${scoreColor}`}>{score}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${scoreBg} rounded-full transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{passedCount}/{checks.length} קריטריונים עברו</p>
      </div>

      {/* Checklist */}
      <div className="p-3 sm:p-4 space-y-1.5 max-h-[400px] overflow-y-auto">
        {checks.map(check => (
          <div
            key={check.id}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
              check.passed ? 'bg-green-50/60' : 'bg-red-50/60'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              check.passed ? 'bg-green-500' : 'bg-red-400'
            }`}>
              {check.passed
                ? <Check className="w-3 h-3 text-white" />
                : <X className="w-3 h-3 text-white" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${check.passed ? 'text-green-800' : 'text-red-800'}`}>
                {check.label}
              </p>
              {!check.passed && (
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{check.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      {failedChecks.length > 0 && failedChecks.length <= 3 && (
        <div className="px-4 pb-4 pt-2">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-amber-800">טיפ לשיפור</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              {failedChecks[0].tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
