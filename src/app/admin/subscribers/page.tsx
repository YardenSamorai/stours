'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Calendar,
  Trash2,
  Download,
  Loader2
} from 'lucide-react';
import type { NewsletterSubscriber } from '@/db/schema';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json();
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מנוי זה?')) return;
    
    try {
      await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.isActive).length;

  // Count subscribers from this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthCount = subscribers.filter(s => 
    s.subscribedAt && new Date(s.subscribedAt) >= thisMonth
  ).length;

  const exportToCSV = () => {
    const csv = 'Email,Subscribed At,Status\n' + 
      subscribers.map(s => 
        `${s.email},${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : ''},${s.isActive ? 'Active' : 'Inactive'}`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
  };

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
          <h1 className="text-2xl font-bold text-slate-800">מנויי ניוזלטר</h1>
          <p className="text-slate-500">נהל את רשימת המנויים לניוזלטר</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          ייצא ל-CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-slate-800">{subscribers.length}</div>
          <div className="text-slate-500 text-sm">סה״כ מנויים</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-slate-500 text-sm">פעילים</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">+{thisMonthCount}</div>
          <div className="text-slate-500 text-sm">החודש</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי אימייל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      {filteredSubscribers.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-right">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onChange={() => {
                        if (selectedSubscribers.length === filteredSubscribers.length) {
                          setSelectedSubscribers([]);
                        } else {
                          setSelectedSubscribers(filteredSubscribers.map(s => s.id));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 rounded border-slate-300"
                    />
                  </th>
                  <th className="p-4 text-right font-semibold text-slate-600">אימייל</th>
                  <th className="p-4 text-right font-semibold text-slate-600">תאריך הרשמה</th>
                  <th className="p-4 text-right font-semibold text-slate-600">סטטוס</th>
                  <th className="p-4 text-right font-semibold text-slate-600">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => {
                          setSelectedSubscribers(prev =>
                            prev.includes(subscriber.id)
                              ? prev.filter(id => id !== subscriber.id)
                              : [...prev, subscriber.id]
                          );
                        }}
                        className="w-4 h-4 text-primary-600 rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-slate-800">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {subscriber.subscribedAt 
                          ? new Date(subscriber.subscribedAt).toLocaleDateString('he-IL')
                          : '-'
                        }
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscriber.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {subscriber.isActive ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="מחק"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500">לא נמצאו מנויים</p>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-4">
          <span>{selectedSubscribers.length} נבחרו</span>
          <button
            onClick={() => {
              if (confirm(`האם אתה בטוח שברצונך למחוק ${selectedSubscribers.length} מנויים?`)) {
                Promise.all(
                  selectedSubscribers.map(id => 
                    fetch(`/api/subscribers/${id}`, { method: 'DELETE' })
                  )
                ).then(() => {
                  fetchSubscribers();
                  setSelectedSubscribers([]);
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            מחק
          </button>
          <button
            onClick={() => setSelectedSubscribers([])}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            בטל
          </button>
        </div>
      )}
    </div>
  );
}
