import { useState, useEffect, useCallback } from "react";

export interface ScheduledReminder {
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  timeoutId?: number;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === "granted") {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, [permission]);

  const scheduleReminder = useCallback(
    (medicationId: string, medicationName: string, dosage: string, time: string) => {
      // Parse the time (HH:MM format)
      const [hours, minutes] = time.split(":").map(Number);

      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const delay = reminderTime.getTime() - now.getTime();

      const timeoutId = window.setTimeout(() => {
        showNotification(`💊 Time for ${medicationName}`, {
          body: `Take your ${dosage} dose now`,
          tag: `medication-${medicationId}`,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          timestamp: Date.now(),
        } as any);

        // Reschedule for tomorrow
        scheduleReminder(medicationId, medicationName, dosage, time);
      }, delay);

      setReminders((prev) => {
        // Remove existing reminder for this medication
        const filtered = prev.filter((r) => r.medicationId !== medicationId);
        return [...filtered, { medicationId, medicationName, dosage, time, timeoutId }];
      });

      return timeoutId;
    },
    [showNotification]
  );

  const cancelReminder = useCallback((medicationId: string) => {
    setReminders((prev) => {
      const reminder = prev.find((r) => r.medicationId === medicationId);
      if (reminder?.timeoutId) {
        clearTimeout(reminder.timeoutId);
      }
      return prev.filter((r) => r.medicationId !== medicationId);
    });
  }, []);

  const cancelAllReminders = useCallback(() => {
    reminders.forEach((r) => {
      if (r.timeoutId) clearTimeout(r.timeoutId);
    });
    setReminders([]);
  }, [reminders]);

  return {
    permission,
    requestPermission,
    showNotification,
    scheduleReminder,
    cancelReminder,
    cancelAllReminders,
    reminders,
    isSupported: "Notification" in window,
  };
}
