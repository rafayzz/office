import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefixes = ['/admin', '/employee'];

export function middleware(request: NextRequest) {
  const authMode = process.env.OFFICEOS_AUTH_MODE || 'mock';

  if (authMode !== 'firebase') {
    return NextResponse.next();
  }

  const session = request.cookies.get(process.env.SESSION_COOKIE_NAME || 'officeos_session')?.value;
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*']
};
