import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang');
  const response = NextResponse.next();

  if (langParam && (langParam === 'en' || langParam === 'hi')) {
    response.cookies.set('kaushalyuva-lang', langParam, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
    response.headers.set('x-lang', langParam);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
