import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const packages = await prisma.savedPackage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(packages.map((p) => ({
    ...p,
    formData: JSON.parse(p.formData),
    itinerary: JSON.parse(p.itinerary),
  })));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, destination, duration, formData, itinerary } = await request.json();

  if (!name || !destination || !formData || !itinerary) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const saved = await prisma.savedPackage.create({
    data: {
      userId: session.user.id,
      name,
      destination,
      duration: Number(duration) || 1,
      formData: JSON.stringify(formData),
      itinerary: JSON.stringify(itinerary),
    },
  });

  return NextResponse.json({ ...saved, formData, itinerary }, { status: 201 });
}
