'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface PredefinedPackage {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  travelStyle: string;
  budget: string;
  category: string;
  imageEmoji: string;
  highlights: string[];
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = {
  title: '',
  description: '',
  destination: '',
  duration: 3,
  travelStyle: 'balanced',
  budget: 'mid-range',
  category: 'cities',
  imageEmoji: '✈️',
  highlights: '',
  isActive: true,
  sortOrder: 0,
};

export default function AdminPage() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<PredefinedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPackages = async () => {
    const res = await fetch('/api/packages/predefined');
    const data = await res.json();
    setPackages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchPackages(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (pkg: PredefinedPackage) => {
    setForm({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination,
      duration: pkg.duration,
      travelStyle: pkg.travelStyle,
      budget: pkg.budget,
      category: pkg.category,
      imageEmoji: pkg.imageEmoji,
      highlights: pkg.highlights.join(', '),
      isActive: pkg.isActive,
      sortOrder: pkg.sortOrder,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const body = {
      ...form,
      highlights: form.highlights.split(',').map((h) => h.trim()).filter(Boolean),
    };

    const url = editingId ? `/api/packages/predefined/${editingId}` : '/api/packages/predefined';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage(editingId ? 'Package updated!' : 'Package created!');
      setShowForm(false);
      fetchPackages();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    await fetch(`/api/packages/predefined/${id}`, { method: 'DELETE' });
    fetchPackages();
  };

  const toggleActive = async (pkg: PredefinedPackage) => {
    await fetch(`/api/packages/predefined/${pkg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !pkg.isActive }),
    });
    fetchPackages();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-extrabold">✈️ TravelAI</Link>
            <p className="text-sm text-white/80 mt-1">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">⚙️ {session?.user?.email}</span>
            <Link href="/dashboard" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📦 Predefined Packages</h2>
          <button
            onClick={openNew}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold transition-colors"
          >
            + Add Package
          </button>
        </div>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm">
            {message}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Package' : 'New Package'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
                    <input required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (days)</label>
                    <input type="number" min="1" required value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 1 })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400">
                      <option value="religious">🛕 Religious</option>
                      <option value="historical">🏛️ Historical</option>
                      <option value="beaches">🏖️ Beaches</option>
                      <option value="mountains">🏔️ Mountains</option>
                      <option value="cities">🌆 Cities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Style</label>
                    <select value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400">
                      <option value="relaxed">Relaxed</option>
                      <option value="balanced">Balanced</option>
                      <option value="fast-paced">Fast-paced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Budget</label>
                    <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400">
                      <option value="budget">Budget</option>
                      <option value="mid-range">Mid-range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji Icon</label>
                    <input value={form.imageEmoji} onChange={(e) => setForm({ ...form, imageEmoji: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Highlights (comma-separated)</label>
                    <input value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                      placeholder="e.g., Gateway of India, Marine Drive"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Active (visible on landing page)</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                    {saving ? 'Saving...' : editingId ? 'Update Package' : 'Create Package'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Package</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{pkg.imageEmoji} {pkg.title}</div>
                      <div className="text-gray-500 text-xs truncate max-w-xs">{pkg.destination}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell capitalize">{pkg.category}</td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{pkg.duration}d</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(pkg)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {pkg.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(pkg)}
                          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 text-xs font-semibold transition-colors">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(pkg.id)}
                          className="text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 text-xs font-semibold transition-colors">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No packages yet. Click &quot;+ Add Package&quot; to create one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
