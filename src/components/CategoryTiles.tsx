'use client';

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  destinations: string[];
  description: string;
}

const categories: Category[] = [
  {
    id: 'religious',
    name: 'Religious',
    emoji: '🛕',
    color: 'from-orange-400 to-amber-500',
    destinations: ['Ayodhya', 'Varanasi', 'Tirupati', 'Mathura', 'Shirdi'],
    description: 'Sacred temples & pilgrimages',
  },
  {
    id: 'historical',
    name: 'Historical',
    emoji: '🏛️',
    color: 'from-amber-600 to-yellow-500',
    destinations: ['Rajasthan', 'Hampi', 'Agra', 'Mahabalipuram', 'Ajanta Caves'],
    description: 'Ancient wonders & heritage sites',
  },
  {
    id: 'beaches',
    name: 'Beaches',
    emoji: '🏖️',
    color: 'from-teal-400 to-cyan-500',
    destinations: ['Goa', 'Andaman & Nicobar', 'Kerala Backwaters', 'Pondicherry', 'Lakshadweep'],
    description: 'Sun, sand & coastal beauty',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    emoji: '🏔️',
    color: 'from-blue-500 to-indigo-600',
    destinations: ['Shimla', 'Manali', 'Sikkim', 'Darjeeling', 'Ladakh'],
    description: 'Peaks, valleys & hill stations',
  },
  {
    id: 'cities',
    name: 'Cities',
    emoji: '🌆',
    color: 'from-purple-500 to-pink-500',
    destinations: ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai'],
    description: 'Urban culture & experiences',
  },
];

interface CategoryTilesProps {
  onSelectDestination: (destination: string) => void;
}

export default function CategoryTiles({ onSelectDestination }: CategoryTilesProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Explore India By Category
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Click a category to discover destinations and start planning
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${category.color} p-6 h-full min-h-[160px] flex flex-col items-center justify-center text-white`}>
                <span className="text-4xl mb-2">{category.emoji}</span>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-xs text-white/80 text-center mt-1">{category.description}</p>
              </div>

              {/* Hover overlay with destinations */}
              <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-3">
                <p className="text-white text-xs font-semibold mb-2 text-center uppercase tracking-wide">
                  Popular Destinations
                </p>
                <div className="flex flex-col gap-1">
                  {category.destinations.map((dest) => (
                    <button
                      key={dest}
                      onClick={() => onSelectDestination(dest)}
                      className="text-white text-xs py-1 px-2 rounded-lg bg-white/20 hover:bg-white/40 transition-colors text-center truncate"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
