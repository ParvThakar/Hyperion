import { redirect } from "next/navigation";

// Root page — redirects to the app's entry point.
// With localePrefix: "as-needed", the default locale (en)
// is invisible in the URL so we redirect straight to /.
export default function RootPage() {
  redirect("/workspace");
}
