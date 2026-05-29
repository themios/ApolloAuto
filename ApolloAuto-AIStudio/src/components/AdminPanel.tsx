import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Lock, Mail, LogOut, Plus, Pencil, Trash2, Check, RefreshCw,
  Users, MapPin, BookOpen, HelpCircle,
  Megaphone, Star, BarChart2, Phone, Clock, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';

// ─── Shared types ────────────────────────────────────────────────────────────

interface Lead {
  id: string; date: string; name: string; phone: string; email: string;
  location: string; message: string; carInterest: string; creditStatus: string;
}
interface FeedItem   { id: string; date: string; title: string; content: string; }
interface Review     { id: string; name: string; location: string; carModel: string; rating: number; date: string; initials: string; quote: string; }
interface Article    { slug: string; title: string; category: string; summary: string; content: string; keywords: string[]; readTime: string; date: string; }
interface FAQ        { id: string; category: string; question: string; answer: string; }
interface Location   { id: string; city: string; county: string; phone: string; phoneDisplay: string; email: string; address: string; zip: string; inventoryUrl: string; hours: string[]; }

// ─── Auth context ────────────────────────────────────────────────────────────

const SESSION_KEY = 'apollo-admin-session'; // localStorage key

interface StoredSession { token: string; expiresAt: number; }

function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: StoredSession = JSON.parse(raw);
    if (Date.now() > s.expiresAt) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch { return null; }
}

