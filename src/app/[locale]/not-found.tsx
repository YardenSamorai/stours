import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-8 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-primary-600" />
        </div>
        <h1 className="text-6xl font-black text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">הדף לא נמצא</h2>
        <p className="text-slate-600 mb-8">
          נראה שהגעתם ליעד שלא קיים. אולי הדף הוזז או נמחק.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-all"
          >
            צרו קשר
          </Link>
        </div>
      </div>
    </div>
  );
}
