import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import * as cookie from 'cookie';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const publicPaths = ['/signin', '/signup'];

export async function middleware(req) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  console.log('Request URL:', req.nextUrl.pathname);
  console.log('Cookies:', cookies);

  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  let userDetails = null;
  let isAuthenticated = false;

  if (cookies.token) {
    try {
      await jwtVerify(cookies.token, JWT_SECRET);
      userDetails = cookies.userDetails ? decodeURIComponent(cookies.userDetails) : null;

      if (userDetails) {
        userDetails = JSON.parse(userDetails);
        console.log('User Details:', userDetails);
      }

      isAuthenticated = true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  // Prioritize redirecting authenticated users from public paths to the dashboard
  if (isAuthenticated && ['/signin', '/signup', '/'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow unauthenticated access to public paths
  if (isPublicPath && !isAuthenticated) {
    return NextResponse.next();
  }

  // Redirect to the login page if unauthenticated and accessing a protected route
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
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
