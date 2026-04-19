import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const packages = await prisma.predefinedPackage.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(packages.map((p) => ({
    ...p,
    highlights: JSON.parse(p.highlights),
  })));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, destination, duration, travelStyle, budget, category, imageEmoji, highlights, isActive, sortOrder } = body;

  if (!title || !description || !destination || !duration || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const pkg = await prisma.predefinedPackage.create({
    data: {
      title,
      description,
      destination,
      duration: Number(duration),
      travelStyle: travelStyle || 'balanced',
      budget: budget || 'mid-range',
      category,
      imageEmoji: imageEmoji || '✈️',
      highlights: JSON.stringify(highlights || []),
      isActive: isActive !== false,
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json({ ...pkg, highlights: JSON.parse(pkg.highlights) }, { status: 201 });
}
