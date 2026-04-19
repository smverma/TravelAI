'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import PDFExport from '@/components/PDFExport';
import { Itinerary } from '@/types';

interface SavedPackage {
  id: string;
  name: string;
  destination: string;
  duration: number;
  createdAt: string;
  itinerary: Itinerary;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<SavedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/packages/saved')
      .then((r) => r.json())
      .then((data) => {
        setPackages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this saved trip?')) return;
    setDeleting(id);
    await fetch(`/api/packages/saved/${id}`, { method: 'DELETE' });
    setPackages((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const userRole = (session?.user as { role?: string })?.role;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-6 px-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-extrabold">✈️ TravelAI</Link>
            <p className="text-sm text-white/80 mt-1">My Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">👤 {session?.user?.email}</span>
            {userRole === 'ADMIN' && (
              <Link href="/admin" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                ⚙️ Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📚 My Saved Trips</h2>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold transition-colors text-sm">
            + Plan New Trip
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading your trips...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700">No saved trips yet</h3>
            <p className="text-gray-500 mt-2">Generate an itinerary and save it here!</p>
            <Link href="/" className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === pkg.id ? null : pkg.id)}
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {pkg.destination} &nbsp;·&nbsp; 📅 {pkg.duration} days &nbsp;·&nbsp;
                      🕒 {new Date(pkg.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(pkg.id); }}
                      disabled={deleting === pkg.id}
                      className="text-red-400 hover:text-red-600 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {deleting === pkg.id ? '...' : '🗑️ Delete'}
                    </button>
                    <span className="text-gray-400">{expanded === pkg.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === pkg.id && (
                  <div className="border-t border-gray-100 p-4">
                    <ItineraryDisplay itinerary={pkg.itinerary} />
                    <PDFExport itinerary={pkg.itinerary} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
