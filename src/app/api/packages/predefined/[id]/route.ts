import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, description, destination, duration, travelStyle, budget, category, imageEmoji, highlights, isActive, sortOrder } = body;

  const pkg = await prisma.predefinedPackage.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(destination !== undefined && { destination }),
      ...(duration !== undefined && { duration: Number(duration) }),
      ...(travelStyle !== undefined && { travelStyle }),
      ...(budget !== undefined && { budget }),
      ...(category !== undefined && { category }),
      ...(imageEmoji !== undefined && { imageEmoji }),
      ...(highlights !== undefined && { highlights: JSON.stringify(highlights) }),
      ...(isActive !== undefined && { isActive }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    },
  });

  return NextResponse.json({ ...pkg, highlights: JSON.parse(pkg.highlights) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.predefinedPackage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
