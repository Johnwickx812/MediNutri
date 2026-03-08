import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Calculator,
    Target,
    ShieldAlert,
    Utensils,
    ArrowRight,
    Check,
    Scale,
    Ruler,
    User,
    Activity,
    Heart,
    Pill
} from "lucide-react";
import { commonMedications } from "@/data/medications";

const HEALTH_GOALS = [
    { id: "weight-loss", label: "Weight Loss", description: "Lose fat and improve health" },
    { id: "weight-gain", label: "Weight Gain", description: "Build mass and strength" },
    { id: "muscle-building", label: "Muscle Building", description: "Focus on hypertrophy" },
    { id: "maintenance", label: "Maintenance", description: "Stay at current weight" },
    { id: "diabetic", label: "Diabetic Friendly", description: "Blood sugar management" },
    { id: "heart-health", label: "Heart Health", description: "Cholesterol & BP focus" },
];

const ACTIVITY_LEVELS = [
    { id: "sedentary", label: "Sedentary", multiplier: 1.2, description: "Office job, little exercise" },
    { id: "light", label: "Lightly Active", multiplier: 1.375, description: "1-3 days of exercise" },
    { id: "moderate", label: "Moderately Active", multiplier: 1.55, description: "3-5 days of exercise" },
    { id: "active", label: "Very Active", multiplier: 1.725, description: "6-7 days of exercise" },
    { id: "extra", label: "Extra Active", multiplier: 1.9, description: "Pro athlete or physical job" },
];

const DIETARY_RESTRICTIONS = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Keto", "Paleo"
];

const CUISINE_TYPES = ["Indian", "Western", "Middle Eastern", "Mixed"];

