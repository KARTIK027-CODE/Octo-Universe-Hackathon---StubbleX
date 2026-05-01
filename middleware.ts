import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authRole = request.cookies.get('auth_role')?.value
    const { pathname, searchParams } = request.nextUrl

    // 1. Protected Routes: /dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!authRole) {
            // Not Logged In -> Redirect to Login
            // If they were trying to access a specific role dashboard, pass that as a query param
            const role = pathname.includes('farmer') ? 'farmer' : pathname.includes('buyer') ? 'buyer' : searchParams.get('role');

            const url = new URL('/login', request.url)
            if (role) {
                url.searchParams.set('role', role)
            }
            return NextResponse.redirect(url)
        }
    }

    // 2. Auth Routes: /login
    if (pathname.startsWith('/login')) {
        if (authRole) {
            // Already Logged In -> Redirect to Dashboard
            // If the user has a specific role, send them there
            return NextResponse.redirect(new URL(`/dashboard/${authRole}`, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}
