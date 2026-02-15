'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, Search } from 'lucide-react';

interface LocationResult {
  name: string;
  country: string;
  countryCode: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: string;
  onChange: (location: {
    destination: string;
    destinationEn: string;
    country: string;
    countryEn: string;
    lat?: number;
    lng?: number;
  }) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function LocationPicker({
  value,
  onChange,
  placeholder = 'חפש יעד...',
  label = 'יעד',
  required = false,
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use our own API route to avoid CORS issues
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const locations: LocationResult[] = await response.json();
      
      setResults(locations);
      setIsOpen(locations.length > 0);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleSelectLocation = (location: LocationResult) => {
    const displayName = location.name || location.city || '';
    setInputValue(displayName);
    setIsOpen(false);
    setResults([]);
    
    onChange({
      destination: displayName,
      destinationEn: displayName, // Photon returns in the requested language
      country: location.country,
      countryEn: location.countryCode.toUpperCase(),
      lat: location.lat,
      lng: location.lng,
    });
  };

  const handleClear = () => {
    setInputValue('');
    setResults([]);
    onChange({
      destination: '',
      destinationEn: '',
      country: '',
      countryEn: '',
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <MapPin className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full ps-12 pe-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          required={required}
          autoComplete="off"
        />
        
        {isLoading && (
          <Loader2 className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
        )}
        
        {!isLoading && inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute end-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
      
      <p className="text-xs text-slate-500 mt-1">
        🔍 התחל להקליד ובחר מהרשימה - המדינה תתמלא אוטומטית
      </p>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 max-h-64 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={`${location.name}-${location.country}-${index}`}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full px-4 py-3 text-start hover:bg-primary-50 flex items-center gap-3 transition-colors border-b border-slate-100 last:border-0"
            >
              <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {location.name || location.city}
                </div>
                <div className="text-sm text-slate-500 truncate">
                  {[location.state, location.country].filter(Boolean).join(', ')}
                </div>
              </div>
              <div className="text-xs text-slate-400 flex-shrink-0">
                {location.countryCode?.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {isOpen && inputValue.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-center text-slate-500">
          <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          לא נמצאו תוצאות
        </div>
      )}
    </div>
  );
}
