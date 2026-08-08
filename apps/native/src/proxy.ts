import createMiddleware from "@workspace/i18n/middleware";
import { routing } from "@workspace/i18n/routing";

// `localePrefix: "as-needed"` hides the default locale (en) from URLs.
// `/workspace` instead of `/en/workspace`. The proxy internally rewrites
// to the `app/[locale]` tree. Since there is only one locale configured,
// the prefix never appears in practice.
const intlMiddleware = createMiddleware({
  ...routing,
  localePrefix: "as-needed",
});

export default function proxy(request: import("next/server").NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for static files and Next.js internals
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
