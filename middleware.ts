import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the origin and referer
  const referer = request.headers.get('referer')
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  // List of allowed origins that don't need API key
  const sameOriginSources = [host]

  // Check if request is from the same origin
  const isSameOrigin = sameOriginSources.some(url => 
    url && (referer?.includes(url) || origin?.includes(url))
  )

  // If it's an API request and not from the same origin, verify API key
  if (request.nextUrl.pathname.startsWith('/api/') && !isSameOrigin) {
    // API Key validation for external requests
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid API Key' }),
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