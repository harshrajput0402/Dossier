// Destination: middleware.ts  (project root, next to package.json)

export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/settings/:path*"],
};