'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  GripVertical,
  Save,
  X,
  Upload,
} from 'lucide-react';
import type { TeamMember } from '@/db/schema';

interface MemberForm {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  image: string;
}

const emptyForm: MemberForm = { name: '', nameEn: '', role: '', roleEn: '', image: '' };

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team-members');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      nameEn: m.nameEn || '',
      role: m.role || '',
      roleEn: m.roleEn || '',
      image: m.image || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('שם הוא שדה חובה');
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/team-members/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/team-members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: members.length }),
        });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (m: TeamMember) => {
    try {
      await fetch(`/api/team-members/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !m.isActive }),
      });
      fetchMembers();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deleteMember = async (id: number) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק חבר צוות זה?')) return;
    try {
      await fetch(`/api/team-members/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const moveOrder = async (id: number, direction: 'up' | 'down') => {
    const idx = members.findIndex(m => m.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= members.length) return;

    try {
      await Promise.all([
        fetch(`/api/team-members/${members[idx].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: members[swapIdx].order }),
        }),
        fetch(`/api/team-members/${members[swapIdx].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: members[idx].order }),
        }),
      ]);
      fetchMembers();
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
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
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">צוות</h1>
          <p className="text-slate-500">ניהול חברי הצוות שמופיעים בדף אודות ({members.length} חברים)</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          חבר צוות חדש
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? 'עריכת חבר צוות' : 'חבר צוות חדש'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">שם (עברית) *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">שם (English)</label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={e => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">תפקיד (עברית)</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">תפקיד (English)</label>
                <input
                  type="text"
                  value={form.roleEn}
                  onChange={e => setForm({ ...form, roleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">תמונה</label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... או העלה קובץ"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="ltr"
                />
                <label className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors text-sm">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  העלה
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-3 w-20 h-20 rounded-full object-cover" />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'שומר...' : 'שמור'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      {members.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {members.map((m, idx) => (
              <div key={m.id} className={`flex flex-wrap items-center gap-2 sm:gap-4 p-4 hover:bg-slate-50 transition-colors ${!m.isActive ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveOrder(m.id, 'up')}
                    disabled={idx === 0}
                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="הזז למעלה"
                  >
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => moveOrder(m.id, 'down')}
                    disabled={idx === members.length - 1}
                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="הזז למטה"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-base sm:text-lg shrink-0">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800">{m.name}</h3>
                    {m.role && <p className="text-sm text-slate-500">{m.role}</p>}
                    {m.nameEn && <p className="text-xs text-slate-400" dir="ltr">{m.nameEn}{m.roleEn ? ` — ${m.roleEn}` : ''}</p>}
                  </div>
                </div>

                <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                  m.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {m.isActive ? 'פעיל' : 'מוסתר'}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(m)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="ערוך"
                  >
                    <Save className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => toggleActive(m)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={m.isActive ? 'הסתר' : 'הצג'}
                  >
                    {m.isActive ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-green-600" />}
                  </button>
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 mb-4">עדיין אין חברי צוות. הוסף את הראשון!</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף חבר צוות
          </button>
        </div>
      )}
    </div>
  );
}
