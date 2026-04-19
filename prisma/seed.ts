import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@travelai.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@travelai.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('Admin user:', admin.email);

  const count = await prisma.predefinedPackage.count();
  if (count === 0) {
    await prisma.predefinedPackage.createMany({
      data: [
        {
          title: 'Spiritual Varanasi',
          description: 'Experience the spiritual heart of India with ghats, temples, and Ganga Aarti',
          destination: 'Varanasi',
          duration: 3,
          travelStyle: 'relaxed',
          budget: 'budget',
          category: 'religious',
          imageEmoji: '🛕',
          highlights: JSON.stringify(['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Boat ride on Ganga', 'Sarnath']),
          isActive: true,
          sortOrder: 1,
        },
        {
          title: 'Royal Rajasthan',
          description: 'Explore the land of kings — forts, palaces, deserts, and vibrant culture',
          destination: 'Rajasthan',
          duration: 7,
          travelStyle: 'balanced',
          budget: 'mid-range',
          category: 'historical',
          imageEmoji: '🏰',
          highlights: JSON.stringify(['Jaipur City Palace', 'Mehrangarh Fort', 'Jaisalmer Desert', 'Lake Pichola Udaipur']),
          isActive: true,
          sortOrder: 2,
        },
        {
          title: 'Goa Beach Escape',
          description: "Sun, sand, seafood, and laid-back vibes on India's most popular coast",
          destination: 'Goa',
          duration: 5,
          travelStyle: 'relaxed',
          budget: 'mid-range',
          category: 'beaches',
          imageEmoji: '🏖️',
          highlights: JSON.stringify(['Baga Beach', 'Dudhsagar Falls', 'Old Goa Churches', 'Anjuna Flea Market']),
          isActive: true,
          sortOrder: 3,
        },
        {
          title: 'Manali Mountain Magic',
          description: 'Snow-capped peaks, adventure sports, and breathtaking Himalayan landscapes',
          destination: 'Manali',
          duration: 5,
          travelStyle: 'fast-paced',
          budget: 'mid-range',
          category: 'mountains',
          imageEmoji: '🏔️',
          highlights: JSON.stringify(['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali']),
          isActive: true,
          sortOrder: 4,
        },
        {
          title: 'Mumbai City Explorer',
          description: "Dive into India's financial capital — Bollywood, street food, and colonial heritage",
          destination: 'Mumbai',
          duration: 4,
          travelStyle: 'fast-paced',
          budget: 'mid-range',
          category: 'cities',
          imageEmoji: '🌆',
          highlights: JSON.stringify(['Gateway of India', 'Marine Drive', 'Dharavi', 'Elephanta Caves']),
          isActive: true,
          sortOrder: 5,
        },
      ],
    });
    console.log('Seeded 5 predefined packages');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
