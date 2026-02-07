export function proxy() {
  // const { pathname } = req.nextUrl;
  // // Allow root
  // if (pathname === "/") return NextResponse.next();
  // // Allow Next internals and API
  // if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/static")) {
  //   return NextResponse.next();
  // }
  // // Allow common root files
  // if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
  //   return NextResponse.next();
  // }
  // // not found, but has an extension - allow (could be a static file)
  // // Allow requests for files (have an extension)
  // if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();
  // // Otherwise redirect to home
  // const url = req.nextUrl.clone();
  // url.pathname = "/";
  // return NextResponse.redirect(url);
}

export const config = {
  // run on all paths
  matcher: "/:path*",
};
