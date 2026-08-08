import { messages } from "@workspace/i18n";
import { routing } from "@workspace/i18n/routing";
import { getRequestConfig } from "@workspace/i18n/server";

// Static default — does NOT call headers()/requestLocale so it stays
// compatible with `output: "export"` (static builds for Tauri).
// In dev mode the proxy handles locale detection; at runtime the
// [locale] layout's NextIntlClientProvider supplies the real messages.
export default getRequestConfig(async () => ({
  locale: routing.defaultLocale,
  messages: messages[routing.defaultLocale as keyof typeof messages] ?? {},
}));
