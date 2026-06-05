import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const accentStripeClasses = {
  none: "",
  pitch: "from-pitch-bright/80",
  gold: "from-gold/80",
  teal: "from-teal/80",
  red: "from-red/80",
} as const

export type CardAccent = keyof typeof accentStripeClasses

const cardVariants = cva(
  "group/card relative flex flex-col overflow-hidden border text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[density=compact]:gap-3 data-[density=compact]:py-3 data-[density=compact]:has-data-[slot=card-footer]:pb-0 data-[density=normal]:gap-4 data-[density=normal]:py-4 data-[density=spacious]:gap-5 data-[density=spacious]:py-5 data-[density=spacious]:has-data-[slot=card-footer]:pb-0 data-[shape=artifact]:rounded-sm data-[shape=soft]:rounded-xl data-[shape=featured]:rounded-[calc(var(--radius-3xl)-1px)] data-[variant=default]:border-border data-[variant=default]:bg-card data-[variant=default]:shadow-card data-[variant=artifact]:border-line-strong data-[variant=artifact]:bg-artifact data-[variant=artifact]:shadow-artifact-inset data-[variant=elevated]:border-line-strong data-[variant=elevated]:bg-artifact-muted data-[variant=elevated]:shadow-card data-[variant=featured]:border-line-strong data-[variant=featured]:bg-artifact data-[variant=featured]:shadow-card",
  {
    variants: {
      density: {
        compact: "",
        normal: "",
        spacious: "",
      },
      shape: {
        artifact: "",
        soft: "",
        featured: "",
      },
      variant: {
        default: "",
        artifact: "",
        elevated: "",
        featured: "",
      },
      interactive: {
        true: "surface-panel-interactive hover:border-pitch-bright/25",
        false: "",
      },
      padding: {
        default: "",
        none: "py-0",
      },
    },
    defaultVariants: {
      density: "normal",
      shape: "soft",
      variant: "default",
      interactive: false,
      padding: "default",
    },
  }
)

function CardAccentStripe({ accent }: { accent: Exclude<CardAccent, "none"> }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b to-transparent opacity-80",
        accentStripeClasses[accent]
      )}
      aria-hidden
    />
  )
}

function Card({
  className,
  size,
  density,
  shape,
  variant = "default",
  accent = "none",
  interactive = false,
  padding = "default",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    size?: "default" | "sm"
    accent?: CardAccent
  }) {
  const resolvedDensity = density ?? (size === "sm" ? "compact" : "normal")
  const resolvedShape =
    shape ?? (variant === "featured" ? "featured" : variant === "artifact" || variant === "elevated" ? "artifact" : "soft")

  const card = (
    <div
      data-slot="card"
      data-density={resolvedDensity}
      data-shape={resolvedShape}
      data-variant={variant}
      className={cn(
        cardVariants({
          density: resolvedDensity,
          shape: resolvedShape,
          variant,
          interactive,
          padding,
        }),
        className
      )}
      {...props}
    >
      {accent !== "none" ? <CardAccentStripe accent={accent} /> : null}
      {children}
    </div>
  )

  if (variant === "featured") {
    return (
      <div className="card-border relative overflow-hidden rounded-3xl p-px">
        {card}
      </div>
    )
  }

  return card
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-4 group-data-[density=compact]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[density=compact]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[density=compact]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[density=compact]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center border-t border-border bg-surface-sunken/40 p-4 group-data-[density=compact]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
