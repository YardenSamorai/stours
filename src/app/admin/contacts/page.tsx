'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import type { ContactSubmission } from '@/db/schema';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (contact: ContactSubmission) => {
    try {
      await fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !contact.isRead }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק פנייה זו?')) return;
    
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.destination?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const unreadCount = contacts.filter(c => !c.isRead).length;

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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">פניות לקוחות</h1>
        <p className="text-slate-500">נהל את הפניות שהתקבלו מהאתר</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-slate-800">{contacts.length}</div>
          <div className="text-slate-500 text-sm">סה״כ פניות</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-amber-600">{unreadCount}</div>
          <div className="text-slate-500 text-sm">לא נקראו</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{contacts.length - unreadCount}</div>
          <div className="text-slate-500 text-sm">טופלו</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש פניות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts List */}
      {filteredContacts.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer ${
                !contact.isRead ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    contact.isRead ? 'bg-slate-400' : 'bg-primary-600'
                  }`}>
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{contact.name}</h3>
                      {!contact.isRead && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          חדש
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {contact.destination && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {contact.destination}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleString('he-IL') : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(contact);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={contact.isRead ? 'סמן כלא נקרא' : 'סמן כנקרא'}
                  >
                    {contact.isRead ? (
                      <Clock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteContact(contact.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Message */}
              {selectedContact === contact.id && contact.message && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">הודעה:</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl">
                    {contact.message}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      שלח אימייל
                    </a>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        התקשר
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500">לא נמצאו פניות</p>
        </div>
      )}
    </div>
  );
}
