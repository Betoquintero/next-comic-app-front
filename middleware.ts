// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');
  
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    // If authenticated, continue
    return NextResponse.next();
  }
  
  // Apply the middleware to specific routes
  export const config = {
    matcher: ['/profile/:path*', '/some-other-protected-route/:path*'],
  };
