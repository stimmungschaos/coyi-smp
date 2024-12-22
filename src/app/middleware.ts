import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';


const PUBLIC_PATHS = [
  '/api/whitelist/auth',
  '/api/grieflist/auth',
  '/api/grieflist/login',
  '/api/minecraft',
  '/api/status',
  '/api/list'
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');


  if (request.method === 'OPTIONS') {
    return response;
  }

  const path = request.nextUrl.pathname;

  if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
    return response;
  }


  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'Nicht autorisiert' },
      { status: 401 }
    );
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string };
 
    if (path.includes('/admin') && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Ungültiger Token' },
      { status: 401 }
    );
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*']
}; 