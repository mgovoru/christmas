// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const { user, pass } = await request.json();

	const valid =
		user === process.env.AUTHORIZED_USER &&
		pass === process.env.AUTHORIZED_PASSWORD;

	if (valid) {
		const response = NextResponse.json({ success: true });
		response.cookies.set('auth', process.env.AUTH_TOKEN!, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60,
			path: '/', // ← обязательно!
		});
		return response;
	}

	return NextResponse.json({ error: 'Invalid' }, { status: 401 });
}