interface AuthCtx {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthCtx>({
  adminFetch: (url, opts) => fetch(url, opts),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${type === 'success' ? 'bg-success/10 border border-success/20 text-success' : 'bg-red-50 border border-red-200 text-red-600'}`}>
      {type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
      {msg}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }: { icon: any; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between pb-4 border-b border-gray-100">
      <div>
        <h3 className="font-display font-bold text-lg text-navy flex items-center gap-2">
          <Icon className="w-5 h-5 text-gold" />
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full text-sm px-3 py-2.5 bg-paper/30 border border-gray-200 rounded-xl focus:border-gold focus:outline-none";
const btnPrimary = "px-4 py-2 bg-navy hover:bg-navy-soft text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50";
const btnDanger  = "p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer";
const btnEdit    = "p-1.5 text-gold hover:text-navy hover:bg-gold/10 rounded-lg transition-colors cursor-pointer";

// ─── Tab: Dashboard ──────────────────────────────────────────────────────────

function DashboardTab({ counts }: { counts: Record<string, number> }) {
  const cards = [
    { label: 'Open Leads',    value: counts.leads,        icon: Users,      color: 'text-sky' },
    { label: 'Feed Posts',    value: counts.feed,         icon: Megaphone,  color: 'text-sun' },
    { label: 'Reviews',       value: counts.reviews,      icon: Star,       color: 'text-gold' },
    { label: 'Articles',      value: counts.articles,     icon: BookOpen,   color: 'text-success' },
    { label: 'FAQ Items',     value: counts.faqs,         icon: HelpCircle, color: 'text-coral' },
    { label: 'Locations',     value: counts.locations,    icon: MapPin,     color: 'text-navy' },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart2} title="Dashboard" subtitle="Live counts across all managed content." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">
              <Icon className={`w-6 h-6 ${c.color}`} />
              <p className="text-2xl font-extrabold text-navy font-display">{c.value ?? '—'}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{c.label}</p>
            </div>
          );
        })}
      </div>
      <div className="p-4 bg-paper rounded-2xl border border-gray-100 text-sm text-navy-muted leading-relaxed">
        <strong className="text-navy">Tip:</strong> Use the tabs on the left to manage any section. Changes save immediately to the server. Leads and Feed updates reflect live on the homepage.
      </div>
    </div>
  );
}

// ─── Tab: Leads ──────────────────────────────────────────────────────────────

function LeadsTab() {
  const { adminFetch } = useContext(AuthContext);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await adminFetch('/api/leads');
    if (r.ok) setLeads(await r.json());
    setLoading(false);
  }, [adminFetch]);

  useEffect(() => { load(); }, [load]);

  const del = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    const r = await adminFetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (r.ok) { setLeads(l => l.filter(x => x.id !== id)); setToast({ msg: 'Lead deleted.', type: 'success' }); }
    else setToast({ msg: 'Delete failed.', type: 'error' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Users} title={`Leads (${leads.length})`} subtitle="Form submissions from the website contact form."
        action={<button onClick={load} className="flex items-center gap-1 text-xs text-gold hover:text-navy font-bold cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>}
      />
      {toast && <Toast {...toast} />}
      {loading ? <p className="text-xs text-slate-400 italic py-6 text-center">Loading leads...</p>
        : leads.length === 0 ? <p className="text-xs text-slate-400 italic py-6 text-center">No leads yet.</p>
        : (
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(e => e === lead.id ? null : lead.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-paper/40 transition-colors"
                >
                  <div>
                    <p className="font-bold text-sm text-navy">{lead.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="bg-navy/8 text-navy-muted px-2 py-0.5 rounded font-semibold">{lead.location}</span>
                      <span>{new Date(lead.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); del(lead.id); }} className={btnDanger} title="Delete lead"><Trash2 className="w-3.5 h-3.5" /></button>
                    {expanded === lead.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
                {expanded === lead.id && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <p><span className="text-slate-400 text-xs">Phone:</span><br /><a href={`tel:${lead.phone}`} className="font-bold text-gold hover:text-navy">{lead.phone}</a></p>
                      <p><span className="text-slate-400 text-xs">Email:</span><br /><span className="font-semibold text-navy">{lead.email}</span></p>
                      <p><span className="text-slate-400 text-xs">Car Interest:</span><br /><span className="text-navy">{lead.carInterest}</span></p>
                      <p><span className="text-slate-400 text-xs">Credit:</span><br /><span className="text-navy">{lead.creditStatus}</span></p>
                    </div>
                    {lead.message && <p className="bg-paper/40 rounded-xl p-3 text-xs italic text-gray-600 border border-gray-100">"{lead.message}"</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── Tab: Feed ───────────────────────────────────────────────────────────────

function FeedTab() {
  const { adminFetch } = useContext(AuthContext);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/feed').then(r => r.json()).then(setItems).catch(() => {});
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const r = await adminFetch('/api/feed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
    if (r.ok) { const item = await r.json(); setItems(i => [item, ...i]); setTitle(''); setContent(''); setToast({ msg: 'Announcement posted!', type: 'success' }); }
    else setToast({ msg: 'Post failed.', type: 'error' });
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const r = await adminFetch(`/api/feed/${id}`, { method: 'DELETE' });
    if (r.ok) setItems(i => i.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Megaphone} title="Feed / Announcements" subtitle="Posts shown in the homepage 'From the lot' bulletin." />
      {toast && <Toast {...toast} />}
      <form onSubmit={add} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-bold text-gold uppercase tracking-wider">New Post</p>
        <FieldRow label="Headline">
          <input className={inputCls} required placeholder="e.g. Memorial Week Cash Specials!" value={title} onChange={e => setTitle(e.target.value)} />
        </FieldRow>
        <FieldRow label="Body Text">
          <textarea className={`${inputCls} min-h-[80px]`} required placeholder="Details of the special, pricing, models, etc." value={content} onChange={e => setContent(e.target.value)} />
        </FieldRow>
        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Posting...' : 'Publish Announcement'}</button>
      </form>
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No announcements yet.</p>}
        {items.map(item => (
          <div key={item.id} className="flex items-start justify-between gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="space-y-1 min-w-0">
              <p className="font-bold text-sm text-navy truncate">{item.title}</p>
              <p className="text-xs text-slate-500">{item.date}</p>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{item.content}</p>
            </div>
            <button onClick={() => del(item.id)} className={`${btnDanger} shrink-0`} title="Delete"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Reviews ─────────────────────────────────────────────────────────────

const emptyReview = (): Omit<Review, 'id'> => ({ name: '', location: '', carModel: '', rating: 5, date: new Date().toISOString().split('T')[0], initials: '', quote: '' });

function ReviewsTab() {
  const { adminFetch } = useContext(AuthContext);
  const [items, setItems] = useState<Review[]>([]);
  const [form, setForm] = useState<Omit<Review, 'id'>>(emptyReview());
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetch('/api/testimonials').then(r => r.json()).then(setItems).catch(() => {}); }, []);

  const startEdit = (r: Review) => { setForm({ name: r.name, location: r.location, carModel: r.carModel, rating: r.rating, date: r.date, initials: r.initials, quote: r.quote }); setEditId(r.id); setShowForm(true); };
  const reset = () => { setForm(emptyReview()); setEditId(null); setShowForm(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, initials: form.initials || form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) };
    if (editId) {
      const r = await adminFetch(`/api/testimonials/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) { setItems(i => i.map(x => x.id === editId ? { ...x, ...payload } : x)); setToast({ msg: 'Review updated.', type: 'success' }); reset(); }
      else setToast({ msg: 'Update failed.', type: 'error' });
    } else {
      const r = await adminFetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) { const item = await r.json(); setItems(i => [item, ...i]); setToast({ msg: 'Review added.', type: 'success' }); reset(); }
      else setToast({ msg: 'Save failed.', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const r = await adminFetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (r.ok) setItems(i => i.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Star} title={`Reviews (${items.length})`} subtitle="Customer testimonials shown in the homepage carousel."
        action={<button onClick={() => { reset(); setShowForm(!showForm); }} className={`${btnPrimary} flex items-center gap-1`}><Plus className="w-3.5 h-3.5" />Add</button>}
      />
      {toast && <Toast {...toast} />}
      {showForm && (
        <form onSubmit={save} className="bg-paper/60 border border-gray-200 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-gold uppercase tracking-wider">{editId ? 'Edit Review' : 'New Review'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="Customer Name *"><input className={inputCls} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Maria Garcia" /></FieldRow>
            <FieldRow label="Initials"><input className={inputCls} value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} placeholder="MG (auto-generated if blank)" /></FieldRow>
            <FieldRow label="Location Label"><input className={inputCls} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="El Monte Lot Customer" /></FieldRow>
            <FieldRow label="Car Model"><input className={inputCls} value={form.carModel} onChange={e => setForm({ ...form, carModel: e.target.value })} placeholder="2019 Toyota Corolla SE" /></FieldRow>
            <FieldRow label="Rating (1–5)">
              <select className={inputCls} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 && 's'}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Date"><input type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></FieldRow>
          </div>
          <FieldRow label="Quote *"><textarea className={`${inputCls} min-h-[80px]`} required value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="Tim made the process completely transparent..." /></FieldRow>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : editId ? 'Update Review' : 'Add Review'}</button>
            <button type="button" onClick={reset} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-navy border border-gray-200 rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No reviews yet.</p>}
        {items.map(r => (
          <div key={r.id} className="flex items-start justify-between gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-extrabold text-gold shrink-0">{r.initials}</div>
              <div className="min-w-0 space-y-1">
                <p className="font-bold text-sm text-navy">{r.name} <span className="text-gold ml-1">{'★'.repeat(r.rating)}</span></p>
                <p className="text-xs text-slate-500">{r.location} · {r.carModel} · {r.date}</p>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 italic">"{r.quote}"</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(r)} className={btnEdit} title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(r.id)} className={btnDanger} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Articles ────────────────────────────────────────────────────────────

const emptyArticle = (): Omit<Article, 'slug'> => ({ title: '', category: 'Buyer Guide', summary: '', content: '', keywords: [], readTime: '5 min read', date: '' });

function ArticlesTab() {
  const { adminFetch } = useContext(AuthContext);
  const [items, setItems] = useState<Article[]>([]);
  const [form, setForm] = useState<Omit<Article, 'slug'>>(emptyArticle());
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetch('/api/articles').then(r => r.json()).then(setItems).catch(() => {}); }, []);

  const startEdit = (a: Article) => { setForm({ title: a.title, category: a.category, summary: a.summary, content: a.content, keywords: a.keywords, readTime: a.readTime, date: a.date }); setEditSlug(a.slug); setShowForm(true); };
  const reset = () => { setForm(emptyArticle()); setEditSlug(null); setShowForm(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, keywords: typeof form.keywords === 'string' ? (form.keywords as string).split(',').map(k => k.trim()) : form.keywords };
    if (editSlug) {
      const r = await adminFetch(`/api/articles/${editSlug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) { setItems(i => i.map(x => x.slug === editSlug ? { ...x, ...payload } : x)); setToast({ msg: 'Article updated.', type: 'success' }); reset(); }
      else setToast({ msg: 'Update failed.', type: 'error' });
    } else {
      const r = await adminFetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (r.ok) { const item = await r.json(); setItems(i => [item, ...i]); setToast({ msg: 'Article published.', type: 'success' }); reset(); }
      else setToast({ msg: 'Save failed.', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const del = async (slug: string) => {
    if (!confirm('Delete this article?')) return;
    const r = await adminFetch(`/api/articles/${slug}`, { method: 'DELETE' });
    if (r.ok) setItems(i => i.filter(x => x.slug !== slug));
  };

  const categories = ['Buyer Guide', 'Financing', 'Car Education', 'Trade-In', 'Credit Tips', 'Local Guide'];

  return (
    <div className="space-y-5">
      <SectionHeader icon={BookOpen} title={`Articles / Buying Tips (${items.length})`} subtitle="Blog articles shown in the Buyer Guides section."
        action={<button onClick={() => { reset(); setShowForm(!showForm); }} className={`${btnPrimary} flex items-center gap-1`}><Plus className="w-3.5 h-3.5" />New Article</button>}
      />
      {toast && <Toast {...toast} />}
      {showForm && (
        <form onSubmit={save} className="bg-paper/60 border border-gray-200 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-gold uppercase tracking-wider">{editSlug ? 'Edit Article' : 'New Article'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="Title *"><input className={inputCls} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What to Bring When Buying a Used Car" /></FieldRow>
            <FieldRow label="Category">
              <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Read Time"><input className={inputCls} value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read" /></FieldRow>
            <FieldRow label="Publish Date"><input className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="May 28, 2026" /></FieldRow>
          </div>
          <FieldRow label="Summary (shown in cards)"><textarea className={`${inputCls} min-h-[60px]`} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Short description shown on the card..." /></FieldRow>
          <FieldRow label="Keywords (comma-separated for SEO)"><input className={inputCls} value={Array.isArray(form.keywords) ? form.keywords.join(', ') : form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value as any })} placeholder="used car California, buying guide, documents" /></FieldRow>
          <FieldRow label="Content">
            <RichTextEditor
              value={form.content}
              onChange={html => setForm(f => ({ ...f, content: html }))}
              placeholder="Start writing your article — use the toolbar for headings, bold, lists, and links…"
            />
          </FieldRow>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : editSlug ? 'Update Article' : 'Publish Article'}</button>
            <button type="button" onClick={reset} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-navy border border-gray-200 rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No articles yet.</p>}
        {items.map(a => (
          <div key={a.slug} className="flex items-start justify-between gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">{a.category}</span>
                <span className="text-xs text-slate-400">{a.date}</span>
              </div>
              <p className="font-bold text-sm text-navy leading-snug">{a.title}</p>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{a.summary}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(a)} className={btnEdit} title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(a.slug)} className={btnDanger} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: FAQ ─────────────────────────────────────────────────────────────────

const emptyFaq = (): Omit<FAQ, 'id'> => ({ category: 'buying', question: '', answer: '' });

function FAQTab() {
  const { adminFetch } = useContext(AuthContext);
  const [items, setItems] = useState<FAQ[]>([]);
  const [form, setForm] = useState<Omit<FAQ, 'id'>>(emptyFaq());
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => { fetch('/api/faqs').then(r => r.json()).then(setItems).catch(() => {}); }, []);

  const startEdit = (f: FAQ) => { setForm({ category: f.category, question: f.question, answer: f.answer }); setEditId(f.id); setShowForm(true); };
  const reset = () => { setForm(emptyFaq()); setEditId(null); setShowForm(false); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      const r = await adminFetch(`/api/faqs/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (r.ok) { setItems(i => i.map(x => x.id === editId ? { ...x, ...form } : x)); setToast({ msg: 'FAQ updated.', type: 'success' }); reset(); }
      else setToast({ msg: 'Update failed.', type: 'error' });
    } else {
      const r = await adminFetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (r.ok) { const item = await r.json(); setItems(i => [...i, item]); setToast({ msg: 'FAQ added.', type: 'success' }); reset(); }
      else setToast({ msg: 'Save failed.', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const r = await adminFetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (r.ok) setItems(i => i.filter(x => x.id !== id));
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'buying', label: 'Buying' },
    { id: 'financing', label: 'Financing' },
    { id: 'visiting', label: 'Visiting' },
  ];
  const visible = activeCategory === 'all' ? items : items.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-5">
      <SectionHeader icon={HelpCircle} title={`FAQ (${items.length})`} subtitle="Questions shown on the Help & FAQ page."
        action={<button onClick={() => { reset(); setShowForm(!showForm); }} className={`${btnPrimary} flex items-center gap-1`}><Plus className="w-3.5 h-3.5" />Add FAQ</button>}
      />
      {toast && <Toast {...toast} />}
      {showForm && (
        <form onSubmit={save} className="bg-paper/60 border border-gray-200 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-gold uppercase tracking-wider">{editId ? 'Edit FAQ' : 'New FAQ'}</p>
          <FieldRow label="Category">
            <select className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="buying">Buying & Inventory</option>
              <option value="financing">Credit & Trade-Ins</option>
              <option value="visiting">Visiting Details</option>
            </select>
          </FieldRow>
          <FieldRow label="Question *"><input className={inputCls} required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Can I buy a car with bad credit?" /></FieldRow>
          <FieldRow label="Answer *"><textarea className={`${inputCls} min-h-[100px]`} required value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} placeholder="Yes! We work with specialized subprime lenders..." /></FieldRow>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : editId ? 'Update FAQ' : 'Add FAQ'}</button>
            <button type="button" onClick={reset} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-navy border border-gray-200 rounded-xl cursor-pointer">Cancel</button>
          </div>
        </form>
      )}
      <div className="flex gap-2">
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === c.id ? 'bg-navy text-white' : 'bg-paper text-navy-muted hover:bg-sky-light'}`}>{c.label}</button>
        ))}
      </div>
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {visible.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No FAQs in this category.</p>}
        {visible.map(f => (
          <div key={f.id} className="flex items-start justify-between gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="min-w-0 space-y-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${f.category === 'buying' ? 'bg-sky-light text-sky' : f.category === 'financing' ? 'bg-gold/10 text-gold' : 'bg-success/10 text-success'}`}>{f.category}</span>
              <p className="font-bold text-sm text-navy leading-snug">{f.question}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{f.answer}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(f)} className={btnEdit} title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => del(f.id)} className={btnDanger} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Locations ───────────────────────────────────────────────────────────

function LocationsTab() {
  const { adminFetch } = useContext(AuthContext);
  const [locations, setLocations] = useState<Location[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => { fetch('/api/locations').then(r => r.json()).then(setLocations).catch(() => {}); }, []);

  const startEdit = (loc: Location) => { setFormData({ ...loc }); setEditing(loc.id); };
  const cancel = () => { setEditing(null); setFormData({}); };

  const save = async (id: string) => {
    setSaving(true);
    const r = await adminFetch(`/api/locations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (r.ok) {
      setLocations(l => l.map(x => x.id === id ? { ...x, ...formData } : x));
      setToast({ msg: 'Location updated.', type: 'success' });
      cancel();
    } else setToast({ msg: 'Save failed.', type: 'error' });
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={MapPin} title="Locations & Hours" subtitle="Edit phone, email, address, and hours for each lot." />
      {toast && <Toast {...toast} />}
      {locations.map(loc => (
        <div key={loc.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <p className="font-display font-bold text-navy text-base">{loc.city} — {loc.county}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{loc.address}, {loc.zip}</p>
            </div>
            {editing !== loc.id
              ? <button onClick={() => startEdit(loc)} className={`${btnPrimary} flex items-center gap-1`}><Pencil className="w-3.5 h-3.5" />Edit</button>
              : <button onClick={cancel} className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-gray-200 rounded-xl cursor-pointer hover:text-navy">Cancel</button>
            }
          </div>
          {editing === loc.id ? (
            <div className="p-5 space-y-4 bg-paper/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldRow label="Phone (digits only)"><input className={inputCls} value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="8054043873" /></FieldRow>
                <FieldRow label="Phone Display"><input className={inputCls} value={formData.phoneDisplay || ''} onChange={e => setFormData({ ...formData, phoneDisplay: e.target.value })} placeholder="(805) 404-3873" /></FieldRow>
                <FieldRow label="Email"><input type="email" className={inputCls} value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} /></FieldRow>
                <FieldRow label="Inventory URL"><input className={inputCls} value={formData.inventoryUrl || ''} onChange={e => setFormData({ ...formData, inventoryUrl: e.target.value })} /></FieldRow>
                <FieldRow label="Street Address"><input className={inputCls} value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} /></FieldRow>
                <FieldRow label="Zip Code"><input className={inputCls} value={formData.zip || ''} onChange={e => setFormData({ ...formData, zip: e.target.value })} /></FieldRow>
              </div>
              <FieldRow label="Hours — Weekdays">
                <input className={inputCls} value={formData.hours?.[0] || ''} onChange={e => setFormData({ ...formData, hours: [e.target.value, formData.hours?.[1] || 'Sunday: Closed'] })} placeholder="Monday - Saturday: 9:00 AM - 6:00 PM" />
              </FieldRow>
              <FieldRow label="Hours — Sunday">
                <input className={inputCls} value={formData.hours?.[1] || ''} onChange={e => setFormData({ ...formData, hours: [formData.hours?.[0] || '', e.target.value] })} placeholder="Sunday: Closed" />
              </FieldRow>
              <button onClick={() => save(loc.id)} disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : 'Save Location'}</button>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />Phone</p><p className="font-semibold text-navy mt-0.5">{loc.phoneDisplay}</p></div>
              <div><p className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" />Email</p><p className="font-semibold text-navy mt-0.5">{loc.email}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />Hours</p>{loc.hours?.map((h, i) => <p key={i} className="text-navy mt-0.5">{h}</p>)}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

interface AdminPanelProps {
  onAnnouncementAdded?: () => void;
  leadsList?: any[];
  onRefreshLeads?: () => void;
}

type TabId = 'dashboard' | 'leads' | 'feed' | 'reviews' | 'articles' | 'faq' | 'locations';

export default function AdminPanel({ }: AdminPanelProps) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Restore session from localStorage on mount; clear if expired
  useEffect(() => {
    const stored = getStoredSession();
    if (stored) setSession(stored);
  }, []);

  const handleLogout = useCallback(() => {
    const token = session?.token;
    if (token) fetch('/api/admin/logout', { method: 'POST', headers: { 'x-admin-token': token } }).catch(() => {});
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setUsername('');
    setPassword('');
  }, [session]);

  // adminFetch injects the auth header. It does NOT auto-logout on 401 — a single
  // failed request (transient error, dev server restart) must not clear the session.
  // Session expiry is checked on mount via getStoredSession(); tabs surface errors
  // through their own toast state.
  const adminFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = session?.token ?? '';
    return fetch(url, {
      ...options,
      headers: { ...(options.headers ?? {}), 'x-admin-token': token },
    });
  }, [session]);

  // Load dashboard counts once authenticated
  useEffect(() => {
    if (!session) return;
    Promise.all([
      adminFetch('/api/leads').then(r => r.ok ? r.json() : []),
      fetch('/api/feed').then(r => r.json()),
      fetch('/api/testimonials').then(r => r.json()),
      fetch('/api/articles').then(r => r.json()),
      fetch('/api/faqs').then(r => r.json()),
      fetch('/api/locations').then(r => r.json()),
    ]).then(([leads, feed, reviews, articles, faqs, locations]) => {
      setCounts({ leads: leads.length, feed: feed.length, reviews: reviews.length, articles: articles.length, faqs: faqs.length, locations: locations.length });
    }).catch(() => {});
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await r.json();
      if (r.ok && data.success) {
        const stored: StoredSession = { token: data.token, expiresAt: data.expiresAt };
        localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
        setSession(stored);
      } else {
        setLoginError(data.error || 'Access denied.');
      }
    } catch { setLoginError('Login server unreachable.'); }
  };

  const isAuthenticated = session !== null;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-150 p-8 shadow-xl reveal-entry select-none">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-navy/10 rounded-2xl flex items-center justify-center text-navy mx-auto"><Lock className="w-6 h-6" /></div>
          <h2 className="font-display font-extrabold text-2xl text-navy">Apollo Admin</h2>
          <p className="text-xs text-gray-500">Authorized personnel only.</p>
        </div>
        {loginError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">{loginError}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-user" className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gold" />Username or Email</label>
            <input id="admin-user" type="text" required placeholder="admin@apolloauto.us" value={username} onChange={e => setUsername(e.target.value)} className="w-full text-sm px-4 py-2.5 bg-paper/25 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-pass" className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gold" />Password</label>
            <input id="admin-pass" type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full text-sm px-4 py-2.5 bg-paper/25 border border-gray-100 rounded-xl focus:border-gold focus:outline-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-navy hover:bg-navy-soft text-white font-bold text-sm transition-all shadow-md cursor-pointer">Sign In</button>
        </form>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard',  icon: BarChart2 },
    { id: 'leads',     label: 'Leads',       icon: Users,     badge: counts.leads },
    { id: 'feed',      label: 'Feed',        icon: Megaphone  },
    { id: 'reviews',   label: 'Reviews',     icon: Star       },
    { id: 'articles',  label: 'Articles',    icon: BookOpen   },
    { id: 'faq',       label: 'FAQ',         icon: HelpCircle },
    { id: 'locations', label: 'Locations',   icon: MapPin     },
  ];

  return (
    <div className="reveal-entry">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-gray-100">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">CMS Panel</span>
          <h2 className="font-display font-extrabold text-2xl text-navy leading-tight">Apollo Management Station</h2>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer">
          <LogOut className="w-3.5 h-3.5" />Exit
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-52 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === t.id ? 'bg-navy text-white shadow-md' : 'text-navy-muted hover:text-navy hover:bg-sky-light/60'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
                {t.badge != null && t.badge > 0 && (
                  <span className={`ml-auto text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === t.id ? 'bg-white/20 text-white' : 'bg-gold/20 text-gold'}`}>{t.badge}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content panel */}
        <AuthContext.Provider value={{ adminFetch }}>
          <div className="flex-1 min-w-0 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            {activeTab === 'dashboard'  && <DashboardTab counts={counts} />}
            {activeTab === 'leads'      && <LeadsTab />}
            {activeTab === 'feed'       && <FeedTab />}
            {activeTab === 'reviews'    && <ReviewsTab />}
            {activeTab === 'articles'   && <ArticlesTab />}
            {activeTab === 'faq'        && <FAQTab />}
            {activeTab === 'locations'  && <LocationsTab />}
          </div>
        </AuthContext.Provider>
      </div>
    </div>
  );
}
