import Marking from "./marking";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="uppercase text-4xl md:text-6xl font-bold relative">
          <span className="absolute -top-8 -left-8">
            <Marking orientation="left" stroke="white" />
          </span>
          {title}
          {subtitle && (
            <>
              <br />
              <span className="text-sm font-normal tracking-wide">
                {subtitle}
              </span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
