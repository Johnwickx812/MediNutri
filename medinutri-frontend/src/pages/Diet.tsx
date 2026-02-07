import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FoodCard } from "@/components/cards/FoodCard";
import { StatCard } from "@/components/ui/stat-card";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { indianFoods, foodCategories, Food } from "@/data/foods";
import {
  UtensilsCrossed,
  Search,
  Flame,
  Beef,
  Trash2,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const mealIcons: Record<MealType, typeof Sun> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Sunset,
  snack: Moon,
};

export default function Diet() {
  const { addMeal, getTodaysMeals, getTodaysCalories, getTodaysProtein, removeMeal } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMealType, setSelectedMealType] = useState<MealType>("lunch");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const todaysMeals = getTodaysMeals();

  // Meal labels with translations
  const mealLabels: Record<MealType, string> = {
    breakfast: t.diet.breakfast,
    lunch: t.diet.lunch,
    dinner: t.diet.dinner,
    snack: t.diet.snack,
  };

  const filteredFoods = indianFoods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.nameHindi && food.nameHindi.includes(searchQuery));
    const matchesCategory =
      selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFood = (food: Food) => {
    setSelectedFood(food);
    setShowQuantitySelector(true);
  };

  const handleAddWithQuantity = (food: Food, quantity: number, unit: string) => {
    addMeal(food, selectedMealType);
    toast({
      title: t.diet.foodAdded,
      description: `${food.name} (${quantity}${unit}) ${t.diet.addedTo} ${mealLabels[selectedMealType]}`,
    });
  };

  const handleSelectFood = async (foodName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/food/${encodeURIComponent(foodName)}`);
      const data = await response.json();

      if (data.success && data.food) {
        const foodItem = data.food;
        // Create a Food object from API data
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

        // Open quantity selector instead of directly adding
        setSelectedFood(newFood);
        setShowQuantitySelector(true);
      }
    } catch (error) {
      console.error("Failed to fetch food details", error);
      toast({
        title: "Error",
        description: "Failed to fetch food details",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMeal = (id: string) => {
    removeMeal(id);
    toast({
      title: t.diet.removed,
      description: t.diet.foodRemoved,
    });
  };

  const getMealsByType = (type: MealType) => {
    return todaysMeals.filter((meal) => meal.mealType === type);
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          {t.diet.dietTracker}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.diet.logYourMeals}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.diet.todaysCalories}
          value={Math.round(getTodaysCalories())}
          subtitle={t.diet.kcalConsumed}
          icon={Flame}
        />
        <StatCard
          title={t.diet.protein}
          value={`${Math.round(getTodaysProtein())}g`}
          subtitle={t.diet.fromTodaysMeals}
          icon={Beef}
        />
        <StatCard
          title={t.diet.mealsLogged}
          value={todaysMeals.length}
          subtitle={t.diet.itemsToday}
          icon={UtensilsCrossed}
        />
        <Card className="card-hover">
          <CardContent className="p-4 md:p-6 flex flex-col justify-center">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">{t.diet.addingTo}</p>
            <Select value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as MealType)}>
              <SelectTrigger className="mt-1 h-9 md:h-10 text-base md:text-lg font-bold border-0 bg-secondary px-3 hover:bg-secondary/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {(Object.keys(mealLabels) as MealType[]).map((type) => {
                  const Icon = mealIcons[type];
                  return (
                    <SelectItem key={type} value={type}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {mealLabels[type]}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Food Search & Browse */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <Card className="shadow-xl border-2 border-primary/10 overflow-visible">
            <CardHeader className="bg-primary/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t.diet.searchFoods}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Search from our database of 8,000+ Indian & International foods.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Global Search Bar - Prime Focus */}
              <div className="relative">
                <Label className="text-base font-bold mb-3 block text-primary/80">
                  Global Database Search
                </Label>
                <Autocomplete
                  type="food"
                  placeholder="Type food name in English or your language (e.g., Spinach, Rice, പാലക്ക്...)"
                  onSelect={handleSelectFood}
                  className="w-full text-lg"
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-2 rounded-md">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  <span>Matches across all supported languages automatically</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-dashed" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-6 text-muted-foreground font-bold tracking-widest text-[10px]">
                    Browse Common Indian Foods
                  </span>
                </div>
              </div>

              {/* Browse Section - Curated List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold uppercase tracking-tight text-muted-foreground">
                    Filter by Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-56 h-10 shadow-sm transition-all hover:border-primary/50">
                      <SelectValue placeholder={t.diet.allCategories} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.diet.allCategories}</SelectItem>
                      {foodCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border-t pt-4">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={food.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.01}s` }}
                    >
                      <FoodCard food={food} onAdd={handleAddFood} compact />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Today's Log */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <Card className="shadow-lg border-2 border-primary/5">
            <CardHeader className="pb-4 border-b bg-secondary/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                {t.diet.todaysFoodLog}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6 bg-secondary/50 p-1">
                  <TabsTrigger value="all" className="text-xs">{t.common.all}</TabsTrigger>
                  <TabsTrigger value="breakfast" className="text-lg">🌅</TabsTrigger>
                  <TabsTrigger value="lunch" className="text-lg">☀️</TabsTrigger>
                  <TabsTrigger value="dinner" className="text-lg">🌆</TabsTrigger>
                  <TabsTrigger value="snack" className="text-lg">🌙</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {todaysMeals.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-2 border-dashed">
                      <p>{t.diet.noMealsLogged}</p>
                    </div>
                  ) : (
                    todaysMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-secondary hover:border-primary/20 transition-all duration-200"
                      >
                        <div>
                          <p className="font-semibold text-sm">{meal.food.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {mealLabels[meal.mealType]} • <span className="text-primary/80 font-medium">{Math.round(meal.food.calories)}</span> {t.diet.cal}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </TabsContent>

                {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => (
                  <TabsContent key={type} value={type} className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {getMealsByType(type).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-2 border-dashed">
                        <p>{t.diet.noMealLogged.replace("{meal}", mealLabels[type].toLowerCase())}</p>
                      </div>
                    ) : (
                      getMealsByType(type).map((meal) => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-secondary"
                        >
                          <div>
                            <p className="font-semibold text-sm">{meal.food.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {Math.round(meal.food.calories)} {t.diet.cal} • {Math.round(meal.food.protein)}{t.diet.gProtein}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quantity Selector Dialog */}
      {selectedFood && (
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