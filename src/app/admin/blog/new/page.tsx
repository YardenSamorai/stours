'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  Save, 
  Eye,
  Image as ImageIcon
} from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'he' | 'en'>('he');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('שגיאה ביצירת הפוסט. אנא נסה שוב.');
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
          <h1 className="text-2xl font-bold text-slate-800">פוסט חדש</h1>
          <p className="text-slate-500">כתוב פוסט חדש לבלוג</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm inline-flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('he')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
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
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
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
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: formData.slug || generateSlug(e.target.value)
                        });
                      }}
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
                    <p className="text-xs text-slate-500 mt-2">
                      ניתן להשתמש בתגיות HTML כמו &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt; וכו'
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Title (English) *
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
                      placeholder="Short excerpt of the post..."
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
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
                      placeholder="תיאור לתוצאות חיפוש (מומלץ 150-160 תווים)"
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
                      placeholder="Description for search results (150-160 characters recommended)"
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
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
                <span className="text-slate-700">פרסם מיד</span>
              </label>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">קטגוריה</h2>
              
              <select
                value={formData.category}
                onChange={(e) => {
                  const selected = categories.find(c => c.he === e.target.value);
                  setFormData({ 
                    ...formData, 
                    category: e.target.value,
                    categoryEn: selected?.en || ''
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
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
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
                {isSubmitting ? 'שומר...' : 'שמור פוסט'}
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-semibold transition-colors"
              >
                <Eye className="w-5 h-5" />
                תצוגה מקדימה
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
