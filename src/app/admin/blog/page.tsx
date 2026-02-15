'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Filter,
  Calendar,
  BarChart,
  Loader2
} from 'lucide-react';
import type { BlogPost } from '@/db/schema';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePostPublished = async (post: BlogPost) => {
    try {
      await fetch(`/api/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) return;
    
    try {
      await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const publishedCount = posts.filter(p => p.isPublished).length;
  const totalViews = posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">בלוג</h1>
          <p className="text-slate-500">נהל את הפוסטים והתוכן בבלוג</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          פוסט חדש
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-slate-800">{posts.length}</div>
          <div className="text-slate-500 text-sm">סה״כ פוסטים</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          <div className="text-slate-500 text-sm">פורסמו</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-slate-800">{totalViews.toLocaleString()}</div>
          <div className="text-slate-500 text-sm">צפיות</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="חיפוש פוסטים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600">סינון</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-40">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                  post.isPublished
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-500 text-white'
                }`}>
                  {post.isPublished ? 'פורסם' : 'טיוטה'}
                </span>
                {post.category && (
                  <span className="absolute bottom-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                    {post.category}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('he-IL')
                      : 'טיוטה'}
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    {(post.viewsCount || 0).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    עריכה
                  </Link>
                  <button
                    onClick={() => togglePostPublished(post)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={post.isPublished ? 'העבר לטיוטה' : 'פרסם'}
                  >
                    {post.isPublished ? (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 mb-4">לא נמצאו פוסטים</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            צור פוסט ראשון
          </Link>
        </div>
      )}
    </div>
  );
}
