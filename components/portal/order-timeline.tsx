import { CheckIcon } from "lucide-react";

const ORDER_STEPS = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "materials", label: "Sourcing Materials" },
  { key: "building", label: "Building" },
  { key: "finishing", label: "Finishing" },
  { key: "ready", label: "Ready" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
];

export function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-0">
      {ORDER_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isComplete
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                }`}
              >
                {isComplete ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              {index < ORDER_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-8 ${
                    isComplete ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
            <div className="pb-4">
              <p
                className={`text-sm font-medium ${
                  isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-xs text-primary">Current status</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
