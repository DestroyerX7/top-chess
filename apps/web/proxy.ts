import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (jwt === undefined) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyJwt<{ admin: boolean }>(jwt);

  if (payload === null || !payload.admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
