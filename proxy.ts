import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect all requests to the home page except:
 * - the home page itself
 * - Next.js internals (`/_next`)
 * - API routes (`/api`)
 * - static files (have a file extension)
 * - common root files like `/favicon.ico`, `/robots.txt`, `/sitemap.xml`
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow root
  if (pathname === "/") return NextResponse.next();

  // Allow Next internals and API
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // Allow common root files
  if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // not found, but has an extension - allow (could be a static file)
  

  // Allow requests for files (have an extension)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();

  // Otherwise redirect to home
  const url = req.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  // run on all paths
  matcher: "/:path*",
};
