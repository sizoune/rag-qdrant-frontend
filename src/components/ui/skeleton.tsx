import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      // ponytail: dark --muted == --card, so override to a visible tone in dark
      className={cn("animate-pulse rounded-md bg-muted dark:bg-foreground/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
