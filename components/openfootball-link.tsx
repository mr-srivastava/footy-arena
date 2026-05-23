import { ExternalLink } from "lucide-react";
import { OPENFOOTBALL_REPO } from "@/lib/openfootball/constants";

export function OpenFootballLink({
  className = "inline-flex items-center gap-1 text-foreground underline decoration-pitch/50 underline-offset-2 transition-colors hover:text-gold",
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={OPENFOOTBALL_REPO}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      openfootball
      {showIcon ? <ExternalLink className="h-3.5 w-3.5" aria-hidden /> : null}
    </a>
  );
}
