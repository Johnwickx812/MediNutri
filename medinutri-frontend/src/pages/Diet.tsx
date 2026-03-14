import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { indianFoods, Food } from "@/data/foods";
import { foodDrugInteractions, checkFoodSafety } from "@/data/interactions";
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  BarChart3,
  Search,
  Settings2,
  Calendar,
  ChevronRight,
  Info,
  History
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

// Dashboard Components
import { StatCards } from "@/components/diet/StatCards";
import { WeeklyCalendar } from "@/components/diet/WeeklyCalendar";
import { MealCard } from "@/components/diet/MealCard";
import { SafetyAlerts } from "@/components/diet/SafetyAlerts";
import { MacroDistribution } from "@/components/diet/MacroDistribution";
import { AIDietEngine } from "@/components/diet/AIDietEngine";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { API_URL } from "@/config";
import { useNavigate } from "react-router-dom";

const weightData = [
  { date: "Oct", weight: 75.5 },
  { date: "Nov", weight: 74.8 },
  { date: "Dec", weight: 74.2 },
  { date: "Jan", weight: 73.5 },
  { date: "Feb", weight: 72.9 },
  { date: "Mar", weight: 72.5 },
];

export default function Diet() {
  const {
    addMeal,
    getTodaysMeals,
    getTodaysCalories,
    getTodaysProtein,
    getTodaysCarbs,
    getTodaysFat,
    mealLog
  } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");

  // Targets from user profile
  const targets = {
    calories: user?.calorieGoal || 2000,
    protein: user?.proteinGoal || 150,
    carbs: user?.carbGoal || 200,
    fat: user?.fatGoal || 65
  };

  const currentStats = {
    calories: getTodaysCalories(),
    protein: getTodaysProtein(),
    carbs: getTodaysCarbs(),
    fat: getTodaysFat()
  };

  const todaysMeals = getTodaysMeals();

  // Calculate safety alerts for today's meals
  const safetyAlerts = useMemo(() => {
    if (!user?.medications || user.medications.length === 0) return [];

    const medicationNames: string[] = Array.isArray(user.medications)
      ? user.medications.map((m: any) =>
          typeof m === "string" ? m : (m.name || m.medication_name || "")
        ).filter(Boolean)
      : [];

    if (medicationNames.length === 0) return [];

    const alerts: any[] = [];
    todaysMeals.forEach(meal => {
      const safety = checkFoodSafety(meal.food.name, medicationNames);
      if (safety.interactions.length > 0) {
        safety.interactions.forEach(interaction => {
          if (!alerts.find(a => a.food === meal.food.name && a.medication === interaction.medicationName)) {
            alerts.push({
              medication: interaction.medicationName,
              food: meal.food.name,
              severity: interaction.severity,
              reason: interaction.reason,
              recommendation: interaction.recommendation
            });
          }
        });
      }
    });
    return alerts;
  }, [todaysMeals, user?.medications]);

  const loggedDates = useMemo(() => {
    const dates = new Set(mealLog.map(m => m.date));
    return Array.from(dates);
  }, [mealLog]);

  const handleSelectFood = async (foodName: string, rawName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/food/${encodeURIComponent(foodName)}`);
      const data = await response.json();

      if (data.success && data.food) {
        const foodItem = data.food;
        const newFood: Food = {
          id: Date.now().toString(),
          name: foodItem.Food || foodName,
          calories: parseFloat(foodItem.calories || '0'),
          protein: parseFloat(foodItem.protein || '0'),
          carbs: parseFloat(foodItem.carbs || '0'),
          fat: parseFloat(foodItem.fat || '0'),
          fiber: parseFloat(foodItem.fiber || '0'),
          category: foodItem.food_group_nin || "Other",
        };

        setSelectedFood(newFood);
        setShowQuantitySelector(true);
      }
    } catch (error) {
      // Fallback to local data
      const localFood = indianFoods.find(f => f.name === foodName);
      if (localFood) {
        setSelectedFood(localFood);
        setShowQuantitySelector(true);
      }
    }
  };

  const handleAddWithQuantity = (food: Food, quantity: number, unit: string) => {
    addMeal(food, selectedMealType);
    toast({
      title: "Food Added",
      description: `${food.name} (${quantity}${unit}) added to ${selectedMealType}`,
    });
    setShowQuantitySelector(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navigation / Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0">
                <LayoutDashboard className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              MediNutri <span className="text-primary">Diet</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Medical-Grade Nutrition Tracking</p>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0">
            <Button
              variant="outline"
              className="rounded-xl md:rounded-2xl h-10 md:h-12 border-slate-200 dark:border-white/5 font-bold gap-2 text-xs md:text-sm px-4 md:px-6"
              onClick={() => navigate("/diet-goals")}
            >
              <Settings2 className="h-3 w-3 md:h-4 md:w-4" />
              Goals
            </Button>
            <Button className="rounded-xl md:rounded-2xl h-10 md:h-12 px-4 md:px-6 font-black gap-2 shadow-lg shadow-primary/20 text-xs md:text-sm">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              AI Connect
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl md:rounded-[2.5rem] h-14 md:h-16 w-full flex overflow-x-auto overflow-y-hidden justify-start md:justify-center border dark:border-white/5">
            <TabsTrigger value="dashboard" className="rounded-xl md:rounded-[2rem] px-4 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-bold gap-2 whitespace-nowrap text-xs md:text-sm shrink-0">
              <LayoutDashboard className="h-3 w-3 md:h-4 md:w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="log" className="rounded-xl md:rounded-[2rem] px-4 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-bold gap-2 whitespace-nowrap text-xs md:text-sm shrink-0">
              <PlusCircle className="h-3 w-3 md:h-4 md:w-4" /> Log Meal
            </TabsTrigger>
            <TabsTrigger value="plan" className="rounded-xl md:rounded-[2rem] px-4 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-bold gap-2 whitespace-nowrap text-xs md:text-sm shrink-0">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" /> AI Plan
            </TabsTrigger>
            <TabsTrigger value="insights" className="rounded-xl md:rounded-[2rem] px-4 md:px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg font-bold gap-2 whitespace-nowrap text-xs md:text-sm shrink-0">
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4" /> Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Stat Cards */}
            <StatCards targets={targets} current={currentStats} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (8 units) */}
              <div className="lg:col-span-8 space-y-8">
                {/* 2. Weekly Calendar */}
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Weekly Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <WeeklyCalendar
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      loggedDates={loggedDates}
                    />
                  </CardContent>
                </Card>

                {/* 3. Today's Meal Plan */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black tracking-tight dark:text-white">Today's Meal Plan</h2>
                    <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-widest gap-1">
                      Full Schedule <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <MealCard
                      type="Breakfast"
                      time="08:00 AM"
                      totalCalories={todaysMeals.filter(m => m.mealType === 'breakfast').reduce((sum, m) => sum + m.food.calories, 0)}
                      isLogged={todaysMeals.some(m => m.mealType === 'breakfast')}
                      items={todaysMeals.filter(m => m.mealType === 'breakfast').map(m => ({
                        food: m.food.name,
                        quantity: "1 serving",
                        calories: m.food.calories,
                        protein: m.food.protein,
                        carbs: m.food.carbs,
                        fat: m.food.fat,
                        safetyStatus: checkFoodSafety(
                          m.food.name,
                          (Array.isArray(user?.medications)
                            ? (user?.medications as any[]).map((med: any) =>
                                typeof med === "string" ? med : (med.name || med.medication_name || "")
                              ).filter(Boolean)
                            : [])
                        ).isSafe ? "safe" : "caution"
                      }))}
                      onAdd={() => { setSelectedMealType("breakfast"); setActiveTab("log"); }}
                    />
                    <MealCard
                      type="Morning Snack"
                      time="11:00 AM"
                      totalCalories={todaysMeals.filter(m => m.mealType === 'snack' && m.timestamp < 12 * 3600 * 1000).reduce((sum, m) => sum + m.food.calories, 0)}
                      isLogged={todaysMeals.some(m => m.mealType === 'snack')}
                      items={[]}
                      onAdd={() => { setSelectedMealType("snack"); setActiveTab("log"); }}
                    />
                    <MealCard
                      type="Lunch"
                      time="01:30 PM"
                      totalCalories={todaysMeals.filter(m => m.mealType === 'lunch').reduce((sum, m) => sum + m.food.calories, 0)}
                      isLogged={todaysMeals.some(m => m.mealType === 'lunch')}
                      items={todaysMeals.filter(m => m.mealType === 'lunch').map(m => ({
                        food: m.food.name,
                        quantity: "1 plate",
                        calories: m.food.calories,
                        protein: m.food.protein,
                        carbs: m.food.carbs,
                        fat: m.food.fat,
                        safetyStatus: "safe"
                      }))}
                      onAdd={() => { setSelectedMealType("lunch"); setActiveTab("log"); }}
                    />
                    <MealCard
                      type="Dinner"
                      time="08:30 PM"
                      totalCalories={todaysMeals.filter(m => m.mealType === 'dinner').reduce((sum, m) => sum + m.food.calories, 0)}
                      isLogged={todaysMeals.some(m => m.mealType === 'dinner')}
                      items={[]}
                      onAdd={() => { setSelectedMealType("dinner"); setActiveTab("log"); }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (4 units) */}
              <div className="lg:col-span-4 space-y-8">
                {/* 4. Macro Distribution */}
                <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-xl">Macro Distribution</CardTitle>
                    <CardDescription>Planned for today</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <MacroDistribution
                      protein={currentStats.protein}
                      carbs={currentStats.carbs}
                      fat={currentStats.fat}
                    />
                    <div className="grid grid-cols-1 gap-3 mt-6">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs font-bold dark:text-white">Protein</span>
                        </div>
                        <span className="text-xs font-black dark:text-white">{Math.round(currentStats.protein)}g / {targets.protein}g</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold dark:text-white">Carbs</span>
                        </div>
                        <span className="text-xs font-black dark:text-white">{Math.round(currentStats.carbs)}g / {targets.carbs}g</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-bold dark:text-white">Fat</span>
                        </div>
                        <span className="text-xs font-black dark:text-white">{Math.round(currentStats.fat)}g / {targets.fat}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 5. Safety Alerts */}
                <SafetyAlerts
                  medications={user?.medications || []}
                  alerts={safetyAlerts}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="log" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
              <div className="bg-primary/5 p-12 border-b dark:border-white/5">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase">Add Food to {selectedMealType}</h2>
                    <p className="text-slate-500 font-bold tracking-widest text-xs">Search 8,000+ Indian & International items</p>
                  </div>

                  <div className="relative z-50">
                    <Autocomplete
                      type="food"
                      placeholder="Search (e.g. Oats, Dal, Paneer, Chicken...)"
                      onSelect={handleSelectFood}
                      className="w-full h-16 text-xl rounded-full border-2 border-primary bg-white dark:bg-slate-800 dark:text-white shadow-2xl shadow-primary/10"
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {["Breakfast", "Lunch", "Dinner", "Snack"].map(type => (
                      <Button
                        key={type}
                        variant={selectedMealType === type.toLowerCase() ? "default" : "outline"}
                        className="rounded-full h-10 px-6 font-bold"
                        onClick={() => setSelectedMealType(type.toLowerCase() as any)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <CardContent className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-full">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                      <History className="h-4 w-4" /> Recent Foods
                    </h3>
                  </div>
                  {indianFoods.slice(0, 6).map((food) => (
                    <div
                      key={food.id}
                      onClick={() => { setSelectedFood(food); setShowQuantitySelector(true); }}
                      className="group p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-primary/30 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg dark:text-white group-hover:text-primary transition-colors">{food.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{food.category}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                          <PlusCircle className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Kcal</p>
                          <p className="text-xs font-bold dark:text-white">{food.calories}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">P</p>
                          <p className="text-xs font-bold dark:text-white">{food.protein}g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">C</p>
                          <p className="text-xs font-bold dark:text-white">{food.carbs}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIDietEngine />
          </TabsContent>

          <TabsContent value="insights" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <CardTitle>Weight Trend (kg)</CardTitle>
                  <CardDescription>Last 6 months progression</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} domain={['dataMin - 5', 'dataMax + 5']} />
                      <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <CardTitle>Daily Average</CardTitle>
                  <CardDescription>Calorie intake patterns</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Calories</p>
                    <p className="text-5xl md:text-6xl font-black text-primary">1,745</p>
                    <p className="text-xs font-bold text-emerald-500 mt-2">Within Target Range ✓</p>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2 border-none shadow-xl bg-primary text-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Weekly Health Report</h2>
                    <p className="text-white/70 font-bold max-w-md">Download your full nutrition and medication safety report to share with your doctor.</p>
                  </div>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl px-12 h-16 text-xl font-black gap-2 shadow-2xl">
                    <BarChart3 className="h-6 w-6" />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showQuantitySelector && selectedFood && (
        <QuantitySelector
          food={selectedFood}
          isOpen={showQuantitySelector}
          onClose={() => setShowQuantitySelector(false)}
          onAdd={handleAddWithQuantity}
        />
      )}
    </div>
  );
}