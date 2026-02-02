import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  label?: string;
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
};

export function PlaceholderImage({
  className,
  aspectRatio = "video",
  label,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "bg-muted/50 border border-border rounded-lg flex flex-col items-center justify-center gap-2",
        aspectRatios[aspectRatio],
        className
      )}
    >
      <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
      {label && (
        <span className="text-sm text-muted-foreground/50">{label}</span>
      )}
    </div>
  );
}
