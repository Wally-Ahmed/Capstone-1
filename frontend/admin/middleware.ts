import { NextResponse } from 'next/server';

export function middleware(request) {
    const response = NextResponse.next();

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
}

export const config = {
    matcher: '/', // Apply this middleware to all routes
};
