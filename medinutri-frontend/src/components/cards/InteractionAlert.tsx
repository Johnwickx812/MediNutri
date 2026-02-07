import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FoodDrugInteraction, InteractionSeverity } from "@/data/interactions";

interface InteractionAlertProps {
  interaction: FoodDrugInteraction;
}

const severityConfig: Record<
  InteractionSeverity,
  { icon: typeof AlertTriangle; className: string; label: string; bgClass: string }
> = {
  danger: {
    icon: XCircle,
    className: "text-red-600 dark:text-red-400",
    label: "Avoid",
    bgClass: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
  },
  caution: {
    icon: AlertTriangle,
    className: "text-amber-600 dark:text-amber-400",
    label: "Caution",
    bgClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900",
  },
  safe: {
    icon: CheckCircle,
    className: "text-green-600 dark:text-green-400",
    label: "Safe",
    bgClass: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900",
  },
};

export function InteractionAlert({ interaction }: InteractionAlertProps) {
  const config = severityConfig[interaction.severity];
  const Icon = config.icon;

  return (
    <Card className={`border-2 ${config.bgClass} animate-fade-up`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={`shrink-0 ${config.className}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  interaction.severity === "danger"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    : interaction.severity === "caution"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                }`}
              >
                {config.label}
              </span>
            </div>
            <h3 className="font-semibold text-lg">
              {interaction.medicationName} + {interaction.foodName}
            </h3>
            <p className="text-muted-foreground">{interaction.reason}</p>
            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-background/50">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{interaction.recommendation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
