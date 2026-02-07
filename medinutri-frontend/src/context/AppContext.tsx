import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Medication } from "@/data/medications";
import { Food } from "@/data/foods";
import { useNotifications } from "@/hooks/useNotifications";

interface MealEntry {
  id: string;
  food: Food;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  timestamp: number;
}

interface ReminderSettings {
  enabled: boolean;
  medications: Record<string, boolean>;
}

interface AppContextType {
  // Medications
  userMedications: Medication[];
  addMedication: (medication: Medication) => void;
  removeMedication: (id: string) => void;

  // Meals
  mealLog: MealEntry[];
  addMeal: (food: Food, mealType: MealEntry["mealType"]) => void;
  removeMeal: (id: string) => void;
  getTodaysMeals: () => MealEntry[];

  // Stats
  getTodaysCalories: () => number;
  getTodaysProtein: () => number;

  // History Management
  hasOldData: boolean;
  clearOldData: () => void;

  // Reminders
  reminderSettings: ReminderSettings;
  toggleReminder: (medicationId: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    permission: notificationPermission,
    requestPermission: requestNotificationPermission,
    scheduleReminder,
    cancelReminder,
    cancelAllReminders
  } = useNotifications();

  const [userMedications, setUserMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem("medinutri_medications");
    return saved ? JSON.parse(saved) : [];
  });

  const [mealLog, setMealLog] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem("medinutri_meals");
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem("medinutri_reminders");
    return saved ? JSON.parse(saved) : { enabled: false, medications: {} };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("medinutri_medications", JSON.stringify(userMedications));
  }, [userMedications]);

  useEffect(() => {
    localStorage.setItem("medinutri_meals", JSON.stringify(mealLog));
  }, [mealLog]);

  useEffect(() => {
    localStorage.setItem("medinutri_reminders", JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Sync Notifications with Medications
  useEffect(() => {
    if (!reminderSettings.enabled) {
      cancelAllReminders();
      return;
    }

    userMedications.forEach((med) => {
      const isEnabled = reminderSettings.medications[med.id];
      if (isEnabled && med.time) {
        scheduleReminder(med.id, med.name, med.dosage, med.time);
      } else {
        cancelReminder(med.id);
      }
    });
  }, [userMedications, reminderSettings, scheduleReminder, cancelReminder, cancelAllReminders]);

  const addMedication = (medication: Medication) => {
    const newMed = { ...medication, id: Date.now().toString() };
    setUserMedications((prev) => [...prev, newMed]);
    // Auto-enable reminder for new medication if reminders are enabled
    if (reminderSettings.enabled) {
      setReminderSettings((prev) => ({
        ...prev,
        medications: { ...prev.medications, [newMed.id]: true },
      }));
    }
  };

  const removeMedication = (id: string) => {
    setUserMedications((prev) => prev.filter((m) => m.id !== id));
    // Remove reminder setting
    setReminderSettings((prev) => {
      const { [id]: _, ...rest } = prev.medications;
      return { ...prev, medications: rest };
    });
    cancelReminder(id);
  };

  const addMeal = (food: Food, mealType: MealEntry["mealType"]) => {
    const today = new Date().toISOString().split("T")[0];
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      food,
      mealType,
      date: today,
      timestamp: Date.now(),
    };
    setMealLog((prev) => [...prev, newEntry]);
  };

  const removeMeal = (id: string) => {
    setMealLog((prev) => prev.filter((m) => m.id !== id));
  };

  const getTodaysMeals = () => {
    const today = new Date().toISOString().split("T")[0];
    return mealLog.filter((meal) => meal.date === today);
  };

  const getTodaysCalories = () => {
    return getTodaysMeals().reduce((sum, meal) => sum + meal.food.calories, 0);
  };

  const getTodaysProtein = () => {
    return getTodaysMeals().reduce((sum, meal) => sum + meal.food.protein, 0);
  };

  const toggleReminder = (medicationId: string) => {
    setReminderSettings((prev) => ({
      ...prev,
      medications: {
        ...prev.medications,
        [medicationId]: !prev.medications[medicationId],
      },
    }));
  };

  const setRemindersEnabled = (enabled: boolean) => {
    setReminderSettings((prev) => {
      // When enabling, turn on all medication reminders
      if (enabled) {
        const allMeds: Record<string, boolean> = {};
        userMedications.forEach((med) => {
          allMeds[med.id] = true;
        });
        return { enabled, medications: allMeds };
      }
      return { ...prev, enabled };
    });
  };

  const [hasOldData, setHasOldData] = useState(false);

  // Check for old data (> 60 days) on load and when mealLog changes
  useEffect(() => {
    const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
    const oldExists = mealLog.some(meal => meal.timestamp < sixtyDaysAgo);
    setHasOldData(oldExists);
  }, [mealLog]);

  const clearOldData = () => {
    const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
    setMealLog((prev) => prev.filter(meal => meal.timestamp >= sixtyDaysAgo));
  };

  return (
    <AppContext.Provider
      value={{
        userMedications,
        addMedication,
        removeMedication,
        mealLog,
        addMeal,
        removeMeal,
        getTodaysMeals,
        getTodaysCalories,
        getTodaysProtein,
        hasOldData,
        clearOldData,
        reminderSettings,
        toggleReminder,
        setRemindersEnabled,
        notificationPermission,
        requestNotificationPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
