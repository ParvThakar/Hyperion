import { cn } from "@workspace/ui/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <img
    alt="Hyperion logo"
    className={cn("size-6 object-contain rounded-sm", className)}
    src="/main_logo.png"
  />
);
