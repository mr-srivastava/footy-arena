import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DiscoveryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card interactive className="h-full">
        <CardHeader>
          <CardTitle className="font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
            {title.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
        <CardFooter className="border-0 bg-transparent pt-0">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
            Explore
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
