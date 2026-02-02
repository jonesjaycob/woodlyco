interface MarkingProps {
  width?: string | number;
  height?: string | number;
  stroke?: string;
  orientation?: "top" | "bottom" | "left" | "right";
}

export default function Marking({
  width = 70,
  height = 59,
  stroke = "black",
  orientation = "top",
}: MarkingProps) {
  let rotation = 0;
  switch (orientation) {
    case "bottom":
      rotation = 180;
      break;
    case "right":
      rotation = 90;
      break;
    case "left":
      rotation = 270;
      break;
    default:
      rotation = 0;
  }

  // Swap width/height for left/right orientations to maintain aspect ratio
  const effectiveWidth =
    orientation === "left" || orientation === "right" ? height : width;
  const effectiveHeight =
    orientation === "left" || orientation === "right" ? width : height;

  return (
    <svg
      width={effectiveWidth}
      height={effectiveHeight}
      viewBox="0 0 70 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`rotate(${rotation} 35 29.5)`}>
        <path
          d="M0 6.87787H34.75H69.5M27 13.3779L34.5 6.87787M42 0.377869L34.5 6.87787M34.5 6.87787V58.3779"
          stroke={stroke}
        />
      </g>
    </svg>
  );
}
