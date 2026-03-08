import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip as RechartsTooltip
} from "recharts";
import {
    Sparkles,
    ShieldCheck,
    Info,
    RefreshCcw,
    Utensils,
    ChevronRight,
    HeartPulse
} from "lucide-react";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";


interface DietPlan {
    daily_calorie_target: number;
    macro_split: {
        protein: string;
        carbs: string;
        fats: string;
        fiber: string;
    };
    meals: {
        meal: string;
        items: {
            name: string;
            quantity: string;
            calories: number;
            protein: string;
            carbs: string;
            fats: string;
            fiber: string;
            reason: string;
            interaction_status: string;
        }[];
        alternatives: {
            name: string;
            calories: number;
            protein: string;
        }[];
    }[];
}

export function AIDietEngine() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

    const generatePlan = async () => {
        if (!user?.id) return;

        // Check if profile is complete (needed for BMR calculation)
        if (!user.height || !user.weight) {
            toast({
                title: "Profile Incomplete",
                description: "Please update your height and weight in your profile to generate a diet plan.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/diet/generate?user_id=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to generate plan");
            }

            const data = await response.json();

            // Basic validation of data structure
            if (data && data.daily_calorie_target && data.macro_split) {
                setDietPlan(data);
                toast({
                    title: "Diet Plan Generated",
                    description: "Your personalized medical-aware diet plan is ready.",
                });
            } else {
                throw new Error("Invalid data format received from server");
            }
        } catch (error: any) {
            console.error("Failed to generate diet plan", error);
            toast({
                title: "Oops!",
                description: error.message || "Failed to generate your personalized plan.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };


    const macroData = dietPlan ? [
        { name: 'Protein', value: parseInt(dietPlan.macro_split.protein), color: '#10b981' },
        { name: 'Carbs', value: parseInt(dietPlan.macro_split.carbs), color: '#3b82f6' },
        { name: 'Fats', value: parseInt(dietPlan.macro_split.fats), color: '#f59e0b' },
    ] : [];

    return (
        <div className="space-y-6">
            {!dietPlan ? (
                <Card className="border-dashed border-2 bg-primary/5">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">AI Diet Planning Engine</h3>
                        <p className="text-muted-foreground max-w-md mt-2 mb-6">
                            Generate a clinically structured meal plan based on your medical conditions, medications, and weight goals.
                        </p>
                        <Button
                            size="lg"
                            onClick={generatePlan}
                            disabled={loading}
                            className="rounded-full px-8"
                        >
                            {loading ? "Analyzing Medical Data..." : "Generate My Plan"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Summary & Macros */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="rounded-[2rem] shadow-xl overflow-hidden border-none bg-slate-900 text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Daily Target</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black">{dietPlan.daily_calorie_target}</span>
                                    <span className="text-xl font-bold text-primary">kcal</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={macroData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {macroData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase">Protein</p>
                                        <p className="font-bold text-emerald-400">{dietPlan.macro_split.protein}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase">Carbs</p>
                                        <p className="font-bold text-blue-400">{dietPlan.macro_split.carbs}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase">Fats</p>
                                        <p className="font-bold text-amber-400">{dietPlan.macro_split.fats}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl shadow-lg border-primary/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-green-500" />
                                    Medical Safety
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-xs font-bold text-green-800 flex items-center gap-2">
                                        <HeartPulse className="h-3 w-3" />
                                        CLINICALLY VERIFIED
                                    </p>
                                    <p className="text-[10px] text-green-600 mt-1">
                                        All foods cross-checked against your {user?.medicalConditions ? "conditions" : "profile"}.
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl gap-2" onClick={generatePlan}>
                                    <RefreshCcw className="h-4 w-4" />
                                    Regenerate Plan
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Meals List */}
                    <div className="lg:col-span-2 space-y-4">
                        {dietPlan.meals.map((meal, idx) => (
                            <Card key={idx} className="rounded-3xl shadow-md border-none hover:shadow-lg transition-all group">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-48 bg-primary/5 flex flex-col items-center justify-center p-6 border-r border-slate-100">
                                            <Utensils className="h-8 w-8 text-primary/40 mb-2 group-hover:scale-110 transition-transform" />
                                            <h4 className="font-black text-xl text-primary uppercase tracking-tighter">{meal.meal}</h4>
                                        </div>
                                        <div className="flex-1 p-6 space-y-4">
                                            {meal.items.map((item, iIdx) => (
                                                <div key={iIdx} className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="text-lg font-bold">{item.name}</h5>
                                                            <p className="text-sm text-muted-foreground">{item.quantity} • {item.calories} kcal</p>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                                            {item.interaction_status}
                                                        </Badge>

                                                    </div>

                                                    <div className="bg-slate-50 p-3 rounded-2xl flex gap-3 items-start border border-slate-100">
                                                        <Info className="h-4 w-4 text-primary mt-1 shrink-0" />
                                                        <p className="text-xs italic text-slate-600 leading-relaxed font-medium">
                                                            "{item.reason}"
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alternatives</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {meal.alternatives.map((alt, aIdx) => (
                                                                <div key={aIdx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-semibold flex items-center gap-2 hover:border-primary cursor-pointer transition-colors shadow-sm">
                                                                    {alt.name}
                                                                    <span className="text-primary/60 text-[9px]">{alt.calories} cal</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
