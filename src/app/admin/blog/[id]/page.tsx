'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Save, 
  Eye,
  Loader2
} from 'lucide-react';
import type { BlogPost } from '@/db/schema';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    image: '',
    category: '',
    categoryEn: '',
    authorName: '',
    metaTitle: '',
    metaTitleEn: '',
    metaDescription: '',
    metaDescriptionEn: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      if (!res.ok) throw new Error('Post not found');
      const data: BlogPost = await res.json();
      
      setFormData({
        title: data.title || '',
        titleEn: data.titleEn || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        excerptEn: data.excerptEn || '',
        content: data.content || '',
        contentEn: data.contentEn || '',
        image: data.image || '',
        category: data.category || '',
        categoryEn: data.categoryEn || '',
        authorName: data.authorName || '',
        metaTitle: data.metaTitle || '',
        metaTitleEn: data.metaTitleEn || '',
        metaDescription: data.metaDescription || '',
        metaDescriptionEn: data.metaDescriptionEn || '',
        isPublished: data.isPublished ?? false,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('לא ניתן לטעון את הפוסט');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('שגיאה בעדכון הפוסט. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { he: 'טיפים לטיולים', en: 'Travel Tips' },
    { he: 'יעדים', en: 'Destinations' },
    { he: 'חוויות', en: 'Experiences' },
    { he: 'מבצעים', en: 'Deals' },
    { he: 'חדשות', en: 'News' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">עריכת פוסט</h1>
          <p className="text-slate-500">עדכן את תוכן הפוסט</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm inline-flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-3 py-1.5 sm:px-6 sm:py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'he'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🇮🇱 עברית
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('en')}
            className={`px-3 py-1.5 sm:px-6 sm:py-2 rounded-xl font-medium transition-colors ${
              activeTab === 'en'
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🇺🇸 English
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Content */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">תוכן</h2>
              
              {activeTab === 'he' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      כותרת *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="כותרת הפוסט"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      תקציר
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="תקציר קצר של הפוסט..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      תוכן הפוסט *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="כתוב את תוכן הפוסט כאן... (תומך ב-HTML)"
                      rows={15}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Post Title"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      dir="ltr"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerptEn}
                      onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                      placeholder="Short excerpt..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      dir="ltr"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.contentEn}
                      onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                      placeholder="Write your post content here... (HTML supported)"
                      rows={15}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                      dir="ltr"
                    />
                  </div>
                </>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">SEO</h2>
              
              {activeTab === 'he' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="כותרת לתוצאות חיפוש"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="תיאור לתוצאות חיפוש"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Title (English)
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitleEn}
                      onChange={(e) => setFormData({ ...formData, metaTitleEn: e.target.value })}
                      placeholder="Title for search results"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescriptionEn}
                      onChange={(e) => setFormData({ ...formData, metaDescriptionEn: e.target.value })}
                      placeholder="Description for search results"
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      dir="ltr"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">פרסום</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-url"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-1">
                  /blog/{formData.slug || 'post-url'}
                </p>
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded border-slate-300"
                />
                <span className="text-slate-700">פורסם</span>
              </label>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">תמונה ראשית</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  קישור לתמונה
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
              
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">קטגוריה</h2>
              
              <select
                value={formData.category}
                onChange={(e) => {
                  const selected = categories.find(c => c.he === e.target.value);
                  setFormData({ 
                    ...formData, 
                    category: e.target.value,
                    categoryEn: selected?.en || formData.categoryEn
                  });
                }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((cat) => (
                  <option key={cat.he} value={cat.he}>{cat.he}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">מחבר</h2>
              
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="שם המחבר"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'שומר...' : 'עדכן פוסט'}
              </button>
              
              {formData.isPublished && formData.slug && (
                <Link
                  href={`/he/blog/${formData.slug}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-semibold transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  צפה בפוסט
                </Link>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
