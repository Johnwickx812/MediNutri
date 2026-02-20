import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Medication } from "@/data/medications";
import { Food } from "@/data/foods";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config";

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
  const { user, token } = useAuth();
  const {
    permission: notificationPermission,
    requestPermission: requestNotificationPermission,
    scheduleReminder,
    cancelReminder,
    cancelAllReminders
  } = useNotifications();

  const [userMedications, setUserMedications] = useState<Medication[]>([]);
  const [mealLog, setMealLog] = useState<MealEntry[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({ enabled: false, medications: {} });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load Data on User Change
  useEffect(() => {
    if (!user || !user.id) {
      // Clear data on logout
      setUserMedications([]);
      setMealLog([]);
      setReminderSettings({ enabled: false, medications: {} });
      setIsDataLoaded(false);
      return;
    }

    const loadData = async () => {
      try {
        // 1. Try Local Cache First (User Specific Key)
        const localPrefix = `medinutri_user_${user.id}`;
        const cachedMeds = localStorage.getItem(`${localPrefix}_medications`);
        const cachedMeals = localStorage.getItem(`${localPrefix}_meals`);
        const cachedReminders = localStorage.getItem(`${localPrefix}_reminders`);

        if (cachedMeds) setUserMedications(JSON.parse(cachedMeds));
        if (cachedMeals) setMealLog(JSON.parse(cachedMeals));
        if (cachedReminders) setReminderSettings(JSON.parse(cachedReminders));

        // 2. Fetch from Backend
        if (token) {
          const response = await fetch(`${API_URL}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();

          if (data.success) {
            // Merge or overwrite strategy - for now overwrite with server truth
            if (data.medications) setUserMedications(data.medications);
            if (data.meals) setMealLog(data.meals);
            if (data.reminders) setReminderSettings(data.reminders);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, [user?.id, token]);


  // Sync Data to Backend & LocalStorage
  const syncData = useCallback(async (
    meds: Medication[],
    meals: MealEntry[],
    reminders: ReminderSettings
  ) => {
    if (!user?.id || !isDataLoaded) return;

    // 1. Save to Local Storage (User Specific)
    const localPrefix = `medinutri_user_${user.id}`;
    localStorage.setItem(`${localPrefix}_medications`, JSON.stringify(meds));
    localStorage.setItem(`${localPrefix}_meals`, JSON.stringify(meals));
    localStorage.setItem(`${localPrefix}_reminders`, JSON.stringify(reminders));

    // 2. Sync to Backend
    if (token) {
      try {
        await fetch(`${API_URL}/api/user/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            medications: meds,
            meals: meals,
            reminders: reminders
          })
        });
      } catch (error) {
        console.error("Failed to sync data to backend:", error);
      }
    }
  }, [user?.id, token, isDataLoaded]);

  // Trigger Sync on changes
  useEffect(() => {
    if (user?.id && isDataLoaded) {
      const timeoutId = setTimeout(() => {
        syncData(userMedications, mealLog, reminderSettings);
      }, 1000); // 1s debounce
      return () => clearTimeout(timeoutId);
    }
  }, [userMedications, mealLog, reminderSettings, user?.id, isDataLoaded, syncData]);


  // --- Logic Helpers ---

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
    if (reminderSettings.enabled) {
      setReminderSettings((prev) => ({
        ...prev,
        medications: { ...prev.medications, [newMed.id]: true },
      }));
    }
  };

  const removeMedication = (id: string) => {
    setUserMedications((prev) => prev.filter((m) => m.id !== id));
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
