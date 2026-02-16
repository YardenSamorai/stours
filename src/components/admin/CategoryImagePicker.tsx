'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, X, Check, ImageIcon } from 'lucide-react';
import { allCategoryImages, getImagesForCategory, type CategoryImage } from '@/lib/category-images';

interface CategoryImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  categoryName?: string;
  onClose?: () => void;
}

export default function CategoryImagePicker({
  value,
  onChange,
  categoryName = '',
  onClose,
}: CategoryImagePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get images based on category name or selected category
  const getDisplayImages = (): CategoryImage[] => {
    if (selectedCategory === 'all') {
      if (categoryName) {
        return getImagesForCategory(categoryName);
      }
      return allCategoryImages;
    }
    
    const categoryMap: Record<string, CategoryImage[]> = {
      beach: allCategoryImages.filter(img => img.tags.includes('beach')),
      mountain: allCategoryImages.filter(img => img.tags.includes('mountain')),
      desert: allCategoryImages.filter(img => img.tags.includes('desert')),
      mosque: allCategoryImages.filter(img => img.tags.includes('mosque')),
      pyramid: allCategoryImages.filter(img => img.tags.includes('pyramid')),
      tower: allCategoryImages.filter(img => img.tags.includes('tower')),
      city: allCategoryImages.filter(img => img.tags.includes('city')),
      nature: allCategoryImages.filter(img => img.tags.includes('nature')),
    };
    
    return categoryMap[selectedCategory] || allCategoryImages;
  };

  const images = getDisplayImages();

  // Filter by search
  const filteredImages = images.filter(img =>
    img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { id: 'all', label: 'הכל', icon: '🌍' },
    { id: 'beach', label: 'חוף', icon: '🏖️' },
    { id: 'mountain', label: 'הרים', icon: '⛰️' },
    { id: 'desert', label: 'מדבר', icon: '🏜️' },
    { id: 'mosque', label: 'מסגד', icon: '🕌' },
    { id: 'pyramid', label: 'פירמידות', icon: '🔺' },
    { id: 'tower', label: 'מגדל', icon: '🗼' },
    { id: 'city', label: 'עיר', icon: '🏙️' },
    { id: 'nature', label: 'טבע', icon: '🌲' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">בחר תמונה</h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredImages.length} תמונות זמינות
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="חפש תמונות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="ml-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((img) => {
                const isSelected = value === img.url;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => onChange(img.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-primary-600 ring-4 ring-primary-200'
                        : 'border-slate-200 hover:border-primary-400'
                    }`}
                  >
                    <Image
                      src={img.thumbnail}
                      alt={img.description}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate">
                        {img.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">לא נמצאו תמונות</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            כל התמונות מ-<a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Unsplash</a> - חינם לשימוש
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
            >
              סגור
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
