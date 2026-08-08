import { messages } from "@workspace/i18n";
import { routing } from "@workspace/i18n/routing";
import { getRequestConfig } from "@workspace/i18n/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate locale, fall back to default
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages] ?? {},
  };
});
