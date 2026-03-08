import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, Plus, AlertCircle, ShieldCheck } from "lucide-react";
import { InteractionSeverity } from "@/data/interactions";

interface FoodItem {
    food: string;
    quantity: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    safetyStatus: InteractionSeverity;
}

interface MealCardProps {
    type: string;
    time: string;
    totalCalories: number;
    isLogged: boolean;
    items: FoodItem[];
    onAdd: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ type, time, totalCalories, isLogged, items, onAdd }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getTypeIcon = () => {
        switch (type.toLowerCase()) {
            case "breakfast": return "🌅";
            case "morning snack": return "🍎";
            case "lunch": return "☀️";
            case "evening snack": return "☕";
            case "dinner": return "🌙";
            default: return "🍴";
        }
    };

    const allSafe = items.every(item => item.safetyStatus === "safe");
    const hasDanger = items.some(item => item.safetyStatus === "danger");

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg overflow-hidden border border-slate-100 dark:border-white/5 transition-all">
            <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="text-3xl bg-slate-50 dark:bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center">
                        {getTypeIcon()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-lg tracking-tight uppercase dark:text-white">{type}</h3>
                            <span className="text-xs font-bold text-slate-400">({time})</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm font-bold text-primary">{totalCalories} kcal</p>
                            {isLogged && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none flex items-center gap-1 px-2 py-0">
                                    <Check className="h-3 w-3" /> Logged
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isLogged && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full h-8 px-3 border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold gap-1"
                            onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        >
                            <Plus className="h-3 w-3" /> Add
                        </Button>
                    )}
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                    <div className="space-y-4">
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.safetyStatus === 'danger' ? 'bg-red-500' :
                                                    item.safetyStatus === 'caution' ? 'bg-orange-500' : 'bg-emerald-500'
                                                }`} />
                                            <p className="text-sm font-bold dark:text-white">{item.food} <span className="text-xs text-slate-400 font-medium font-mono">({item.quantity})</span></p>
                                        </div>
                                        <p className="text-xs font-bold font-mono text-slate-500">{item.calories} kcal</p>
                                    </div>
                                    <div className="flex gap-4 ml-3.5">
                                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">P: {item.protein}g</span>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">C: {item.carbs}g</span>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">F: {item.fat}g</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 italic text-center py-4">No items planned for this meal.</p>
                        )}

                        <div className="pt-4 border-t dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {hasDanger ? (
                                    <div className="flex items-center gap-1.5 text-red-500">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Unsafe with Medications</span>
                                    </div>
                                ) : allSafe ? (
                                    <div className="flex items-center gap-1.5 text-emerald-500">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Safe with Medications</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-orange-500">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Use Caution</span>
                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">
                                Edit Meal
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
