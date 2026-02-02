import { cn } from "@/lib/utils";
import Marking from "./marking";

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
        dark && "bg-secondary/50 text-foreground",
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
  marking?: "left" | "right" | "none";
  markingStroke?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "left",
  marking = "left",
  markingStroke = "currentColor",
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right",
  }[align];

  return (
    <div className={cn("max-w-2xl mb-12", alignClass)}>
      <h2 className="uppercase text-3xl md:text-5xl font-bold relative inline-block">
        {marking === "left" && (
          <span className="absolute -top-6 -left-8 md:-top-8 md:-left-10">
            <Marking orientation="left" stroke={markingStroke} />
          </span>
        )}
        {marking === "right" && (
          <span className="absolute -top-6 -right-8 md:-top-8 md:-right-10">
            <Marking orientation="right" stroke={markingStroke} />
          </span>
        )}
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
