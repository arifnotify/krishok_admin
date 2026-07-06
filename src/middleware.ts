import { NextResponse } from "next/server";

// middleware.ts
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};