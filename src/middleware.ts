import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(
  req: NextRequest,
) {
  const token =
    req.cookies.get("token");

  const isLoginPage =
    req.nextUrl.pathname === "/login";

  // no token
  if (!token && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  // already logged in
  if (token && isLoginPage) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/orders/:path*",
    "/users/:path*",
    "/banners/:path*",
    "/locations/:path*",
    "/login",
  ],
};