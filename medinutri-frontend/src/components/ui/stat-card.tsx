import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, className = "" }: StatCardProps) {
  return (
    <Card className={`card-hover ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
