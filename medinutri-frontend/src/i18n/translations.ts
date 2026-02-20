/**
 * i18n Translation System for MediNutri
 * 
 * This file contains all UI translations for the supported languages:
 * - English (en) - Default
 * - Malayalam (ml)
 * - Tamil (ta)
 * - Hindi (hi)
 * 
 * Translation logic:
 * - All static UI text is stored here as a nested object structure
 * - Components access translations via the useLanguage() hook
 * - Language preference is stored in localStorage for persistence
 * - Translations update instantly without page reload via React context
 */

export type SupportedLanguage = "en" | "ml" | "ta" | "hi";

export const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  ml: "മലയാളം",
  ta: "தமிழ்",
  hi: "हिन्दी",
};

export const translations = {
  en: {
    // Common
    common: {
      appName: "MediNutri",
      tagline: "Eat Smart. Stay Safe.",
      save: "Save",
      cancel: "Cancel",
      add: "Add",
      remove: "Remove",
      search: "Search",
      all: "All",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      learnMore: "Learn more",
      check: "Check",
    },

    // Navigation
    nav: {
      home: "Home",
      medications: "Medications",
      diet: "Diet",
      checkSafety: "Check Safety",
      aiAssistant: "AI Assistant",
      drugSafety: "Drug Safety",
      settings: "Settings",
    },

    // Drug Safety Page
    drugSafety: {
      title: "Drug Safety",
      description: "Search for medications to verify side effects, medical conditions, and safety profiles.",
      searchPlaceholder: "Search for a drug (e.g., Dolo, Metformin)...",
      sideEffects: "Side Effects",
      severeSideEffects: "Serious Side Effects",
      commonSideEffects: "Common Side Effects",
      medicalCondition: "Used For",
      warnings: "Safety Warnings",
      rating: "User Rating",
      pregnancy: "Pregnancy",
      alcohol: "Alcohol",
      rxOtc: "Rx/OTC",
      noResults: "No drugs found. Try a generic name.",
      searchToView: "Search for a medication to view its safety profile",
    },

    // Home Page
    home: {
      personalHealthCompanion: "Your personal health companion",
      heroTitle1: "Eat Smart.",
      heroTitle2: "Stay Safe.",
      heroDescription: "MediNutri helps you manage your medications and diet while protecting you from dangerous food-drug interactions.",
      getStarted: "Get Started",
      checkSafety: "Check Safety",
      yourMedications: "Your Medications",
      activeMedicines: "Active medicines",
      todaysCalories: "Today's Calories",
      mealsLogged: "meals logged",
      safetyStatus: "Safety Status",
      protected: "Protected",
      interactionsMonitored: "Interactions monitored",
      everythingYouNeed: "Everything You Need for",
      healthyLiving: "Healthy Living",
      simpleTools: "Simple tools to track your health, designed especially for Indian users with regional food options.",
      trackMedications: "Track Medications",
      trackMedicationsDesc: "Keep a record of all your medicines with dosage and timing reminders.",
      logYourDiet: "Log Your Diet",
      logYourDietDesc: "Track your meals with Indian foods like dal, chapati, rice, and more.",
      checkInteractions: "Check Interactions",
      checkInteractionsDesc: "Get instant warnings about food-drug interactions to stay safe.",
      whyChoose: "Why Choose",
      benefit1: "Know which foods to avoid with your medicines",
      benefit2: "Track nutrition with Indian regional foods",
      benefit3: "Get clear, simple health recommendations",
      benefit4: "Designed for easy use by elderly users",
      yourHealthMatters: "Your Health Matters",
      yourHealthMattersDesc: "Stay informed about food-drug interactions and make safer choices for you and your family.",
      checkFoodSafetyNow: "Check Food Safety Now",
      readyToTakeControl: "Ready to Take Control of Your Health?",
      startTracking: "Start tracking your medications and meals today. It's simple, safe, and designed for everyone.",
      addFirstMedication: "Add Your First Medication",
    },

    // Medications Page
    medications: {
      myMedications: "My Medications",
      trackAndManage: "Track and manage your daily medications",
      addMedication: "Add Medication",
      addNewMedication: "Add New Medication",
      medicationName: "Medication Name",
      dosage: "Dosage",
      time: "Time",
      frequency: "Frequency",
      category: "Category",
      yourMedications: "Your Medications",
      noMedicationsYet: "No medications added yet",
      noMedicationsDesc: "Add your medications to track them and check for food interactions.",
      addFirstMedication: "Add Your First Medication",
      quickAddCommon: "Quick Add Common Medications",
      searchMedications: "Search medications...",
      clickToAdd: "Click on any medication below to quickly add it to your list.",
      noMedicationsFound: "No medications found. Try a different search or add manually.",
      medicationAdded: "Medication Added",
      hasBeenAdded: "has been added to your list.",
      medicationRemoved: "Medication Removed",
      hasBeenRemoved: "has been removed.",
      pleaseEnterName: "Please enter a medication name",
      onceDaily: "Once daily",
      twiceDaily: "Twice daily",
      threeTimesDaily: "Three times daily",
      asNeeded: "As needed",
    },

    // Reminders
    reminders: {
      medicationReminders: "Medication Reminders",
      enableReminders: "Enable Medication Reminders",
      getNotified: "Get notified when it's time to take your medicines",
      enableButton: "Enable Reminders",
      active: "active",
      reminderSet: "Reminder Set",
      reminderCancelled: "Reminder Cancelled",
      youllBeReminded: "You'll be reminded to take",
      reminderForCancelled: "Reminder for {name} has been cancelled",
      remindersEnabled: "Reminders Enabled",
      remindersEnabledDesc: "You'll receive notifications for your medications.",
      permissionDenied: "Permission Denied",
      permissionDeniedDesc: "Please enable notifications in your browser settings.",
      browserNotSupported: "Your browser doesn't support notifications.",
      // Notification text (MVP limitation: requires browser tab to be open)
      notificationTitle: "Medication Reminder",
      notificationBody: "Time to take {name} – {dosage}",
    },

    // Diet Page
    diet: {
      dietTracker: "Diet Tracker",
      logYourMeals: "Log your meals with Indian foods and track your nutrition",
      todaysCalories: "Today's Calories",
      kcalConsumed: "kcal consumed",
      protein: "Protein",
      fromTodaysMeals: "from today's meals",
      mealsLogged: "Meals Logged",
      itemsToday: "items today",
      addingTo: "Adding to",
      addFood: "Add Food",
      searchFoods: "Search foods...",
      allCategories: "All Categories",
      noFoodsFound: "No foods found. Try a different search.",
      showingFirst20: "Showing first 20 results. Refine your search to see more.",
      todaysFoodLog: "Today's Food Log",
      noMealsLogged: "No meals logged today. Start adding food!",
      noMealLogged: "No {meal} logged.",
      foodAdded: "Food Added",
      addedTo: "added to",
      removed: "Removed",
      foodRemoved: "Food item removed from today's log.",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      cal: "cal",
      gProtein: "g protein",
    },

    // Interactions Page
    interactions: {
      foodDrugChecker: "Food-Drug Interaction Checker",
      addMedicationsFirst: "Add your medications first to check for food interactions and stay safe.",
      addYourMedications: "Add Your Medications",
      foodSafetyChecker: "Food Safety Checker",
      checkWhichFoodsSafe: "Check which foods are safe with your medications",
      quickFoodSafetyCheck: "🍎 Quick Food Safety Check",
      enterFoodName: "Enter a food name to check if it's safe with your medications",
      foodPlaceholder: "e.g., Banana, Grapefruit, Curd...",
      avoid: "AVOID",
      useCaution: "Use Caution",
      safeToEat: "Safe to Eat",
      with: "With",
      noInteractionsFound: "No known interactions found with your medications. This food should be safe to consume.",
      yourMedications: "Your Medications",
      foodsToAvoid: "Foods to Avoid",
      useCautionLabel: "Use Caution",
      safeFoods: "Safe Foods",
      searchInteractions: "Search interactions...",
      importantDisclaimer: "Important Disclaimer",
      disclaimerText: "This information is for general guidance only. Always consult your doctor or pharmacist for personalized medical advice. Some interactions may not be listed here.",
    },

    // Settings Page
    settings: {
      settings: "Settings",
      language: "Language",
      selectLanguage: "Select Language",
      languageChanged: "Language Changed",
      languageChangedTo: "Language changed to",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      darkModeDesc: "Switch to a darker color theme for reduced eye strain",
      themeChanged: "Theme Changed",
      darkModeEnabled: "Dark mode enabled",
      lightModeEnabled: "Light mode enabled",
    },

    // Feedback Page
    feedback: {
      title: "Feedback & Queries",
      description: "Have a question or facing an issue? Send us a message and we'll get back to you.",
      name: "Your Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message/Query",
      submit: "Send Message",
      successTitle: "Message Sent",
      successDesc: "Thank you for your feedback! We'll get back to you soon.",
      errorTitle: "Submission Failed",
      errorDesc: "Something went wrong. Please try again later.",
      placeholders: {
        name: "Enter your name",
        email: "e.g., example@gmail.com",
        subject: "What is this about?",
        message: "Describe your query or problem in detail..."
      }
    },

    // Footer
    footer: {
      disclaimer: "⚠️ This app provides general information only. Always consult your doctor or pharmacist for medical advice.",
      copyright: "© 2025 MediNutri.",
    },

    // Not Found
    notFound: {
      pageNotFound: "Page Not Found",
      goHome: "Go Home",
    },

    // Auth
    auth: {
      login: "Login",
      register: "Register",
      loginTitle: "Welcome Back",
      loginSubtitle: "Sign in to access your health profile",
      registerTitle: "Create Account",
      registerSubtitle: "Join MediNutri to manage your medications and diet",
      email: "Email Address",
      password: "Password",
      name: "Full Name",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loginButton: "Login",
      registerButton: "Create Account",
      loggingIn: "Logging in...",
      registering: "Creating account...",
      logout: "Logout",
      passwordRequirements: "Password must be at least 8 characters with letters and numbers",
      profile: "User Profile",
      healthSummary: "Health Summary",
      recentMeals: "Recent Meals",
      activeMedications: "Active Medications",
      noMedications: "No medications added yet",
      noMeals: "No meals logged today",
      memberSince: "Member since",
    },

    // AI Assistant
    ai: {
      title: "MediNutri AI",
      subtitle: "Your personal health assistant",
      pageTitle: "AI Health Assistant",
      pageDescription: "Get personalized diet recommendations, medication safety checks, and health guidance based on your profile and medications.",
      clearChat: "Clear",
      welcomeTitle: "How can I help you today?",
      welcomeDescription: "Ask me about diet plans, food-drug interactions, meal suggestions, or any health-related questions.",
      medicationsTracked: "medications tracked",
      thinking: "Thinking...",
      inputPlaceholder: "Ask about diet, medications, or health...",
      disclaimer: "Always consult your doctor for medical advice. This is for informational purposes only.",
      medications: "Medications",
      caloriesConsumed: "Calories today",
      proteinConsumed: "Protein today",
      mealsTracked: "Meals today",
      yourCurrentMedications: "Your Current Medications",
      medicationsNote: "The AI considers these medications when providing diet and safety recommendations.",
      healthProfile: "Health Profile",
      completeProfile: "Complete your profile for personalized recommendations",
      addProfile: "Add Profile",
      age: "Age",
      gender: "Gender",
      weight: "Weight",
      height: "Height",
      weightKg: "Weight (kg)",
      heightCm: "Height (cm)",
      select: "Select",
      male: "Male",
      female: "Female",
      other: "Other",
      activityLevel: "Activity Level",
      sedentary: "Sedentary",
      lightActive: "Lightly Active",
      moderateActive: "Moderately Active",
      active: "Active",
      veryActive: "Very Active",
      dietType: "Diet Type",
      vegetarian: "Vegetarian",
      nonVegetarian: "Non-Vegetarian",
      vegan: "Vegan",
      eggetarian: "Eggetarian",
      primaryGoal: "Primary Goal",
      weightLoss: "Weight Loss",
      weightGain: "Weight Gain",
      maintainWeight: "Maintain Weight",
      manageDiabetes: "Manage Diabetes",
      heartHealth: "Heart Health",
      generalWellness: "General Wellness",
      underweight: "Underweight",
      normal: "Normal",
      overweight: "Overweight",
      obese: "Obese",
      activity: "Activity",
      diet: "Diet",
      goal: "Goal",
      // Suggested prompts
      suggestDietPlan: "Analyze my diet today",
      whatFoodsAvoid: "What foods interact with currently active meds?",
      checkFoodSafe: "What are the side effects of Metformin?",
      breakfastSuggestion: "Is it safe to eat Grapefruit with Statins?",
      explainInteraction: "Check if my medications have any interactions",
    },
  },

  ml: {
    // Common
    common: {
      appName: "മെഡിന്യൂട്രി",
      tagline: "സമർത്ഥമായി കഴിക്കുക. സുരക്ഷിതമായിരിക്കുക.",
      save: "സേവ് ചെയ്യുക",
      cancel: "റദ്ദാക്കുക",
      add: "ചേർക്കുക",
      remove: "നീക്കം ചെയ്യുക",
      search: "തിരയുക",
      all: "എല്ലാം",
      loading: "ലോഡ് ചെയ്യുന്നു...",
      error: "പിശക്",
      success: "വിജയം",
      confirm: "സ്ഥിരീകരിക്കുക",
      back: "തിരികെ",
      next: "അടുത്തത്",
      learnMore: "കൂടുതൽ അറിയുക",
      check: "പരിശോധിക്കുക",
    },

    // Navigation
    nav: {
      home: "ഹോം",
      medications: "മരുന്നുകൾ",
      diet: "ഭക്ഷണക്രമം",
      checkSafety: "സുരക്ഷ പരിശോധിക്കുക",
      aiAssistant: "AI സഹായി",
      drugSafety: "മരുന്ന് സുരക്ഷ",
      settings: "ക്രമീകരണങ്ങൾ",
    },

    // Drug Safety Page (Malayalam)
    drugSafety: {
      title: "മരുന്ന് സുരക്ഷ",
      description: "പാർശ്വഫലങ്ങളും സുരക്ഷയും പരിശോധിക്കാൻ മരുന്നുകൾ തിരയുക.",
      searchPlaceholder: "മരുന്ന് തിരയുക...",
      sideEffects: "പാർശ്വഫലങ്ങൾ",
      severeSideEffects: "ഗുരുതരമായ പാർശ്വഫലങ്ങൾ",
      commonSideEffects: "സാധാരണ പാർശ്വഫലങ്ങൾ",
      medicalCondition: "ഉപയോഗിക്കുന്നത്",
      warnings: "മുന്നറിയിപ്പുകൾ",
      rating: "റേറ്റിംഗ്",
      pregnancy: "ഗർഭകാലം",
      alcohol: "മദ്യം",
      rxOtc: "കുറിപ്പടി",
      noResults: "മരുന്നുകൾ കണ്ടെത്തിയില്ല.",
      searchToView: "സുരക്ഷാ വിവരങ്ങൾ കാണാൻ മരുന്ന് തിരയുക",
    },

    // Home Page
    home: {
      personalHealthCompanion: "നിങ്ങളുടെ വ്യക്തിഗത ആരോഗ്യ സഹായി",
      heroTitle1: "സമർത്ഥമായി കഴിക്കുക.",
      heroTitle2: "സുരക്ഷിതമായിരിക്കുക.",
      heroDescription: "അപകടകരമായ ഭക്ഷണ-മരുന്ന് ഇടപെടലുകളിൽ നിന്ന് നിങ്ങളെ സംരക്ഷിക്കുമ്പോൾ നിങ്ങളുടെ മരുന്നുകളും ഭക്ഷണക്രമവും കൈകാര്യം ചെയ്യാൻ MediNutri സഹായിക്കുന്നു.",
      getStarted: "ആരംഭിക്കുക",
      checkSafety: "സുരക്ഷ പരിശോധിക്കുക",
      yourMedications: "നിങ്ങളുടെ മരുന്നുകൾ",
      activeMedicines: "സജീവ മരുന്നുകൾ",
      todaysCalories: "ഇന്നത്തെ കലോറികൾ",
      mealsLogged: "ഭക്ഷണം രേഖപ്പെടുത്തി",
      safetyStatus: "സുരക്ഷാ നില",
      protected: "സംരക്ഷിതം",
      interactionsMonitored: "ഇടപെടലുകൾ നിരീക്ഷിക്കുന്നു",
      everythingYouNeed: "നിങ്ങൾക്ക് വേണ്ടതെല്ലാം",
      healthyLiving: "ആരോഗ്യകരമായ ജീവിതത്തിന്",
      simpleTools: "ഇന്ത്യൻ ഉപയോക്താക്കൾക്കായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്ത ലളിതമായ ഉപകരണങ്ങൾ.",
      trackMedications: "മരുന്നുകൾ ട്രാക്ക് ചെയ്യുക",
      trackMedicationsDesc: "ഡോസേജും ടൈമിംഗ് ഓർമ്മപ്പെടുത്തലുകളും ഉള്ള എല്ലാ മരുന്നുകളുടെയും രേഖ സൂക്ഷിക്കുക.",
      logYourDiet: "നിങ്ങളുടെ ഭക്ഷണക്രമം രേഖപ്പെടുത്തുക",
      logYourDietDesc: "ദാൽ, ചപ്പാത്തി, ചോറ് തുടങ്ങിയ ഇന്ത്യൻ ഭക്ഷണങ്ങൾ ട്രാക്ക് ചെയ്യുക.",
      checkInteractions: "ഇടപെടലുകൾ പരിശോധിക്കുക",
      checkInteractionsDesc: "ഭക്ഷണ-മരുന്ന് ഇടപെടലുകളെക്കുറിച്ച് തൽക്ഷണ മുന്നറിയിപ്പുകൾ നേടുക.",
      whyChoose: "എന്തുകൊണ്ട് തിരഞ്ഞെടുക്കണം",
      benefit1: "നിങ്ങളുടെ മരുന്നുകളോടൊപ്പം ഏത് ഭക്ഷണങ്ങൾ ഒഴിവാക്കണമെന്ന് അറിയുക",
      benefit2: "ഇന്ത്യൻ പ്രാദേശിക ഭക്ഷണങ്ങളുമായി പോഷകാഹാരം ട്രാക്ക് ചെയ്യുക",
      benefit3: "വ്യക്തമായ, ലളിതമായ ആരോഗ്യ ശുപാർശകൾ നേടുക",
      benefit4: "മുതിർന്നവർക്ക് എളുപ്പത്തിൽ ഉപയോഗിക്കാൻ രൂപകൽപ്പന ചെയ്തത്",
      yourHealthMatters: "നിങ്ങളുടെ ആരോഗ്യം പ്രധാനമാണ്",
      yourHealthMattersDesc: "ഭക്ഷണ-മരുന്ന് ഇടപെടലുകളെക്കുറിച്ച് അറിവുള്ളവരായിരിക്കുക.",
      checkFoodSafetyNow: "ഇപ്പോൾ ഭക്ഷണ സുരക്ഷ പരിശോധിക്കുക",
      readyToTakeControl: "നിങ്ങളുടെ ആരോഗ്യം നിയന്ത്രിക്കാൻ തയ്യാറാണോ?",
      startTracking: "ഇന്ന് തന്നെ നിങ്ങളുടെ മരുന്നുകളും ഭക്ഷണങ്ങളും ട്രാക്ക് ചെയ്യാൻ തുടങ്ങുക.",
      addFirstMedication: "നിങ്ങളുടെ ആദ്യ മരുന്ന് ചേർക്കുക",
    },

    // Medications Page
    medications: {
      myMedications: "എന്റെ മരുന്നുകൾ",
      trackAndManage: "നിങ്ങളുടെ ദൈനംദിന മരുന്നുകൾ ട്രാക്ക് ചെയ്യുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുക",
      addMedication: "മരുന്ന് ചേർക്കുക",
      addNewMedication: "പുതിയ മരുന്ന് ചേർക്കുക",
      medicationName: "മരുന്നിന്റെ പേര് *",
      dosage: "ഡോസേജ്",
      time: "സമയം",
      frequency: "ആവൃത്തി",
      category: "വിഭാഗം",
      yourMedications: "നിങ്ങളുടെ മരുന്നുകൾ",
      noMedicationsYet: "ഇതുവരെ മരുന്നുകൾ ചേർത്തിട്ടില്ല",
      noMedicationsDesc: "ഭക്ഷണ ഇടപെടലുകൾ പരിശോധിക്കാൻ നിങ്ങളുടെ മരുന്നുകൾ ചേർക്കുക.",
      addFirstMedication: "നിങ്ങളുടെ ആദ്യ മരുന്ന് ചേർക്കുക",
      quickAddCommon: "സാധാരണ മരുന്നുകൾ വേഗത്തിൽ ചേർക്കുക",
      searchMedications: "മരുന്നുകൾ തിരയുക...",
      clickToAdd: "നിങ്ങളുടെ ലിസ്റ്റിലേക്ക് വേഗത്തിൽ ചേർക്കാൻ ചുവടെയുള്ള ഏതെങ്കിലും മരുന്നിൽ ക്ലിക്ക് ചെയ്യുക.",
      noMedicationsFound: "മരുന്നുകൾ കണ്ടെത്തിയില്ല. മറ്റൊരു തിരയൽ ശ്രമിക്കുക.",
      medicationAdded: "മരുന്ന് ചേർത്തു",
      hasBeenAdded: "നിങ്ങളുടെ ലിസ്റ്റിലേക്ക് ചേർത്തു.",
      medicationRemoved: "മരുന്ന് നീക്കം ചെയ്തു",
      hasBeenRemoved: "നീക്കം ചെയ്തു.",
      pleaseEnterName: "ദയവായി മരുന്നിന്റെ പേര് നൽകുക",
      onceDaily: "ദിവസത്തിൽ ഒരിക്കൽ",
      twiceDaily: "ദിവസത്തിൽ രണ്ടു തവണ",
      threeTimesDaily: "ദിവസത്തിൽ മൂന്ന് തവണ",
      asNeeded: "ആവശ്യാനുസരണം",
    },

    // Reminders
    reminders: {
      medicationReminders: "മരുന്ന് ഓർമ്മപ്പെടുത്തലുകൾ",
      enableReminders: "മരുന്ന് ഓർമ്മപ്പെടുത്തലുകൾ പ്രവർത്തനക്ഷമമാക്കുക",
      getNotified: "നിങ്ങളുടെ മരുന്നുകൾ കഴിക്കേണ്ട സമയമായാൽ അറിയിപ്പ് ലഭിക്കുക",
      enableButton: "ഓർമ്മപ്പെടുത്തലുകൾ പ്രവർത്തനക്ഷമമാക്കുക",
      active: "സജീവം",
      reminderSet: "ഓർമ്മപ്പെടുത്തൽ സജ്ജമാക്കി",
      reminderCancelled: "ഓർമ്മപ്പെടുത്തൽ റദ്ദാക്കി",
      youllBeReminded: "നിങ്ങൾക്ക് ഓർമ്മപ്പെടുത്തും",
      reminderForCancelled: "{name} എന്നതിനുള്ള ഓർമ്മപ്പെടുത്തൽ റദ്ദാക്കി",
      remindersEnabled: "ഓർമ്മപ്പെടുത്തലുകൾ പ്രവർത്തനക്ഷമമാക്കി",
      remindersEnabledDesc: "നിങ്ങളുടെ മരുന്നുകൾക്കായി അറിയിപ്പുകൾ ലഭിക്കും.",
      permissionDenied: "അനുമതി നിരസിച്ചു",
      permissionDeniedDesc: "ദയവായി ബ്രൗസർ ക്രമീകരണങ്ങളിൽ അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക.",
      browserNotSupported: "നിങ്ങളുടെ ബ്രൗസർ അറിയിപ്പുകളെ പിന്തുണയ്ക്കുന്നില്ല.",
      notificationTitle: "മരുന്ന് ഓർമ്മപ്പെടുത്തൽ",
      notificationBody: "{name} – {dosage} കഴിക്കാനുള്ള സമയം",
    },

    // Diet Page
    diet: {
      dietTracker: "ഭക്ഷണക്രമം ട്രാക്കർ",
      logYourMeals: "ഇന്ത്യൻ ഭക്ഷണങ്ങളുമായി നിങ്ങളുടെ ഭക്ഷണം രേഖപ്പെടുത്തുകയും പോഷകാഹാരം ട്രാക്ക് ചെയ്യുകയും ചെയ്യുക",
      todaysCalories: "ഇന്നത്തെ കലോറികൾ",
      kcalConsumed: "kcal കഴിച്ചു",
      protein: "പ്രോട്ടീൻ",
      fromTodaysMeals: "ഇന്നത്തെ ഭക്ഷണത്തിൽ നിന്ന്",
      mealsLogged: "ഭക്ഷണം രേഖപ്പെടുത്തി",
      itemsToday: "ഇന്നത്തെ ഇനങ്ങൾ",
      addingTo: "ചേർക്കുന്നത്",
      addFood: "ഭക്ഷണം ചേർക്കുക",
      searchFoods: "ഭക്ഷണങ്ങൾ തിരയുക...",
      allCategories: "എല്ലാ വിഭാഗങ്ങളും",
      noFoodsFound: "ഭക്ഷണങ്ങൾ കണ്ടെത്തിയില്ല. മറ്റൊരു തിരയൽ ശ്രമിക്കുക.",
      showingFirst20: "ആദ്യ 20 ഫലങ്ങൾ കാണിക്കുന്നു. കൂടുതൽ കാണാൻ തിരയൽ പരിഷ്കരിക്കുക.",
      todaysFoodLog: "ഇന്നത്തെ ഭക്ഷണ ലോഗ്",
      noMealsLogged: "ഇന്ന് ഭക്ഷണം രേഖപ്പെടുത്തിയിട്ടില്ല. ഭക്ഷണം ചേർക്കാൻ തുടങ്ങുക!",
      noMealLogged: "{meal} രേഖപ്പെടുത്തിയിട്ടില്ല.",
      foodAdded: "ഭക്ഷണം ചേർത്തു",
      addedTo: "ചേർത്തു",
      removed: "നീക്കം ചെയ്തു",
      foodRemoved: "ഇന്നത്തെ ലോഗിൽ നിന്ന് ഭക്ഷണ ഇനം നീക്കം ചെയ്തു.",
      breakfast: "പ്രഭാത ഭക്ഷണം",
      lunch: "ഉച്ചഭക്ഷണം",
      dinner: "അത്താഴം",
      snack: "ലഘുഭക്ഷണം",
      cal: "കലോറി",
      gProtein: "g പ്രോട്ടീൻ",
    },

    // Interactions Page
    interactions: {
      foodDrugChecker: "ഭക്ഷണ-മരുന്ന് ഇടപെടൽ പരിശോധകൻ",
      addMedicationsFirst: "ഭക്ഷണ ഇടപെടലുകൾ പരിശോധിക്കാൻ ആദ്യം നിങ്ങളുടെ മരുന്നുകൾ ചേർക്കുക.",
      addYourMedications: "നിങ്ങളുടെ മരുന്നുകൾ ചേർക്കുക",
      foodSafetyChecker: "ഭക്ഷണ സുരക്ഷാ പരിശോധകൻ",
      checkWhichFoodsSafe: "നിങ്ങളുടെ മരുന്നുകൾക്കൊപ്പം ഏത് ഭക്ഷണങ്ങൾ സുരക്ഷിതമാണെന്ന് പരിശോധിക്കുക",
      quickFoodSafetyCheck: "🍎 വേഗത്തിലുള്ള ഭക്ഷണ സുരക്ഷാ പരിശോധന",
      enterFoodName: "നിങ്ങളുടെ മരുന്നുകൾക്കൊപ്പം സുരക്ഷിതമാണോ എന്ന് പരിശോധിക്കാൻ ഭക്ഷണത്തിന്റെ പേര് നൽകുക",
      foodPlaceholder: "ഉദാ: വാഴപ്പഴം, ചകോതര, തൈര്...",
      avoid: "ഒഴിവാക്കുക",
      useCaution: "ജാഗ്രതയോടെ ഉപയോഗിക്കുക",
      safeToEat: "കഴിക്കാൻ സുരക്ഷിതം",
      with: "കൂടെ",
      noInteractionsFound: "നിങ്ങളുടെ മരുന്നുകളുമായി അറിയപ്പെടുന്ന ഇടപെടലുകൾ കണ്ടെത്തിയില്ല.",
      yourMedications: "നിങ്ങളുടെ മരുന്നുകൾ",
      foodsToAvoid: "ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ",
      useCautionLabel: "ജാഗ്രത പാലിക്കുക",
      safeFoods: "സുരക്ഷിത ഭക്ഷണങ്ങൾ",
      searchInteractions: "ഇടപെടലുകൾ തിരയുക...",
      importantDisclaimer: "പ്രധാന നിരാകരണം",
      disclaimerText: "ഈ വിവരങ്ങൾ പൊതുവായ മാർഗ്ഗനിർദ്ദേശത്തിന് മാത്രമാണ്. വ്യക്തിഗത വൈദ്യ ഉപദേശത്തിന് എല്ലായ്പ്പോഴും നിങ്ങളുടെ ഡോക്ടറെയോ ഫാർമസിസ്റ്റിനെയോ സമീപിക്കുക.",
    },

    // Settings Page
    settings: {
      settings: "ക്രമീകരണങ്ങൾ",
      language: "ഭാഷ",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      languageChanged: "ഭാഷ മാറ്റി",
      languageChangedTo: "ഭാഷ മാറ്റി:",
      appearance: "രൂപഭാവം",
      darkMode: "ഡാർക്ക് മോഡ്",
      darkModeDesc: "കണ്ണുകളുടെ ആയാസം കുറയ്ക്കാൻ ഇരുണ്ട നിറ തീമിലേക്ക് മാറുക",
      themeChanged: "തീം മാറ്റി",
      darkModeEnabled: "ഡാർക്ക് മോഡ് പ്രവർത്തനക്ഷമമാക്കി",
      lightModeEnabled: "ലൈറ്റ് മോഡ് പ്രവർത്തനക്ഷമമാക്കി",
    },

    // Feedback Page
    feedback: {
      title: "അഭിപ്രായങ്ങളും സംശയങ്ങളും",
      description: "നിങ്ങൾക്ക് എന്തെങ്കിലും ചോദ്യങ്ങളോ പ്രശ്നങ്ങളோ ഉണ്ടോ? ഞങ്ങൾക്ക് ഒരു സന്ദേശം അയക്കുക.",
      name: "നിങ്ങളുടെ പേര്",
      email: "ഇമെയിൽ വിലാസം",
      subject: "വിഷയം",
      message: "സന്ദേശം/സംശയം",
      submit: "സന്ദേശം അയക്കുക",
      successTitle: "സന്ദേശം അയച്ചു",
      successDesc: "നിങ്ങളുടെ അഭിപ്രായത്തിന് നന്ദി! ഞങ്ങൾ ഉടൻ നിങ്ങളെ ബന്ധപ്പെടും.",
      errorTitle: "സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല",
      errorDesc: "എന്തോ പിശക് പറ്റി. ദയവായി പിന്നീട് ശ്രമിക്കുക.",
      placeholders: {
        name: "പേര് നൽകുക",
        email: "ഉദാ: example@gmail.com",
        subject: "ഇത് എന്തിനെക്കുറിച്ചാണ്?",
        message: "നിങ്ങളുടെ സംശയമോ പ്രശ്നമോ വിശദമായി എഴുതുക..."
      }
    },

    // Footer
    footer: {
      disclaimer: "⚠️ ഈ ആപ്പ് പൊതു വിവരങ്ങൾ മാത്രമാണ് നൽകുന്നത്. വൈദ്യ ഉപദേശത്തിന് എല്ലായ്പ്പോഴും നിങ്ങളുടെ ഡോക്ടറെ സമീപിക്കുക.",
      copyright: "© 2025 MediNutri.",
    },

    // Not Found
    notFound: {
      pageNotFound: "പേജ് കണ്ടെത്തിയില്ല",
      goHome: "ഹോമിലേക്ക് പോകുക",
    },

    // Auth
    auth: {
      login: "ലോഗിൻ",
      register: "രജിസ്റ്റർ",
      loginTitle: "വീണ്ടും സ്വാഗതം",
      loginSubtitle: "നിങ്ങളുടെ ആരോഗ്യ പ്രൊഫൈൽ ആക്‌സസ് ചെയ്യാൻ സൈൻ ഇൻ ചെയ്യുക",
      registerTitle: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      registerSubtitle: "മരുന്നുകളും ഭക്ഷണക്രമവും നിയന്ത്രിക്കാൻ മെഡിന്യൂട്രിയിൽ ചേരുക",
      email: "ഇമെയിൽ വിലാസം",
      password: "പാസ്‌വേഡ്",
      name: "പൂർണ്ണമായ പേര്",
      noAccount: "അക്കൗണ്ട് ഇല്ലേ?",
      hasAccount: "നിലവിൽ അക്കൗണ്ട് ഉണ്ടോ?",
      loginButton: "ലോഗിൻ",
      registerButton: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      loggingIn: "ലോഗിൻ ചെയ്യുന്നു...",
      registering: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...",
      logout: "ലോഗൗട്ട്",
      passwordRequirements: "അക്ഷരങ്ങളും നമ്പറുകളും ഉള്ള കുറഞ്ഞത് 8 പ്രതീകങ്ങൾ പാസ്‌വേഡിൽ ഉണ്ടായിരിക്കണം",
      profile: "യൂസർ പ്രൊഫൈൽ",
      healthSummary: "ആരോഗ്യ സംഗ്രഹം",
      recentMeals: "സമീപകാല ഭക്ഷണങ്ങൾ",
      activeMedications: "സജീവമായ മരുന്നുകൾ",
      noMedications: "മരുന്നുകളൊന്നും ചേർത്തിട്ടില്ല",
      noMeals: "ഇന്ന് ഭക്ഷണങ്ങളൊന്നും രേഖപ്പെടുത്തിയിട്ടില്ല",
      memberSince: "അംഗമായത്",
    },

    // AI Assistant
    ai: {
      title: "മെഡിന്യൂട്രി AI",
      subtitle: "നിങ്ങളുടെ വ്യക്തിഗത ആരോഗ്യ സഹായി",
      pageTitle: "AI ആരോഗ്യ സഹായി",
      pageDescription: "നിങ്ങളുടെ പ്രൊഫൈലും മരുന്നുകളും അടിസ്ഥാനമാക്കി വ്യക്തിഗത ഭക്ഷണ ശുപാർശകൾ നേടുക.",
      clearChat: "മായ്ക്കുക",
      welcomeTitle: "ഇന്ന് എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?",
      welcomeDescription: "ഭക്ഷണക്രമം, ഭക്ഷണ-മരുന്ന് ഇടപെടലുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.",
      medicationsTracked: "മരുന്നുകൾ ട്രാക്ക് ചെയ്തു",
      thinking: "ചിന്തിക്കുന്നു...",
      inputPlaceholder: "ഭക്ഷണം, മരുന്നുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
      disclaimer: "വൈദ്യ ഉപദേശത്തിന് എല്ലായ്പ്പോഴും നിങ്ങളുടെ ഡോക്ടറെ സമീപിക്കുക.",
      medications: "മരുന്നുകൾ",
      caloriesConsumed: "ഇന്നത്തെ കലോറികൾ",
      proteinConsumed: "ഇന്നത്തെ പ്രോട്ടീൻ",
      mealsTracked: "ഇന്നത്തെ ഭക്ഷണം",
      yourCurrentMedications: "നിങ്ങളുടെ നിലവിലെ മരുന്നുകൾ",
      medicationsNote: "ഭക്ഷണ ശുപാർശകൾ നൽകുമ്പോൾ AI ഈ മരുന്നുകൾ പരിഗണിക്കുന്നു.",
      healthProfile: "ആരോഗ്യ പ്രൊഫൈൽ",
      completeProfile: "വ്യക്തിഗത ശുപാർശകൾക്കായി പ്രൊഫൈൽ പൂർത്തിയാക്കുക",
      addProfile: "പ്രൊഫൈൽ ചേർക്കുക",
      age: "പ്രായം",
      gender: "ലിംഗം",
      weight: "ഭാരം",
      height: "ഉയരം",
      weightKg: "ഭാരം (kg)",
      heightCm: "ഉയരം (cm)",
      select: "തിരഞ്ഞെടുക്കുക",
      male: "പുരുഷൻ",
      female: "സ്ത്രീ",
      other: "മറ്റുള്ളവ",
      activityLevel: "പ്രവർത്തന നില",
      sedentary: "ഇരുന്നുകൊണ്ടുള്ള",
      lightActive: "ലഘുവായി സജീവം",
      moderateActive: "മിതമായി സജീവം",
      active: "സജീവം",
      veryActive: "വളരെ സജീവം",
      dietType: "ഭക്ഷണ തരം",
      vegetarian: "സസ്യാഹാരം",
      nonVegetarian: "മാംസാഹാരം",
      vegan: "വീഗൻ",
      eggetarian: "മുട്ട സസ്യാഹാരം",
      primaryGoal: "പ്രാഥമിക ലക്ഷ്യം",
      weightLoss: "ഭാരം കുറയ്ക്കൽ",
      weightGain: "ഭാരം കൂട്ടൽ",
      maintainWeight: "ഭാരം നിലനിർത്തൽ",
      manageDiabetes: "പ്രമേഹ നിയന്ത്രണം",
      heartHealth: "ഹൃദയാരോഗ്യം",
      generalWellness: "പൊതു ക്ഷേമം",
      underweight: "കുറഞ്ഞ ഭാരം",
      normal: "സാധാരണ",
      overweight: "അധിക ഭാരം",
      obese: "അമിത ഭാരം",
      activity: "പ്രവർത്തനം",
      diet: "ഭക്ഷണം",
      goal: "ലക്ഷ്യം",
      suggestDietPlan: "ഇന്നത്തെ എന്റെ ഭക്ഷണക്രമം വിശകലനം ചെയ്യുക",
      whatFoodsAvoid: "എന്റെ മരുന്നുകൾക്കൊപ്പം ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ?",
      checkFoodSafe: "മെറ്റ്ഫോർമിൻ പാർശ്വഫലങ്ങൾ എന്തൊക്കെ?",
      breakfastSuggestion: "മുന്തിരി കഴിക്കുന്നത് സുരക്ഷിതമാണോ?",
      explainInteraction: "എന്റെ മരുന്ന് ഇടപെടലുകൾ പരിശോധിക്കുക",
    },
  },

  ta: {
    // Common
    common: {
      appName: "மெடிநியூட்ரி",
      tagline: "புத்திசாலித்தனமாக சாப்பிடுங்கள். பாதுகாப்பாக இருங்கள்.",
      save: "சேமி",
      cancel: "ரத்து",
      add: "சேர்",
      remove: "நீக்கு",
      search: "தேடு",
      all: "அனைத்தும்",
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      success: "வெற்றி",
      confirm: "உறுதிப்படுத்து",
      back: "பின்",
      next: "அடுத்து",
      learnMore: "மேலும் அறிக",
      check: "சரிபார்",
    },

    // Navigation
    nav: {
      home: "முகப்பு",
      medications: "மருந்துகள்",
      diet: "உணவு",
      checkSafety: "பாதுகாப்பை சரிபார்",
      aiAssistant: "AI உதவியாளர்",
      drugSafety: "மருந்து பாதுகாப்பு",
      settings: "அமைப்புகள்",
    },

    // Drug Safety Page (Tamil)
    drugSafety: {
      title: "மருந்து பாதுகாப்பு",
      description: "பக்க விளைவுகள் மற்றும் பாதுகாப்பை சரிபார்க்க மருந்துகளைத் தேடுங்கள்.",
      searchPlaceholder: "மருந்தைத் தேடுங்கள்...",
      sideEffects: "பக்க விளைவுகள்",
      severeSideEffects: "தீவிர பக்க விளைவுகள்",
      commonSideEffects: "பொதுவான பக்க விளைவுகள்",
      medicalCondition: "பயன்பாடு",
      warnings: "எச்சரிக்கைகள்",
      rating: "மதிப்பீடு",
      pregnancy: "கர்ப்பம்",
      alcohol: "மது",
      rxOtc: "மருந்து சீட்டு",
      noResults: "மருந்துகள் கிடைக்கவில்லை.",
      searchToView: "பாதுகாப்பு விவரங்களைக் காண மருந்தைத் தேடுங்கள்",
    },

    // Home Page
    home: {
      personalHealthCompanion: "உங்கள் தனிப்பட்ட சுகாதார துணை",
      heroTitle1: "புத்திசாலித்தனமாக சாப்பிடுங்கள்.",
      heroTitle2: "பாதுகாப்பாக இருங்கள்.",
      heroDescription: "ஆபத்தான உணவு-மருந்து தொடர்புகளிலிருந்து உங்களைப் பாதுகாக்கும் போது உங்கள் மருந்துகள் மற்றும் உணவுமுறையை நிர்வகிக்க MediNutri உதவுகிறது.",
      getStarted: "தொடங்கு",
      checkSafety: "பாதுகாப்பை சரிபார்",
      yourMedications: "உங்கள் மருந்துகள்",
      activeMedicines: "செயலில் உள்ள மருந்துகள்",
      todaysCalories: "இன்றைய கலோரிகள்",
      mealsLogged: "உணவு பதிவு செய்யப்பட்டது",
      safetyStatus: "பாதுகாப்பு நிலை",
      protected: "பாதுகாக்கப்பட்டது",
      interactionsMonitored: "தொடர்புகள் கண்காணிக்கப்படுகின்றன",
      everythingYouNeed: "உங்களுக்கு தேவையான அனைத்தும்",
      healthyLiving: "ஆரோக்கியமான வாழ்க்கைக்கு",
      simpleTools: "இந்திய பயனர்களுக்காக வடிவமைக்கப்பட்ட எளிய கருவிகள்.",
      trackMedications: "மருந்துகளை கண்காணி",
      trackMedicationsDesc: "அளவு மற்றும் நேர நினைவூட்டல்களுடன் உங்கள் எல்லா மருந்துகளின் பதிவை வைத்திருங்கள்.",
      logYourDiet: "உங்கள் உணவை பதிவு செய்",
      logYourDietDesc: "பருப்பு, சப்பாத்தி, சாதம் போன்ற இந்திய உணவுகளை கண்காணியுங்கள்.",
      checkInteractions: "தொடர்புகளை சரிபார்",
      checkInteractionsDesc: "உணவு-மருந்து தொடர்புகள் பற்றிய உடனடி எச்சரிக்கைகளைப் பெறுங்கள்.",
      whyChoose: "ஏன் தேர்வு செய்ய வேண்டும்",
      benefit1: "உங்கள் மருந்துகளுடன் எந்த உணவுகளை தவிர்க்க வேண்டும் என்று தெரிந்துகொள்ளுங்கள்",
      benefit2: "இந்திய பிராந்திய உணவுகளுடன் ஊட்டச்சத்தை கண்காணியுங்கள்",
      benefit3: "தெளிவான, எளிய சுகாதார பரிந்துரைகளைப் பெறுங்கள்",
      benefit4: "முதியவர்களுக்கு எளிதாக பயன்படுத்த வடிவமைக்கப்பட்டது",
      yourHealthMatters: "உங்கள் ஆரோக்கியம் முக்கியம்",
      yourHealthMattersDesc: "உணவு-மருந்து தொடர்புகள் பற்றி தெரிந்திருங்கள்.",
      checkFoodSafetyNow: "இப்போது உணவு பாதுகாப்பை சரிபார்க்கவும்",
      readyToTakeControl: "உங்கள் ஆரோக்கியத்தை கட்டுப்படுத்த தயாரா?",
      startTracking: "இன்றே உங்கள் மருந்துகள் மற்றும் உணவுகளை கண்காணிக்கத் தொடங்குங்கள்.",
      addFirstMedication: "உங்கள் முதல் மருந்தைச் சேர்க்கவும்",
    },

    // Medications Page
    medications: {
      myMedications: "என் மருந்துகள்",
      trackAndManage: "உங்கள் தினசரி மருந்துகளை கண்காணித்து நிர்வகிக்கவும்",
      addMedication: "மருந்து சேர்",
      addNewMedication: "புதிய மருந்து சேர்",
      medicationName: "மருந்தின் பெயர் *",
      dosage: "அளவு",
      time: "நேரம்",
      frequency: "அதிர்வெண்",
      category: "வகை",
      yourMedications: "உங்கள் மருந்துகள்",
      noMedicationsYet: "இதுவரை மருந்துகள் சேர்க்கப்படவில்லை",
      noMedicationsDesc: "உணவு தொடர்புகளை சரிபார்க்க உங்கள் மருந்துகளைச் சேர்க்கவும்.",
      addFirstMedication: "உங்கள் முதல் மருந்தைச் சேர்க்கவும்",
      quickAddCommon: "பொதுவான மருந்துகளை விரைவாக சேர்",
      searchMedications: "மருந்துகளைத் தேடு...",
      clickToAdd: "உங்கள் பட்டியலில் விரைவாக சேர்க்க கீழே உள்ள எந்த மருந்தையும் கிளிக் செய்யவும்.",
      noMedicationsFound: "மருந்துகள் கிடைக்கவில்லை. வேறு தேடலை முயற்சிக்கவும்.",
      medicationAdded: "மருந்து சேர்க்கப்பட்டது",
      hasBeenAdded: "உங்கள் பட்டியலில் சேர்க்கப்பட்டது.",
      medicationRemoved: "மருந்து நீக்கப்பட்டது",
      hasBeenRemoved: "நீக்கப்பட்டது.",
      pleaseEnterName: "மருந்தின் பெயரை உள்ளிடவும்",
      onceDaily: "தினமும் ஒருமுறை",
      twiceDaily: "தினமும் இருமுறை",
      threeTimesDaily: "தினமும் மூன்று முறை",
      asNeeded: "தேவைப்படும்போது",
    },

    // Reminders
    reminders: {
      medicationReminders: "மருந்து நினைவூட்டல்கள்",
      enableReminders: "மருந்து நினைவூட்டல்களை இயக்கு",
      getNotified: "உங்கள் மருந்துகளை எடுக்க வேண்டிய நேரத்தில் அறிவிப்பைப் பெறுங்கள்",
      enableButton: "நினைவூட்டல்களை இயக்கு",
      active: "செயலில்",
      reminderSet: "நினைவூட்டல் அமைக்கப்பட்டது",
      reminderCancelled: "நினைவூட்டல் ரத்து செய்யப்பட்டது",
      youllBeReminded: "நினைவூட்டப்படும்",
      reminderForCancelled: "{name} க்கான நினைவூட்டல் ரத்து செய்யப்பட்டது",
      remindersEnabled: "நினைவூட்டல்கள் இயக்கப்பட்டன",
      remindersEnabledDesc: "உங்கள் மருந்துகளுக்கான அறிவிப்புகளைப் பெறுவீர்கள்.",
      permissionDenied: "அனுமதி மறுக்கப்பட்டது",
      permissionDeniedDesc: "உலாவி அமைப்புகளில் அறிவிப்புகளை இயக்கவும்.",
      browserNotSupported: "உங்கள் உலாவி அறிவிப்புகளை ஆதரிக்காது.",
      notificationTitle: "மருந்து நினைவூட்டல்",
      notificationBody: "{name} – {dosage} எடுக்க நேரம்",
    },

    // Diet Page
    diet: {
      dietTracker: "உணவு கண்காணிப்பான்",
      logYourMeals: "இந்திய உணவுகளுடன் உங்கள் உணவை பதிவு செய்து ஊட்டச்சத்தை கண்காணியுங்கள்",
      todaysCalories: "இன்றைய கலோரிகள்",
      kcalConsumed: "kcal உட்கொண்டது",
      protein: "புரதம்",
      fromTodaysMeals: "இன்றைய உணவுகளிலிருந்து",
      mealsLogged: "உணவு பதிவு செய்யப்பட்டது",
      itemsToday: "இன்றைய பொருட்கள்",
      addingTo: "சேர்க்கிறது",
      addFood: "உணவு சேர்",
      searchFoods: "உணவுகளைத் தேடு (ஆங்கிலம் அல்லது இந்தி)...",
      allCategories: "அனைத்து வகைகளும்",
      noFoodsFound: "உணவுகள் கிடைக்கவில்லை. வேறு தேடலை முயற்சிக்கவும்.",
      showingFirst20: "முதல் 20 முடிவுகளைக் காட்டுகிறது. மேலும் பார்க்க தேடலை செம்மைப்படுத்தவும்.",
      todaysFoodLog: "இன்றைய உணவு பதிவு",
      noMealsLogged: "இன்று உணவு பதிவு செய்யப்படவில்லை. உணவு சேர்க்கத் தொடங்குங்கள்!",
      noMealLogged: "{meal} பதிவு செய்யப்படவில்லை.",
      foodAdded: "உணவு சேர்க்கப்பட்டது",
      addedTo: "சேர்க்கப்பட்டது",
      removed: "நீக்கப்பட்டது",
      foodRemoved: "இன்றைய பதிவிலிருந்து உணவு பொருள் நீக்கப்பட்டது.",
      breakfast: "காலை உணவு",
      lunch: "மதிய உணவு",
      dinner: "இரவு உணவு",
      snack: "சிற்றுண்டி",
      cal: "கலோரி",
      gProtein: "g புரதம்",
    },

    // Interactions Page
    interactions: {
      foodDrugChecker: "உணவு-மருந்து தொடர்பு சரிபார்ப்பான்",
      addMedicationsFirst: "உணவு தொடர்புகளை சரிபார்க்க முதலில் உங்கள் மருந்துகளைச் சேர்க்கவும்.",
      addYourMedications: "உங்கள் மருந்துகளைச் சேர்க்கவும்",
      foodSafetyChecker: "உணவு பாதுகாப்பு சரிபார்ப்பான்",
      checkWhichFoodsSafe: "உங்கள் மருந்துகளுடன் எந்த உணவுகள் பாதுகாப்பானவை என்று சரிபார்க்கவும்",
      quickFoodSafetyCheck: "🍎 விரைவு உணவு பாதுகாப்பு சரிபார்ப்பு",
      enterFoodName: "உங்கள் மருந்துகளுடன் பாதுகாப்பானதா என்று சரிபார்க்க உணவின் பெயரை உள்ளிடவும்",
      foodPlaceholder: "எ.கா: வாழைப்பழம், திராட்சை, தயிர்...",
      avoid: "தவிர்க்கவும்",
      useCaution: "எச்சரிக்கையுடன் பயன்படுத்தவும்",
      safeToEat: "சாப்பிட பாதுகாப்பானது",
      with: "உடன்",
      noInteractionsFound: "உங்கள் மருந்துகளுடன் அறியப்பட்ட தொடர்புகள் எதுவும் கிடைக்கவில்லை.",
      yourMedications: "உங்கள் மருந்துகள்",
      foodsToAvoid: "தவிர்க்க வேண்டிய உணவுகள்",
      useCautionLabel: "எச்சரிக்கை தேவை",
      safeFoods: "பாதுகாப்பான உணவுகள்",
      searchInteractions: "தொடர்புகளைத் தேடு...",
      importantDisclaimer: "முக்கிய மறுப்பு",
      disclaimerText: "இந்த தகவல் பொதுவான வழிகாட்டுதலுக்கு மட்டுமே. தனிப்பட்ட மருத்துவ ஆலோசனைக்கு எப்போதும் உங்கள் மருத்துவர் அல்லது மருந்தாளரை அணுகவும்.",
    },

    // Settings Page
    settings: {
      settings: "அமைப்புகள்",
      language: "மொழி",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      languageChanged: "மொழி மாற்றப்பட்டது",
      languageChangedTo: "மொழி மாற்றப்பட்டது:",
      appearance: "தோற்றம்",
      darkMode: "டார்க் மோட்",
      darkModeDesc: "கண் அழுத்தத்தைக் குறைக்க இருண்ட நிற தீம் பயன்படுத்தவும்",
      themeChanged: "தீம் மாற்றப்பட்டது",
      darkModeEnabled: "டார்க் மோட் இயக்கப்பட்டது",
      lightModeEnabled: "லைட் மோட் இயக்கப்பட்டது",
    },

    // Feedback Page
    feedback: {
      title: "கருத்து மற்றும் கேள்விகள்",
      description: "உங்களிடம் ஏதேனும் கேள்விகள் அல்லது பிரச்சனைகள் உள்ளதா? எங்களுக்கு ஒரு செய்தியை அனுப்புங்கள்.",
      name: "உங்கள் பெயர்",
      email: "மின்னஞ்சல் முகவரி",
      subject: "பொருள்",
      message: "செய்தி/கேள்வி",
      submit: "செய்தி அனுப்பு",
      successTitle: "செய்தி அனுப்பப்பட்டது",
      successDesc: "உங்கள் கருத்துக்கு நன்றி! நாங்கள் விரைவில் உங்களைத் தொடர்பு கொள்வோம்.",
      errorTitle: "சமர்ப்பிக்க முடியவில்லை",
      errorDesc: "ஏதோ தவறு நடந்துவிட்டது. பின்னர் மீண்டும் முயற்சிக்கவும்.",
      placeholders: {
        name: "உங்கள் பெயரை உள்ளிடவும்",
        email: "எ.கா: example@gmail.com",
        subject: "இது எதைப் பற்றியது?",
        message: "உங்கள் கேள்வி அல்லது பிரச்சனையை விரிவாக விவரிக்கவும்..."
      }
    },

    // Footer
    footer: {
      disclaimer: "⚠️ இந்த பயன்பாடு பொதுவான தகவல்களை மட்டுமே வழங்குகிறது. மருத்துவ ஆலோசனைக்கு எப்போதும் உங்கள் மருத்துவரை அணுகவும்.",
      copyright: "© 2025 MediNutri.",
    },

    // Not Found
    notFound: {
      pageNotFound: "பக்கம் கிடைக்கவில்லை",
      goHome: "முகப்புக்குச் செல்",
    },

    // Auth
    auth: {
      login: "உள்நுழை",
      register: "பதிவு செய்",
      loginTitle: "மீண்டும் வருக",
      loginSubtitle: "உங்கள் சுகாதார சுயவிவரத்தை அணுக உள்நுழையவும்",
      registerTitle: "கணக்கை உருவாக்கு",
      registerSubtitle: "மருந்துகள் மற்றும் உணவை நிர்வகிக்க மெடிநியூட்ரியில் சேரவும்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      name: "முழு பெயர்",
      noAccount: "கணக்கு இல்லையா?",
      hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      loginButton: "உள்நுழை",
      registerButton: "கணக்கை உருவாக்கு",
      loggingIn: "உள்நுழைகிறது...",
      registering: "கணக்கு உருவாக்கப்படுகிறது...",
      logout: "வெளியேறு",
      passwordRequirements: "கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள், எண்கள் மற்றும் எழுத்துக்களைக் கொண்டிருக்க வேண்டும்",
      profile: "பயனர் சுயவிவரம்",
      healthSummary: "சுகாதார சுருக்கம்",
      recentMeals: "சமீபத்திய உணவுகள்",
      activeMedications: "செயலில் உள்ள மருந்துகள்",
      noMedications: "இன்னும் மருந்துகள் சேர்க்கப்படவில்லை",
      noMeals: "இன்று உணவுகள் எதுவும் பதிவு செய்யப்படவில்லை",
      memberSince: "உறுப்பினர் சேர்ந்த தேதி",
    },
    ai: {
      title: "மெடிநியூட்ரி AI", subtitle: "உங்கள் தனிப்பட்ட சுகாதார உதவியாளர்",
      pageTitle: "AI சுகாதார உதவியாளர்", pageDescription: "தனிப்பட்ட உணவு பரிந்துரைகள் மற்றும் மருந்து பாதுகாப்பு சோதனைகள் பெறுங்கள்.",
      clearChat: "அழி", welcomeTitle: "இன்று நான் எப்படி உதவ முடியும்?",
      welcomeDescription: "உணவு திட்டங்கள், உணவு-மருந்து தொடர்புகள் பற்றி கேளுங்கள்.",
      medicationsTracked: "மருந்துகள் கண்காணிக்கப்படுகின்றன", thinking: "யோசிக்கிறது...",
      inputPlaceholder: "உணவு, மருந்துகள் பற்றி கேளுங்கள்...",
      disclaimer: "மருத்துவ ஆலோசனைக்கு உங்கள் மருத்துவரை அணுகவும்.",
      medications: "மருந்துகள்", caloriesConsumed: "இன்றைய கலோரிகள்", proteinConsumed: "இன்றைய புரதம்", mealsTracked: "இன்றைய உணவுகள்",
      yourCurrentMedications: "உங்கள் தற்போதைய மருந்துகள்", medicationsNote: "AI இந்த மருந்துகளை பரிசீலிக்கும்.",
      healthProfile: "சுகாதார சுயவிவரம்", completeProfile: "தனிப்பட்ட பரிந்துரைகளுக்கு சுயவிவரத்தை நிரப்பவும்",
      addProfile: "சுயவிவரம் சேர்", age: "வயது", gender: "பாலினம்", weight: "எடை", height: "உயரம்",
      weightKg: "எடை (kg)", heightCm: "உயரம் (cm)", select: "தேர்வு", male: "ஆண்", female: "பெண்", other: "மற்றவை",
      activityLevel: "செயல்பாட்டு நிலை", sedentary: "அமர்ந்திருப்பது", lightActive: "லேசான", moderateActive: "மிதமான", active: "செயலில்", veryActive: "மிகவும் செயலில்",
      dietType: "உணவு வகை", vegetarian: "சைவம்", nonVegetarian: "அசைவம்", vegan: "வீகன்", eggetarian: "முட்டை சைவம்",
      primaryGoal: "முதன்மை இலக்கு", weightLoss: "எடை குறைப்பு", weightGain: "எடை அதிகரிப்பு", maintainWeight: "எடை பராமரிப்பு",
      manageDiabetes: "நீரிழிவு மேலாண்மை", heartHealth: "இதய ஆரோக்கியம்", generalWellness: "பொது நலம்",
      underweight: "குறைந்த எடை", normal: "சாதாரண", overweight: "அதிக எடை", obese: "பருமன்",
      activity: "செயல்பாடு", diet: "உணவு", goal: "இலக்கு",
      suggestDietPlan: "இன்றைய உணவை பகுப்பாய்வு செய்யுங்கள்",
      whatFoodsAvoid: "தற்போதைய மருந்துகளுடன் என்ன உணவுகள் ஊடாடுகின்றன?",
      checkFoodSafe: "Metformin மருந்தின் பக்க விளைவுகள் என்ன?",
      breakfastSuggestion: "திராட்சை சாப்பிடுவது பாதுகாப்பானதா?",
      explainInteraction: "எனது மருந்து தொடர்புகளை சரிபார்க்கவும்",
    },
  },

  hi: {
    // Common
    common: {
      appName: "मेडीन्यूट्री",
      tagline: "समझदारी से खाएं। सुरक्षित रहें।",
      save: "सेव करें",
      cancel: "रद्द करें",
      add: "जोड़ें",
      remove: "हटाएं",
      search: "खोजें",
      all: "सभी",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल",
      confirm: "पुष्टि करें",
      back: "वापस",
      next: "अगला",
      learnMore: "और जानें",
      check: "जांचें",
    },

    // Navigation
    nav: {
      home: "होम",
      medications: "दवाइयां",
      diet: "आहार",
      checkSafety: "सुरक्षा जांचें",
      aiAssistant: "AI सहायक",
      drugSafety: "दवा सुरक्षा",
      settings: "सेटिंग्स",
    },

    // Drug Safety Page (Hindi)
    drugSafety: {
      title: "दवा सुरक्षा",
      description: "दुष्प्रभाव और सुरक्षा की जांच के लिए दवाएं खोजें।",
      searchPlaceholder: "दवा खोजें...",
      sideEffects: "दुष्प्रभाव",
      severeSideEffects: "गंभीर दुष्प्रभाव",
      commonSideEffects: "सामान्य दुष्प्रभाव",
      medicalCondition: "उपयोग",
      warnings: "चेतावनी",
      rating: "रेटिंग",
      pregnancy: "गर्भावस्था",
      alcohol: "शराब",
      rxOtc: "Rx/OTC",
      noResults: "दवाएं नहीं मिलीं।",
      searchToView: "सुरक्षा प्रोफ़ाइल देखने के लिए खोजें",
    },

    // Home Page
    home: {
      personalHealthCompanion: "आपका व्यक्तिगत स्वास्थ्य साथी",
      heroTitle1: "समझदारी से खाएं।",
      heroTitle2: "सुरक्षित रहें।",
      heroDescription: "MediNutri खतरनाक खाद्य-दवा इंटरैक्शन से आपकी रक्षा करते हुए आपकी दवाओं और आहार को प्रबंधित करने में मदद करता है।",
      getStarted: "शुरू करें",
      checkSafety: "सुरक्षा जांचें",
      yourMedications: "आपकी दवाइयां",
      activeMedicines: "सक्रिय दवाइयां",
      todaysCalories: "आज की कैलोरी",
      mealsLogged: "भोजन दर्ज किया",
      safetyStatus: "सुरक्षा स्थिति",
      protected: "सुरक्षित",
      interactionsMonitored: "इंटरैक्शन की निगरानी",
      everythingYouNeed: "आपको जो कुछ भी चाहिए",
      healthyLiving: "स्वस्थ जीवन के लिए",
      simpleTools: "भारतीय उपयोगकर्ताओं के लिए विशेष रूप से डिज़ाइन किए गए सरल उपकरण।",
      trackMedications: "दवाइयां ट्रैक करें",
      trackMedicationsDesc: "खुराक और समय अनुस्मारक के साथ अपनी सभी दवाओं का रिकॉर्ड रखें।",
      logYourDiet: "अपना आहार लॉग करें",
      logYourDietDesc: "दाल, चपाती, चावल जैसे भारतीय खाद्य पदार्थों को ट्रैक करें।",
      checkInteractions: "इंटरैक्शन जांचें",
      checkInteractionsDesc: "खाद्य-दवा इंटरैक्शन के बारे में तत्काल चेतावनी प्राप्त करें।",
      whyChoose: "क्यों चुनें",
      benefit1: "जानें कि अपनी दवाओं के साथ कौन से खाद्य पदार्थ न खाएं",
      benefit2: "भारतीय क्षेत्रीय खाद्य पदार्थों के साथ पोषण ट्रैक करें",
      benefit3: "स्पष्ट, सरल स्वास्थ्य सिफारिशें प्राप्त करें",
      benefit4: "बुजुर्गों के आसान उपयोग के लिए डिज़ाइन किया गया",
      yourHealthMatters: "आपका स्वास्थ्य मायने रखता है",
      yourHealthMattersDesc: "खाद्य-दवा इंटरैक्शन के बारे में जानकारी रखें।",
      checkFoodSafetyNow: "अभी खाद्य सुरक्षा जांचें",
      readyToTakeControl: "अपने स्वास्थ्य को नियंत्रित करने के लिए तैयार?",
      startTracking: "आज ही अपनी दवाओं और भोजन को ट्रैक करना शुरू करें।",
      addFirstMedication: "अपनी पहली दवा जोड़ें",
    },

    // Medications Page
    medications: {
      myMedications: "मेरी दवाइयां",
      trackAndManage: "अपनी दैनिक दवाओं को ट्रैक और प्रबंधित करें",
      addMedication: "दवा जोड़ें",
      addNewMedication: "नई दवा जोड़ें",
      medicationName: "दवा का नाम *",
      dosage: "खुराक",
      time: "समय",
      frequency: "आवृत्ति",
      category: "श्रेणी",
      yourMedications: "आपकी दवाइयां",
      noMedicationsYet: "अभी तक कोई दवा नहीं जोड़ी गई",
      noMedicationsDesc: "खाद्य इंटरैक्शन जांचने के लिए अपनी दवाएं जोड़ें।",
      addFirstMedication: "अपनी पहली दवा जोड़ें",
      quickAddCommon: "सामान्य दवाएं जल्दी जोड़ें",
      searchMedications: "दवाएं खोजें...",
      clickToAdd: "अपनी सूची में जल्दी जोड़ने के लिए नीचे किसी भी दवा पर क्लिक करें।",
      noMedicationsFound: "कोई दवा नहीं मिली। कोई अन्य खोज आज़माएं।",
      medicationAdded: "दवा जोड़ी गई",
      hasBeenAdded: "आपकी सूची में जोड़ दी गई है।",
      medicationRemoved: "दवा हटाई गई",
      hasBeenRemoved: "हटा दी गई है।",
      pleaseEnterName: "कृपया दवा का नाम दर्ज करें",
      onceDaily: "दिन में एक बार",
      twiceDaily: "दिन में दो बार",
      threeTimesDaily: "दिन में तीन बार",
      asNeeded: "आवश्यकतानुसार",
    },

    // Reminders
    reminders: {
      medicationReminders: "दवा अनुस्मारक",
      enableReminders: "दवा अनुस्मारक सक्षम करें",
      getNotified: "जब आपकी दवाइयां लेने का समय हो तो सूचना प्राप्त करें",
      enableButton: "अनुस्मारक सक्षम करें",
      active: "सक्रिय",
      reminderSet: "अनुस्मारक सेट किया गया",
      reminderCancelled: "अनुस्मारक रद्द किया गया",
      youllBeReminded: "आपको याद दिलाया जाएगा",
      reminderForCancelled: "{name} के लिए अनुस्मारक रद्द कर दिया गया",
      remindersEnabled: "अनुस्मारक सक्षम किए गए",
      remindersEnabledDesc: "आपको अपनी दवाओं के लिए सूचनाएं मिलेंगी।",
      permissionDenied: "अनुमति अस्वीकृत",
      permissionDeniedDesc: "कृपया ब्राउज़र सेटिंग्स में सूचनाएं सक्षम करें।",
      browserNotSupported: "आपका ब्राउज़र सूचनाओं का समर्थन नहीं करता।",
      notificationTitle: "दवा अनुस्मारक",
      notificationBody: "{name} – {dosage} लेने का समय",
    },

    // Diet Page
    diet: {
      dietTracker: "आहार ट्रैकर",
      logYourMeals: "भारतीय खाद्य पदार्थों के साथ अपने भोजन को लॉग करें और पोषण ट्रैक करें",
      todaysCalories: "आज की कैलोरी",
      kcalConsumed: "kcal खपत",
      protein: "प्रोटीन",
      fromTodaysMeals: "आज के भोजन से",
      mealsLogged: "भोजन लॉग किया",
      itemsToday: "आज की आइटम",
      addingTo: "जोड़ रहे हैं",
      addFood: "खाना जोड़ें",
      searchFoods: "खाद्य पदार्थ खोजें (अंग्रेजी या हिंदी)...",
      allCategories: "सभी श्रेणियां",
      noFoodsFound: "कोई खाद्य पदार्थ नहीं मिला। कोई अन्य खोज आज़माएं।",
      showingFirst20: "पहले 20 परिणाम दिखा रहे हैं। और देखने के लिए खोज परिष्कृत करें।",
      todaysFoodLog: "आज का खाद्य लॉग",
      noMealsLogged: "आज कोई भोजन लॉग नहीं किया। खाना जोड़ना शुरू करें!",
      noMealLogged: "कोई {meal} लॉग नहीं किया।",
      foodAdded: "खाना जोड़ा गया",
      addedTo: "में जोड़ा गया",
      removed: "हटाया गया",
      foodRemoved: "आज के लॉग से खाद्य आइटम हटा दिया गया।",
      breakfast: "नाश्ता",
      lunch: "दोपहर का भोजन",
      dinner: "रात का भोजन",
      snack: "स्नैक",
      cal: "कैलोरी",
      gProtein: "g प्रोटीन",
    },

    // Interactions Page
    interactions: {
      foodDrugChecker: "खाद्य-दवा इंटरैक्शन चेकर",
      addMedicationsFirst: "खाद्य इंटरैक्शन जांचने के लिए पहले अपनी दवाएं जोड़ें।",
      addYourMedications: "अपनी दवाएं जोड़ें",
      foodSafetyChecker: "खाद्य सुरक्षा चेकर",
      checkWhichFoodsSafe: "जांचें कि आपकी दवाओं के साथ कौन से खाद्य पदार्थ सुरक्षित हैं",
      quickFoodSafetyCheck: "🍎 त्वरित खाद्य सुरक्षा जांच",
      enterFoodName: "यह जांचने के लिए खाद्य का नाम दर्ज करें कि यह आपकी दवाओं के साथ सुरक्षित है या नहीं",
      foodPlaceholder: "जैसे: केला, चकोतरा, दही...",
      avoid: "बचें",
      useCaution: "सावधानी बरतें",
      safeToEat: "खाने के लिए सुरक्षित",
      with: "के साथ",
      noInteractionsFound: "आपकी दवाओं के साथ कोई ज्ञात इंटरैक्शन नहीं मिला।",
      yourMedications: "आपकी दवाइयां",
      foodsToAvoid: "बचने वाले खाद्य पदार्थ",
      useCautionLabel: "सावधानी बरतें",
      safeFoods: "सुरक्षित खाद्य पदार्थ",
      searchInteractions: "इंटरैक्शन खोजें...",
      importantDisclaimer: "महत्वपूर्ण अस्वीकरण",
      disclaimerText: "यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। व्यक्तिगत चिकित्सा सलाह के लिए हमेशा अपने डॉक्टर या फार्मासिस्ट से परामर्श करें।",
    },

    // Settings Page
    settings: {
      settings: "सेटिंग्स",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
      languageChanged: "भाषा बदली गई",
      languageChangedTo: "भाषा बदली गई:",
      appearance: "दिखावट",
      darkMode: "डार्क मोड",
      darkModeDesc: "आंखों पर कम तनाव के लिए गहरे रंग की थीम पर स्विच करें",
      themeChanged: "थीम बदली गई",
      darkModeEnabled: "डार्क मोड सक्षम",
      lightModeEnabled: "लाइट मोड सक्षम",
    },

    // Feedback Page
    feedback: {
      title: "प्रतिक्रिया और प्रश्न",
      description: "क्या आपके पास कोई प्रश्न है या कोई समस्या है? हमें संदेश भेजें और हम आपसे संपर्क करेंगे।",
      name: "आपका नाम",
      email: "ईमेल पता",
      subject: "विषय",
      message: "संदेश/प्रश्न",
      submit: "संदेश भेजें",
      successTitle: "संदेश भेजा गया",
      successDesc: "आपकी प्रतिक्रिया के लिए धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।",
      errorTitle: "सबमिट करने में विफल",
      errorDesc: "कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।",
      placeholders: {
        name: "अपना नाम दर्ज करें",
        email: "जैसे, example@gmail.com",
        subject: "यह किसके बारे में है?",
        message: "अपने प्रश्न या समस्या का विस्तार से वर्णन करें..."
      }
    },

    // Footer
    footer: {
      disclaimer: "⚠️ यह ऐप केवल सामान्य जानकारी प्रदान करता है। चिकित्सा सलाह के लिए हमेशा अपने डॉक्टर से परामर्श करें।",
      copyright: "© 2025 MediNutri.",
    },

    // Not Found
    notFound: {
      pageNotFound: "पेज नहीं मिला",
      goHome: "होम जाएं",
    },

    // Auth
    auth: {
      login: "लॉगिन",
      register: "रजिस्टर",
      loginTitle: "स्वागत है",
      loginSubtitle: "अपने स्वास्थ्य प्रोफ़ाइल तक पहुँचने के लिए साइन इन करें",
      registerTitle: "खाता बनाएँ",
      registerSubtitle: "दवाओं और आहार प्रबंधन के लिए मेडीन्यूट्री से जुड़ें",
      email: "ईमेल पता",
      password: "पासवर्ड",
      name: "पूरा नाम",
      noAccount: "खाता नहीं है?",
      hasAccount: "पहले से ही खाता है?",
      loginButton: "लॉगिन",
      registerButton: "खाता बनाएँ",
      loggingIn: "लॉगिन हो रहा है...",
      registering: "खाता बनाया जा रहा है...",
      logout: "लॉगआउट",
      passwordRequirements: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए जिसमें अक्षर और अंक दोनों हों",
      profile: "यूज़र प्रोफ़ाइल",
      healthSummary: "स्वास्थ्य सारांश",
      recentMeals: "हाल के भोजन",
      activeMedications: "सक्रिय दवाएं",
      noMedications: "अभी तक कोई दवा नहीं जोड़ी गई",
      noMeals: "आज कोई भोजन दर्ज नहीं किया गया",
      memberSince: "सदस्य बने",
    },
    ai: {
      title: "मेडीन्यूट्री AI", subtitle: "आपका व्यक्तिगत स्वास्थ्य सहायक",
      pageTitle: "AI स्वास्थ्य सहायक", pageDescription: "अपने प्रोफ़ाइल और दवाओं के आधार पर व्यक्तिगत आहार सुझाव प्राप्त करें।",
      clearChat: "साफ करें", welcomeTitle: "आज मैं आपकी कैसे मदद कर सकता हूं?",
      welcomeDescription: "आहार योजना, खाद्य-दवा इंटरैक्शन के बारे में पूछें।",
      medicationsTracked: "दवाइयां ट्रैक की गईं", thinking: "सोच रहा है...",
      inputPlaceholder: "आहार, दवाओं के बारे में पूछें...",
      disclaimer: "चिकित्सा सलाह के लिए हमेशा अपने डॉक्टर से परामर्श करें।",
      medications: "दवाइयां", caloriesConsumed: "आज की कैलोरी", proteinConsumed: "आज का प्रोटीन", mealsTracked: "आज के भोजन",
      yourCurrentMedications: "आपकी वर्तमान दवाइयां", medicationsNote: "AI आहार सुझाव देते समय इन दवाओं पर विचार करता है।",
      healthProfile: "स्वास्थ्य प्रोफ़ाइल", completeProfile: "व्यक्तिगत सुझावों के लिए प्रोफ़ाइल पूरी करें",
      addProfile: "प्रोफ़ाइल जोड़ें", age: "उम्र", gender: "लिंग", weight: "वजन", height: "ऊंचाई",
      weightKg: "वजन (kg)", heightCm: "ऊंचाई (cm)", select: "चुनें", male: "पुरुष", female: "महिला", other: "अन्य",
      activityLevel: "गतिविधि स्तर", sedentary: "बैठे रहना", lightActive: "हल्का सक्रिय", moderateActive: "मध्यम सक्रिय", active: "सक्रिय", veryActive: "बहुत सक्रिय",
      dietType: "आहार प्रकार", vegetarian: "शाकाहारी", nonVegetarian: "मांसाहारी", vegan: "वीगन", eggetarian: "अंडा शाकाहारी",
      primaryGoal: "प्राथमिक लक्ष्य", weightLoss: "वजन घटाना", weightGain: "वजन बढ़ाना", maintainWeight: "वजन बनाए रखना",
      manageDiabetes: "मधुमेह प्रबंधन", heartHealth: "हृदय स्वास्थ्य", generalWellness: "सामान्य स्वास्थ्य",
      underweight: "कम वजन", normal: "सामान्य", overweight: "अधिक वजन", obese: "मोटापा",
      activity: "गतिविधि", diet: "आहार", goal: "लक्ष्य",
      suggestDietPlan: "आज मेरे आहार का विश्लेषण करें",
      whatFoodsAvoid: "मेरी दवाओं के साथ क्या नहीं खाना चाहिए?",
      checkFoodSafe: "Metformin (मेटफॉर्मिन) के दुष्प्रभाव क्या हैं?",
      breakfastSuggestion: "क्या अंगूर खाना सुरक्षित है?",
      explainInteraction: "मेरी दवाओं के इंटरैक्शन की जाँच करें",
    },
  },
};

export type TranslationKeys = typeof translations.en;
