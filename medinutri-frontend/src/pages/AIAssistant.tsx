/**
 * AI Assistant Page
 * 
 * Main page for the MediNutri AI Assistant feature.
 * Provides AI-powered diet, medication, and health guidance.
 */

import { AIChat } from "@/components/ai/AIChat";
import { UserProfileCard } from "@/components/ai/UserProfileCard";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Utensils, Shield, Brain } from "lucide-react";

export default function AIAssistant() {
  const { t } = useLanguage();
  const { userMedications, getTodaysCalories, getTodaysProtein, getTodaysMeals } = useApp();

  const todaysMeals = getTodaysMeals();
  const totalCalories = getTodaysCalories();
  const totalProtein = getTodaysProtein();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t.ai.pageTitle}</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t.ai.pageDescription}
        </p>
      </div>

      {/* Context summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 md:gap-3 text-center sm:text-left">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Pill className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold leading-none">{userMedications.length}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">{t.ai.medications}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 md:gap-3 text-center sm:text-left">
            <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
              <Utensils className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold leading-none">{Math.round(totalCalories)}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">{t.ai.caloriesConsumed}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 md:gap-3 text-center sm:text-left">
            <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
              <span className="h-4 w-4 md:h-5 md:w-5 text-green-500 font-bold text-xs md:text-sm flex items-center justify-center">P</span>
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold leading-none">{Math.round(totalProtein)}g</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">{t.ai.proteinConsumed}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 md:gap-3 text-center sm:text-left">
            <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl md:text-2xl font-bold leading-none">{todaysMeals.length}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">{t.ai.mealsTracked}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Profile */}
        <div className="lg:col-span-1">
          <UserProfileCard />
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-3">
          <AIChat />
        </div>
      </div>

      {/* Current medications display */}
      {userMedications.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="h-5 w-5" />
              {t.ai.yourCurrentMedications}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userMedications.map((med) => (
                <Badge key={med.id} variant="secondary" className="text-sm">
                  {med.name} - {med.dosage}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t.ai.medicationsNote}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
