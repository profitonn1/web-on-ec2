import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as cookie from 'cookie';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const publicPaths = ['/signin', '/signup'];

export async function middleware(req) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  let userDetails = null;
  let isAuthenticated = false;

  console.log(cookie.token)
  // Check for the token in cookies
  if (cookies.token) {
    try {
      const { payload } = await jwtVerify(cookies.token, JWT_SECRET);
      userDetails = cookies.userDetails ? JSON.parse(decodeURIComponent(cookies.userDetails)) : null;
      isAuthenticated = true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  // Redirect authenticated users to the dashboard
  if (isAuthenticated && publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to sign in
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to specified routes
export const config = {
  matcher: [
    '/dashboard',
    '/profile',
    '/bstartgame',
    '/autopairing',
    '/bchallenge1',
    '/signin',
    '/signup',
  ],
};
