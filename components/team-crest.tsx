import Image from "next/image";
import { teamImageUrl } from "@/lib/bsd/format";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: { className: "size-4", width: 16, height: 16 },
  sm: { className: "size-5", width: 20, height: 20 },
  md: { className: "size-8", width: 32, height: 32 },
  lg: { className: "size-10", width: 40, height: 40 },
  xl: { className: "size-14", width: 56, height: 56 },
} as const;

type TeamCrestSize = keyof typeof sizeMap;

export function TeamCrest({
  teamId,
  name,
  size = "sm",
  className,
}: {
  teamId?: number | null;
  name?: string;
  size?: TeamCrestSize;
  className?: string;
}) {
  if (teamId == null) {
    return null;
  }

  const dimensions = sizeMap[size];

  return (
    <Image
      src={teamImageUrl(teamId)}
      alt={name ? `${name} crest` : ""}
      width={dimensions.width}
      height={dimensions.height}
      className={cn("shrink-0 object-contain", dimensions.className, className)}
    />
  );
}
