'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'תמונה' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'העלאה נכשלה');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    } else {
      setError('רק קבצי תמונה מותרים');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = async () => {
    if (value) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: value }),
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {value ? (
        /* Preview */
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-slate-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors"
              title="החלף תמונה"
            >
              <Upload className="w-5 h-5 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors"
              title="הסר תמונה"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            }
            ${isUploading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-slate-600">מעלה תמונה...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-primary-100 rounded-full">
                <ImageIcon className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">
                  גרור תמונה לכאן או לחץ לבחירה
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  PNG, JPG, WebP או GIF (עד 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
