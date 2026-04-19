'use client';

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
}

interface Props {
  packages: PredefinedPackage[];
  onSelect: (destination: string) => void;
}

export default function PredefinedPackages({ packages, onSelect }: Props) {
  if (packages.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">🌟 Featured Packages</h2>
        <p className="text-center text-gray-500 mb-8">Curated trips loved by Indian families</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => onSelect(pkg.destination)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{pkg.imageEmoji}</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                    {pkg.category}
                  </span>
                  <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {pkg.duration}d
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">
                {pkg.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {pkg.highlights.slice(0, 3).map((h) => (
                  <span key={h} className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border">
                    {h}
                  </span>
                ))}
              </div>
              <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
                Plan This Trip →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
