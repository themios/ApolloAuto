import React, { useState, useEffect } from 'react';
import { Lock, Mail, FileText, Plus, Users, Landmark, MapPin, Calendar, Clock, LogOut, CheckCircle, Car } from 'lucide-react';

interface Lead {
  id: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
  carInterest: string;
  creditStatus: string;
}

interface FeedItem {
  id: string;
  date: string;
  title: string;
  content: string;
}

interface AdminPanelProps {
  onAnnouncementAdded?: () => void;
  leadsList?: Lead[];
  onRefreshLeads?: () => void;
}

export default function AdminPanel({ onAnnouncementAdded, leadsList = [], onRefreshLeads }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // CMS States
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [localLeads, setLocalLeads] = useState<Lead[]>(leadsList);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('apollo-admin-token');
    if (token) {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('apollo-admin-token', data.token);
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setErrorMsg(data.error || 'Access Denied. Check credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Login server unreachable. Please contact system administration.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('apollo-admin-token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLocalLeads(data);
        if (onRefreshLeads) onRefreshLeads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementContent) return;

    setIsPosting(true);
    setPostSuccess(false);

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announcementTitle,
          content: announcementContent
        })
      });

      if (res.ok) {
        setPostSuccess(true);
        setAnnouncementTitle('');
        setAnnouncementContent('');
        if (onAnnouncementAdded) {
          onAnnouncementAdded();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-150 p-8 shadow-xl reveal-entry select-none">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-navy/10 rounded-2xl flex items-center justify-center text-navy mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-navy">Tim’s Admin CMS Portal</h2>
          <p className="text-xs text-gray-500">Access lead management folders and broadcast lot specials.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-gold" />
              <span>Username or Email</span>
            </label>
            <input
              type="text"
              required
              placeholder="admin@apolloauto.us"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-paper/25 border border-gray-100 rounded-xl focus:border-gold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1 text-gold" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-xs px-4 py-2.5 bg-paper/25 border border-gray-100 rounded-xl focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-navy hover:bg-navy-soft text-white font-bold text-xs transition-all shadow-md shadow-navy/10 cursor-pointer"
          >
            Authenticate Token
          </button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-paper border border-gray-100 text-sm text-gray-500 text-center leading-normal">
          <p className="font-semibold text-navy">🔑 Authorized Personnel Only</p>
          If you are an Apollo Auto representative, please authenticate using your assigned credentials. For password assistance, contact system administration directly.
        </div>
      </div>
    );
  }

  return (
    <div id="admin-cms-hub" className="space-y-10 reveal-entry">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-sm uppercase font-bold tracking-widest text-gold text-slate-500">Lot CMS Panel</span>
          <h2 className="font-display font-extrabold text-3xl text-navy">Apollo Management Station</h2>
          <p className="text-xs text-gray-600 leading-normal mt-1">Hello Tim, welcome back. Monitor live financing inquiries and post announcements.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer self-start"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Panel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Announcement */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-navy flex items-center space-x-2">
              <Plus className="w-5 h-5 text-gold" />
              <span>Broadcast Announcement</span>
            </h3>
            <p className="text-xs text-slate-500">Post specials, inventory updates, or announcements to the homepage live feed.</p>
          </div>

          {postSuccess && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-xs text-success font-medium flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Live feed updated successfully! Preview on Homepage.</span>
            </div>
          )}

          <form onSubmit={handlePostAnnouncement} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Headline Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Memorial Day Sale: $500 Off!"
                value={announcementTitle}
                onChange={e => setAnnouncementTitle(e.target.value)}
                className="w-full text-xs px-4 py-2.5 bg-paper/20 border border-gray-100 rounded-xl focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Announcement body text</label>
              <textarea
                required
                placeholder="Details of the special event, required down-payment limits, models featured, etc."
                value={announcementContent}
                onChange={e => setAnnouncementContent(e.target.value)}
                className="w-full text-xs px-4 py-2.5 bg-paper/20 border border-gray-100 rounded-xl focus:border-gold focus:outline-none h-28"
              />
            </div>

            <button
              type="submit"
              disabled={isPosting}
              className="w-full py-2.5 bg-navy hover:bg-navy-soft text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:bg-gray-400"
            >
              {isPosting ? 'Broadcasting...' : 'Publish Announcement Live'}
            </button>
          </form>
        </div>

        {/* Right Column: Leads Database */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <h3 className="font-display font-bold text-lg text-navy flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold" />
                <span>Captured Leads Desk ({localLeads.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Form entries saved directly from the website form.</p>
            </div>
            <button
              onClick={fetchLeads}
              className="text-xs text-gold hover:text-navy font-bold leading-none cursor-pointer"
            >
              Refresh Logs
            </button>
          </div>

          {isLoadingLeads ? (
            <p className="text-xs text-gray-500 italic text-center py-6">Re-fetching leads from disk...</p>
          ) : localLeads.length > 0 ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {localLeads.map((lead) => (
                <div key={lead.id} className="p-4 bg-paper/30 border border-gray-100 rounded-xl space-y-3 shadow-2xs hover:border-navy-soft/25 transition-colors">
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-xs font-extrabold text-navy uppercase tracking-wide">{lead.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center space-x-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(lead.date).toLocaleString()}</span>
                      </p>
                    </div>
                    {/* Tags */}
                    <div className="flex items-center space-x-1 text-[8px] font-mono shrink-0">
                      <span className="bg-navy-soft/10 text-navy-soft px-2 py-0.5 rounded font-bold uppercase flex items-center">
                        <MapPin className="w-2.5 h-2.5 mr-0.5" />
                        {lead.location}
                      </span>
                    </div>
                  </div>

                  {/* Customer context specs */}
                  <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-gray-100 text-sm">
                    <div className="flex items-center space-x-1">
                      <Car className="w-3.5 h-3.5 text-gold" />
                      <div>
                        <span className="text-gray-400">Needs:</span>{' '}
                        <span className="font-semibold text-navy truncate">{lead.carInterest}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Landmark className="w-3.5 h-3.5 text-gold" />
                      <div>
                        <span className="text-gray-400">Credit:</span>{' '}
                        <span className="font-semibold text-navy truncate">{lead.creditStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer message */}
                  <div className="text-xs bg-white p-3 rounded-lg border border-gray-50 italic text-gray-700 leading-normal">
                    “{lead.message}”
                  </div>

                  {/* Direct Dial Action */}
                  <div className="flex items-center justify-between pt-1 text-sm">
                    <span className="text-gray-400">Email: {lead.email}</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="inline-flex items-center space-x-1 font-bold text-gold hover:text-navy"
                    >
                      <span>Dial Customer: {lead.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-paper/10 border border-dashed border-gray-250 rounded-2xl">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-gray-500 font-medium">No leads captured yet!</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                Once standard users submit the contact loan form on the Homepage, they will populate here right away.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
