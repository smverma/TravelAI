import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login?callbackUrl=/dashboard', req.url));
  }

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=/admin', req.url));
    }
    const role = (req.auth?.user as { role?: string })?.role;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
