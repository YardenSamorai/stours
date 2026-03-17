'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function UrgencyBanner() {
  const [text, setText] = useState('');
  const [textEn, setTextEn] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('banner_dismissed')) {
      setDismissed(true);
      setLoaded(true);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/site-settings?key=urgencyBanner');
        if (res.ok) {
          const data = await res.json();
          if (data.value) setText(data.value);
          if (data.valueEn) setTextEn(data.valueEn);
        }
      } catch {}
      setLoaded(true);
    };
    load();
  }, []);

  if (!loaded || dismissed || !text) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('banner_dismissed', '1');
  };

  return (
    <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white relative z-[51]">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium">
        <span className="text-center flex-1">{text}</span>
        <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
