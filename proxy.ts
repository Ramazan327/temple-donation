import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  const isAuthorized = token === process.env.ADMIN_SECRET;

  if (isLoginPage && isAuthorized) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isAdminPage && !isLoginPage && !isAuthorized) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};