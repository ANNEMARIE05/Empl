import { cn } from "@/lib/utils";

function Squelette({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--rayon-md)] bg-[var(--surface-mute)]/80",
        className,
      )}
      {...props}
    />
  );
}

export { Squelette };
