import createMiddleware from "@workspace/i18n/middleware";
import { routing } from "@workspace/i18n/routing";

// Tauri static export requires locale prefix always present in URLs (/en/...)
// This middleware handles locale detection and redirect for dev mode.
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: "always",
});

export default function middleware(
  request: import("next/server").NextRequest,
) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for static files and Next.js internals
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
