import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to /admin/login and /api/admin/* without auth check
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/")
  ) {
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const token = request.cookies.get("admin-session")?.value;
    const expectedToken = process.env.ADMIN_SESSION_TOKEN;

    if (!token || token !== expectedToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};