import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
  dark?: boolean;
  id?: string;
}

export function Section({
  children,
  className,
  container = true,
  dark = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        dark && "bg-white text-black",
        className
      )}
    >
      {container ? (
        <div className="container mx-auto px-4 md:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center" | "right";
  markingPosition?: "left" | "right" | "none";
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "left",
  markingPosition = "none",
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right",
  }[align];

  return (
    <div className={cn("max-w-2xl mb-12", alignClass)}>
      <h2 className="uppercase text-3xl md:text-5xl font-bold relative">
        {title}
        {subtitle && (
          <>
            <br />
            <span className="text-sm font-normal tracking-wide">{subtitle}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
