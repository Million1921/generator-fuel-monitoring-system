import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

export default async function middleware(request: NextRequest) {
	let session: unknown = null;
	try {
		const res = await betterFetch<unknown>(
			"/api/auth/get-session",
			{
				baseURL: request.nextUrl.origin,
				headers: {
					cookie: request.headers.get("cookie") || "",
				},
			},
		);
		session = res.data;
	} catch (error) {
		console.error("Middleware Auth Fetch Error:", error);
	}

	if (!session) {
		if (request.nextUrl.pathname.startsWith("/dashboard")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	} else {
		if (request.nextUrl.pathname === "/login") {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/login"],
};
