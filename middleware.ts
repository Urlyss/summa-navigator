import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')
    
    // List of allowed origins
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_MOBILE_APP_URL,
      // Add development Expo URLs
      'exp://',
      'localhost'
    ]

    const isAllowedOrigin = allowedOrigins.some(url => 
        url && referer?.includes(url) || url && origin?.includes(url)
    )

    if (!isAllowedOrigin) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Only during development
          }
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}