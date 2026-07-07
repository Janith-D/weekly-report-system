import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/manager") && role !== "MANAGER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      path.startsWith("/member") &&
      role !== "TEAM_MEMBER" &&
      role !== "MANAGER" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/member/:path*", "/manager/:path*", "/admin/:path*"],
};
