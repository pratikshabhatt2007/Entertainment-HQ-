import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../api/events';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Copy,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  Tag,
  MapPin,
  Clock,
  Sparkles,
  Music2,
  Sliders,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';

const CATEGORIES = ['Music', 'Stand-up', 'Movies', 'Technology', 'Business', 'Workshop', 'Social', 'General'];

export default function AdminEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    singer_name: '',
    description: '',
    category: 'Music',
    event_date: '',
    event_time: '19:00',
    location: '',
    city: 'Mumbai',
    price: '₹1,499 onwards',
    capacity: 5000,
    image_url: '',
  });

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching admin events:', err);
      setError(err.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setFormData({
      title: '',
      singer_name: '',
      description: '',
      category: 'Music',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '19:00',
      location: '',
      city: 'Mumbai',
      price: '₹1,499 onwards',
      capacity: 5000,
      image_url: '',
    });
    setShowModal(true);
  };

  const openEditModal = (ev) => {
    setIsEditing(true);
    setCurrentEventId(ev.id);
    setFormData({
      title: ev.title || '',
      singer_name: ev.singer_name || ev.organizer || '',
      description: ev.description || '',
      category: ev.category || 'Music',
      event_date: ev.event_date ? ev.event_date.split('T')[0] : '',
      event_time: ev.event_time || '19:00',
      location: ev.location || '',
      city: ev.city || 'Mumbai',
      price: ev.price || '₹1,499 onwards',
      capacity: ev.capacity || 5000,
      image_url: ev.image_url || '',
    });
    setShowModal(true);
  };

  // 1-Click Duplicate Event Action
  const handleDuplicate = async (ev) => {
    try {
      const duplicateData = {
        title: `${ev.title} (Copy)`,
        singer_name: ev.singer_name || ev.organizer || '',
        description: ev.description || '',
        category: ev.category || 'Music',
        event_date: ev.event_date ? ev.event_date.split('T')[0] : new Date().toISOString().split('T')[0],
        event_time: ev.event_time || '19:00',
        location: ev.location || '',
        city: ev.city || 'Mumbai',
        price: ev.price || '₹1,499 onwards',
        capacity: ev.capacity || 5000,
        image_url: ev.image_url || '',
      };

      await createEvent(duplicateData, token);
      setToast({ type: 'success', message: `Duplicated "${ev.title}" successfully!` });
      loadEvents();
    } catch (err) {
      console.error('Duplicate Event Error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to duplicate event.' });
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;

    try {
      await deleteEvent(eventId, token);
      setToast({ type: 'success', message: `Event "${eventTitle}" deleted successfully.` });
      loadEvents();
    } catch (err) {
      console.error('Delete event error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to delete event.' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    try {
      if (isEditing) {
        await updateEvent(currentEventId, formData, token);
        setToast({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await createEvent(formData, token);
        setToast({ type: 'success', message: 'Event created successfully!' });
      }

      setShowModal(false);
      loadEvents();
    } catch (err) {
      console.error('Save event error:', err);
      setToast({ type: 'error', message: err.message || 'Failed to save event.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      (ev.title || '').toLowerCase().includes(search.toLowerCase().trim()) ||
      (ev.location || '').toLowerCase().includes(search.toLowerCase().trim()) ||
      (ev.city || '').toLowerCase().includes(search.toLowerCase().trim());

    const matchesCat = selectedCategory === 'All' || ev.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs font-bold uppercase tracking-wider opacity-80 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-[#13101E] to-stone-950 border border-stone-800 dark:border-yellow-900/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" /> Backstage Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Manage Concert Events</span>
            </h1>
            <p className="text-stone-400 text-sm max-w-xl">
              Create, edit, duplicate, and control live concert listings, ticket pricing, and attendee rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-gold text-stone-950 font-black text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, venue or city..."
            className="w-full pl-11 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white placeholder-stone-500 text-xs focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-yellow-500 text-stone-950 shadow-md shadow-yellow-500/20'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Events Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          <p className="text-sm font-medium">Loading concert listings...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center max-w-md mx-auto">
          <p>{error}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-stone-900/40 border border-stone-800/80 rounded-3xl p-8 shadow-xl">
          <div className="p-4 rounded-2xl bg-stone-800/80 text-stone-500 inline-block border border-stone-700/50">
            <Calendar className="w-10 h-10 text-yellow-500/60" />
          </div>
          <h3 className="text-xl font-bold text-white">No matching events</h3>
          <p className="text-sm text-stone-400 leading-relaxed">
            No events matched your search filter "{search}". Try searching by another keyword.
          </p>
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 border-b border-stone-800 text-[10px] uppercase tracking-wider font-black text-stone-400">
                <tr>
                  <th className="px-6 py-4">Concert Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-center">Capacity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-stone-800/50 transition-colors group">
                    {/* Concert Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform shrink-0">
                          <Music2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm line-clamp-1 group-hover:text-yellow-400 transition-colors">
                            {ev.title}
                          </p>
                          <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-yellow-400 shrink-0" />
                            <span className="truncate">{ev.location || 'Stadium Venue'}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-950 border border-stone-800 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        {ev.category || 'Music'}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 text-stone-300">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                          <span>{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'TBA'}</span>
                        </p>
                        {ev.event_time && (
                          <p className="text-[10px] text-stone-400 flex items-center gap-1 pl-5">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>{ev.event_time}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-stone-200 font-mono font-bold bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
                        <Users className="w-3.5 h-3.5 text-yellow-400" />
                        {(ev.capacity || 0).toLocaleString()} Seats
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Attendee Roster Button */}
                        <Link
                          to={`/admin/events/${ev.id}/attendees`}
                          className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors"
                          title="Inspect Attendee Roster"
                        >
                          <Users className="w-4 h-4" />
                        </Link>

                        {/* Duplicate Button */}
                        <button
                          onClick={() => handleDuplicate(ev)}
                          className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="1-Click Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(ev)}
                          className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-yellow-400 transition-colors cursor-pointer"
                          title="Edit Show"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(ev.id, ev.title)}
                          className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Show"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Event Studio Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Concert Listing' : 'Create New Concert Show'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Concert Show Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Diljit Dosanjh AURA Mumbai Stadium Night"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Artist / Singer Name</label>
                  <input
                    type="text"
                    value={formData.singer_name}
                    onChange={(e) => setFormData({ ...formData, singer_name: e.target.value })}
                    placeholder="e.g. Diljit Dosanjh"
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="19:00 PM"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Venue Address</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. DY Patil Stadium, Navi Mumbai"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Concert highlight details..."
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-2xl text-white focus:outline-none focus:border-yellow-500 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl bg-stone-800 text-stone-300 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl btn-gold text-stone-950 font-black flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Publish Concert'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
