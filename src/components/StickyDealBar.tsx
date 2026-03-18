'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface StickyDealBarProps {
  dealTitle: string;
  price: string;
  whatsappUrl: string;
  phoneNumber: string;
  isHebrew: boolean;
}

export default function StickyDealBar({ dealTitle, price, whatsappUrl, phoneNumber, isHebrew }: StickyDealBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg transform transition-transform duration-300">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-bold text-slate-800 truncate text-sm md:text-base">{dealTitle}</span>
          <span className="text-primary-600 font-black text-lg whitespace-nowrap">{price}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{isHebrew ? 'וואטסאפ' : 'WhatsApp'}</span>
          </a>
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{isHebrew ? 'התקשרו' : 'Call'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
