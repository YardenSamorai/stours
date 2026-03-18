'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { searchAirports, type Airport } from '@/data/airports';
import { Plane, Search, X } from 'lucide-react';

interface AirportPickerProps {
  iata: string;
  city: string;
  onSelect: (iata: string, city: string) => void;
  placeholder?: string;
  label?: string;
  compact?: boolean;
}

export default function AirportPicker({ iata, city, onSelect, placeholder, label, compact = false }: AirportPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (q.length >= 1) {
      const found = searchAirports(q);
      setResults(found);
      setIsOpen(found.length > 0);
      setHighlightIdx(0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const select = useCallback((airport: Airport) => {
    onSelect(airport.iata, airport.cityHe);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, [onSelect]);

  const clear = useCallback(() => {
    onSelect('', '');
    setQuery('');
  }, [onSelect]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightIdx]) select(results[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (compact) {
    return (
      <div ref={containerRef} className="relative">
        {iata ? (
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold text-sm flex-shrink-0" dir="ltr">{iata}</span>
            <span className="text-xs text-slate-600 truncate">{city}</span>
            <button type="button" onClick={clear} className="p-0.5 text-slate-400 hover:text-red-500 flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => search(e.target.value)}
            onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'IST'}
            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-center font-mono text-sm"
            dir="ltr"
          />
        )}
        {isOpen && (
          <DropdownList results={results} highlightIdx={highlightIdx} onSelect={select} onHover={setHighlightIdx} />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="block text-xs text-slate-600 mb-1">{label}</label>}

      {iata ? (
        <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 font-mono font-bold text-base sm:text-lg rounded flex-shrink-0" dir="ltr">
              {iata}
            </span>
            <span className="text-sm text-slate-700 truncate">{city}</span>
          </div>
          <button type="button" onClick={clear} className="p-1 text-slate-400 hover:text-red-500 rounded flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => search(e.target.value)}
            onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'חפש שדה תעופה...'}
            className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      )}

      {isOpen && (
        <DropdownList results={results} highlightIdx={highlightIdx} onSelect={select} onHover={setHighlightIdx} />
      )}
    </div>
  );
}

function DropdownList({ results, highlightIdx, onSelect, onHover }: {
  results: Airport[];
  highlightIdx: number;
  onSelect: (a: Airport) => void;
  onHover: (i: number) => void;
}) {
  return (
    <div className="absolute z-50 top-full mt-1 w-full min-w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl max-h-[240px] overflow-y-auto">
      {results.map((airport, i) => (
        <button
          key={airport.iata}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onSelect(airport); }}
          onMouseEnter={() => onHover(i)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-right transition-colors ${
            i === highlightIdx ? 'bg-primary-50' : 'hover:bg-slate-50'
          }`}
        >
          <span className="px-2 py-1 bg-slate-100 text-slate-800 font-mono font-bold text-sm rounded flex-shrink-0" dir="ltr">
            {airport.iata}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">{airport.nameHe}</div>
            <div className="text-xs text-slate-500 truncate">{airport.cityHe}, {airport.countryHe}</div>
          </div>
          <Plane className="w-4 h-4 text-slate-300 flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
