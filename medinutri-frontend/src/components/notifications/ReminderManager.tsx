import { useEffect } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

export function ReminderManager() {
  const { userMedications, reminderSettings, toggleReminder, setRemindersEnabled } = useApp();
  const { t } = useLanguage();
  const {
    permission,
    requestPermission,
    scheduleReminder,
    cancelReminder,
    reminders,
    isSupported
  } = useNotifications();
  const { toast } = useToast();

  // Schedule reminders when medications or settings change
  useEffect(() => {
    if (permission !== "granted" || !reminderSettings.enabled) return;

    userMedications.forEach((med) => {
      const isEnabled = reminderSettings.medications[med.id];
      if (isEnabled) {
        scheduleReminder(med.id, med.name, med.dosage, med.time);
      } else {
        cancelReminder(med.id);
      }
    });
  }, [userMedications, reminderSettings, permission, scheduleReminder, cancelReminder]);

  const handleEnableReminders = async () => {
    const granted = await requestPermission();
    if (granted) {
      setRemindersEnabled(true);
      toast({
        title: t.reminders.remindersEnabled,
        description: t.reminders.remindersEnabledDesc,
      });
    } else {
      toast({
        title: t.reminders.permissionDenied,
        description: t.reminders.permissionDeniedDesc,
        variant: "destructive",
      });
    }
  };

  const handleToggleReminder = (medId: string, medName: string) => {
    toggleReminder(medId);
    const isNowEnabled = !reminderSettings.medications[medId];
    toast({
      title: isNowEnabled ? t.reminders.reminderSet : t.reminders.reminderCancelled,
      description: isNowEnabled
        ? `${t.reminders.youllBeReminded} ${medName}`
        : t.reminders.reminderForCancelled.replace("{name}", medName),
    });
  };

  if (!isSupported) {
    return (
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
        <CardContent className="p-4 flex items-center gap-3">
          <BellOff className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {t.reminders.browserNotSupported}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (permission !== "granted" || !reminderSettings.enabled) {
    return (
      <Card className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-blue-500/10 backdrop-blur-3xl border-white/10 shadow-3xl overflow-hidden group">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-2xl group-hover:scale-110 transition-transform">
              <Bell className="h-8 w-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-black text-2xl text-white tracking-tight">{t.reminders.enableReminders}</h3>
              <p className="font-bold text-slate-300">
                Receive high-priority alerts exactly when it's time to take your dose.
              </p>
            </div>
            <Button
              onClick={handleEnableReminders}
              className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-white/5"
            >
              <BellRing className="mr-2 h-5 w-5" />
              Start Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userMedications.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-[2.5rem] bg-slate-950/40 backdrop-blur-2xl border-white/10 shadow-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
              <BellRing className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white tracking-tight">Alert Control Center</h3>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{reminders.length} Active Schedules</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 pr-4 rounded-3xl border border-white/5">
            <Switch
              checked={reminderSettings.enabled}
              onCheckedChange={setRemindersEnabled}
              className="scale-110"
            />
            <span className="text-xs font-black text-white uppercase tracking-tighter">Master Control</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userMedications.map((med) => {
            const isEnabled = reminderSettings.medications[med.id];
            const activeReminder = reminders.find((r) => r.medicationId === med.id);

            return (
              <div
                key={med.id}
                className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${isEnabled
                    ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                    : "bg-white/5 border-white/5 opacity-60"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleToggleReminder(med.id, med.name)}
                    className="scale-90"
                  />
                  <div>
                    <p className="font-black text-white leading-none mb-1">{med.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {med.dosage} • {med.time}
                    </p>
                  </div>
                </div>
                {activeReminder && isEnabled && (
                  <div className="h-10 px-4 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-2 border border-emerald-500/20 animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-tighter">Live Alert</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}