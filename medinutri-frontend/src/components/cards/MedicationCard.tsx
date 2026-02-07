import { Pill, Clock, Trash2, Bell, BellOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Medication } from "@/data/medications";
import { useApp } from "@/context/AppContext";

interface MedicationCardProps {
  medication: Medication;
  onRemove?: (id: string) => void;
  showRemove?: boolean;
}

export function MedicationCard({ medication, onRemove, showRemove = true }: MedicationCardProps) {
  const { reminderSettings } = useApp();
  const isReminderEnabled = reminderSettings.enabled && reminderSettings.medications[medication.id];

  return (
    <Card className="rounded-[2.5rem] bg-slate-900/50 backdrop-blur-xl border-white/10 hover:border-primary/50 transition-all overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-xl shadow-primary/5">
              <Pill className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-2xl text-white tracking-tight leading-none mb-1">{medication.name}</h3>
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">{medication.dosage}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Badge variant="secondary" className="gap-1.5 h-7 rounded-full px-4 bg-slate-800 text-white font-bold text-xs ring-1 ring-white/10">
                  <Clock className="h-3 w-3 text-primary" />
                  {medication.time}
                </Badge>
                <Badge variant="outline" className="h-7 rounded-full px-4 border-white/10 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                  {medication.frequency}
                </Badge>
              </div>

              {/* Reminder Status Badge */}
              <div className="flex items-center gap-2 mt-4">
                {isReminderEnabled ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-full px-4 py-1 h-8 font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 gap-2">
                    <Bell className="h-3 w-3 animate-pulse" />
                    Alert Active at {medication.time}
                  </Badge>
                ) : (
                  <Badge className="bg-slate-800/50 text-slate-500 rounded-full px-4 py-1 h-8 font-black text-[10px] uppercase tracking-widest border border-white/5 gap-2">
                    <BellOff className="h-3 w-3" />
                    Alerts Disabled
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
              onClick={() => onRemove(medication.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
