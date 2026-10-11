import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang');
  const response = NextResponse.next();

  const validLanguages = ['en', 'hi', 'mr', 'ta', 'te', 'kn', 'bn'];
  if (langParam && validLanguages.includes(langParam)) {
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
