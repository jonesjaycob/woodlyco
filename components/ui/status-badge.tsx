import { Badge } from "@/components/ui/badge";

const quoteStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  reviewing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  quoted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  expired: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

const orderStatusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  materials: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  building: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  finishing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ready: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const inventoryStatusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  sold: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  reserved: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  draft: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

type StatusBadgeProps = {
  status: string;
  type: "quote" | "order" | "inventory";
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const colorMap =
    type === "quote"
      ? quoteStatusColors
      : type === "order"
        ? orderStatusColors
        : inventoryStatusColors;

  const colorClass = colorMap[status] ?? "bg-gray-100 text-gray-700";

  return (
    <Badge variant="outline" className={`border-0 capitalize ${colorClass}`}>
      {status}
    </Badge>
  );
}
