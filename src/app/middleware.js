import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import * as cookie from 'cookie';
import UnsupportedProtocolError from '../errors/UnsupportedProtocolError'; // Import your custom error

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const publicPaths = ['/signin', '/signup'];

// Function to validate the protocol of the request URL
function validateProtocol(url) {
  const supportedProtocols = ['http', 'https']; // Add supported protocols here
  const protocol = new URL(url).protocol.replace(':', '');

  if (!supportedProtocols.includes(protocol)) {
    throw new UnsupportedProtocolError(`Unsupported protocol: ${protocol}`);
  }
}

export async function middleware(req) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  let userDetails = null;
  let isAuthenticated = false;

  console.log(cookies.token);
  
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

  // Validate the protocol of the incoming request
  try {
    validateProtocol(req.url);
  } catch (error) {
    if (error instanceof UnsupportedProtocolError) {
      console.error("Protocol Error:", error.message);
      return NextResponse.redirect(new URL('/error', req.url)); // Redirect to an error page or handle accordingly
    }
    // Handle any other errors if necessary
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
