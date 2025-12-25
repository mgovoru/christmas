// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Защищённые префиксы — используем ТОЛЬКО внутри middleware, НЕ в config
const PROTECTED_PATHS = ['/welcome', '/master'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isProtected = PROTECTED_PATHS.some((path) =>
		pathname.startsWith(path)
	);

	if (isProtected) {
		const authCookie = request.cookies.get('auth')?.value;
		if (authCookie !== process.env.AUTH_TOKEN) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}

	return NextResponse.next();
}

// ❗️ matcher должен быть СТАТИЧЕСКИМ
export const config = {
	matcher: [
		'/welcome/:path*',
		'/master/:path*',
	],
};