const DietGoalSetting = () => {
    const { user, updateUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        age: user?.age || "",
        gender: user?.gender || "male",
        weight: user?.weight || "",
        height: user?.height || "",
        activityLevel: user?.activityLevel || "sedentary",
        healthGoal: user?.healthGoal || "maintenance",
        dietaryRestrictions: user?.dietaryRestrictions || [],
        medications: user?.medications || [],
        mealsPerDay: user?.mealsPerDay || "3",
        cuisineType: user?.cuisineType || "Indian",
        customAllergies: user?.customAllergies || "",
    });

    const [targets, setTargets] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    // Calculate targets whenever relevant profile data changes
    useEffect(() => {
        if (formData.weight && formData.height && formData.age) {
            const w = Number(formData.weight);
            const h = Number(formData.height);
            const a = Number(formData.age);
            const activity = ACTIVITY_LEVELS.find(al => al.id === formData.activityLevel)?.multiplier || 1.2;

            let bmr = 0;
            if (formData.gender === "male") {
                bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
            } else {
                bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
            }

            let tdee = bmr * activity;

            // Adjust based on goal
            if (formData.healthGoal === "weight-loss") tdee -= 500;
            if (formData.healthGoal === "weight-gain" || formData.healthGoal === "muscle-building") tdee += 500;

            const calories = Math.round(tdee);

            // Default macro split (Protein: 25%, Fats: 25%, Carbs: 50%)
            const protein = Math.round((calories * 0.25) / 4);
            const fat = Math.round((calories * 0.25) / 9);
            const carbs = Math.round((calories * 0.50) / 4);

            setTargets({ calories, protein, carbs, fat });
        }
    }, [formData.weight, formData.height, formData.age, formData.gender, formData.activityLevel, formData.healthGoal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.age || !formData.weight || !formData.height) {
            toast.error("Please fill in age, weight, and height");
            return;
        }

        await updateUser({
            ...formData,
            age: Number(formData.age),
            weight: Number(formData.weight),
            height: Number(formData.height),
            calorieGoal: targets.calories,
            proteinGoal: targets.protein,
            carbGoal: targets.carbs,
            fatGoal: targets.fat,
            onboarding_complete: true
        });

        toast.success("Diet profile updated!");
        navigate("/diet");
    };

    const toggleRestriction = (res: string) => {
        setFormData(prev => ({
            ...prev,
            dietaryRestrictions: prev.dietaryRestrictions.includes(res)
                ? prev.dietaryRestrictions.filter(r => r !== res)
                : [...prev.dietaryRestrictions, res]
        }));
    };

    const toggleMedication = (med: string) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.includes(med)
                ? prev.medications.filter(m => m !== med)
                : [...prev.medications, med]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 py-12">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Diet & Health Profile</h1>
                    <p className="text-slate-500 font-medium">Configure your nutrition goals and safety preferences</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Physical Profile */}
                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-primary/5 p-8 border-b dark:border-white/5">
                                <CardTitle className="flex items-center gap-3">
                                    <User className="h-6 w-6 text-primary" />
                                    Physical Measurements
                                </CardTitle>
                                <CardDescription>We use these for the Harris-Benedict equation</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="e.g. 28"
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v as any })}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Scale className="h-4 w-4" /> Weight (kg)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.weight}
                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                        placeholder="70"
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4" /> Height (cm)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.height}
                                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                                        placeholder="175"
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label>Activity Level</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {ACTIVITY_LEVELS.map(al => (
                                            <div
                                                key={al.id}
                                                onClick={() => setFormData({ ...formData, activityLevel: al.id })}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.activityLevel === al.id
                                                    ? "border-primary bg-primary/5 shadow-inner"
                                                    : "border-slate-100 dark:border-white/5 hover:border-primary/30"
                                                    }`}
                                            >
                                                <p className="font-bold text-sm">{al.label}</p>
                                                <p className="text-[10px] text-slate-500 mt-1">{al.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2: Health Goals */}
                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-primary/5 p-8 border-b dark:border-white/5">
                                <CardTitle className="flex items-center gap-3">
                                    <Target className="h-6 w-6 text-orange-500" />
                                    Health & Nutrition Goals
                                </CardTitle>
                                <CardDescription>What do you want to achieve?</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {HEALTH_GOALS.map(goal => (
                                    <div
                                        key={goal.id}
                                        onClick={() => setFormData({ ...formData, healthGoal: goal.id })}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.healthGoal === goal.id
                                            ? "border-orange-500 bg-orange-500/5 shadow-inner"
                                            : "border-slate-100 dark:border-white/5 hover:border-orange-500/30"
                                            }`}
                                    >
                                        <p className="font-bold text-sm">{goal.label}</p>
                                        <p className="text-[10px] text-slate-500 mt-1">{goal.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Step 3: Dietary Restrictions & Medications */}
                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-primary/5 p-8 border-b dark:border-white/5">
                                <CardTitle className="flex items-center gap-3">
                                    <ShieldAlert className="h-6 w-6 text-red-500" />
                                    Dietary Restrictions & Safety
                                </CardTitle>
                                <CardDescription>Crucial for medication safety checks</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Dietary Preferences</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {DIETARY_RESTRICTIONS.map(res => (
                                            <button
                                                key={res}
                                                type="button"
                                                onClick={() => toggleRestriction(res)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.dietaryRestrictions.includes(res)
                                                    ? "bg-primary text-white"
                                                    : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {res}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Pill className="h-3 w-3" /> Current Medications
                                    </Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {commonMedications.map(med => (
                                            <div
                                                key={med.id}
                                                onClick={() => toggleMedication(med.name)}
                                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${formData.medications.includes(med.name)
                                                    ? "bg-red-500/10 border-red-500/50 text-red-600"
                                                    : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-500"
                                                    }`}
                                            >
                                                <span className="text-xs font-bold">{med.name}</span>
                                                {formData.medications.includes(med.name) && <Check className="h-3 w-3" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 4: Meal Preferences */}
                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-primary/5 p-8 border-b dark:border-white/5">
                                <CardTitle className="flex items-center gap-3">
                                    <Utensils className="h-6 w-6 text-emerald-500" />
                                    Meal Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Meals Per Day</Label>
                                    <Select value={formData.mealsPerDay} onValueChange={v => setFormData({ ...formData, mealsPerDay: v })}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 Meals (Std)</SelectItem>
                                            <SelectItem value="4">4 Meals (Snack)</SelectItem>
                                            <SelectItem value="5">5 Meals (Frequent)</SelectItem>
                                            <SelectItem value="6">6 Meals (Small)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Preferred Cuisine</Label>
                                    <Select value={formData.cuisineType} onValueChange={v => setFormData({ ...formData, cuisineType: v })}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CUISINE_TYPES.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Real-time Calculator */}
                    <div className="space-y-8">
                        <Card className="sticky top-8 border-none shadow-2xl bg-gradient-to-br from-primary to-emerald-600 rounded-[2rem] overflow-hidden text-white">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Calculator className="h-6 w-6" />
                                    Target Nutrition
                                </CardTitle>
                                <CardDescription className="text-white/70">Auto-calculated based on your data</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="text-center space-y-1">
                                    <p className="text-6xl font-black tracking-tighter">{targets.calories}</p>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Daily Kcal Goal</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                            <span>Protein</span>
                                            <span>{targets.protein}g</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[25%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                            <span>Carbs</span>
                                            <span>{targets.carbs}g</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[50%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                            <span>Fats</span>
                                            <span>{targets.fat}g</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-[25%]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md space-y-2">
                                        <p className="text-[10px] font-bold uppercase opacity-60">Medication Safety Status</p>
                                        <div className="flex items-center gap-2">
                                            {formData.medications.length > 0 ? (
                                                <>
                                                    <ShieldAlert className="h-4 w-4 text-orange-200" />
                                                    <p className="text-xs font-bold">{formData.medications.length} Medications Active</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 text-emerald-200" />
                                                    <p className="text-xs font-bold">No High-Risk Interactions</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl font-black text-lg gap-2 mt-4"
                                >
                                    Save & View Dashboard
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Heart className="h-4 w-4 text-red-500" />
                                Why this data matters?
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Your BMR and TDEE are calculated using the <strong>Harris-Benedict equation</strong>.
                                We also Cross-reference your medications with 1,000+ potential food-drug interactions to ensure every meal suggestion is safe.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DietGoalSetting;
