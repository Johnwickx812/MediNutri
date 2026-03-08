import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";

interface StatCardsProps {
    targets: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    current: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const StatCards: React.FC<StatCardsProps> = ({ targets, current }) => {
    const stats = [
        {
            label: "Daily Kcal",
            value: current.calories,
            target: targets.calories,
            unit: "",
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            label: "Protein",
            value: current.protein,
            target: targets.protein,
            unit: "g",
            icon: Beef,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            label: "Carbs",
            value: current.carbs,
            target: targets.carbs,
            unit: "g",
            icon: Wheat,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            label: "Fat",
            value: current.fat,
            target: targets.fat,
            unit: "g",
            icon: Droplets,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const percentage = Math.min(Math.round((stat.value / stat.target) * 100) || 0, 100);
                const isOver = stat.value > stat.target;
                const colorClass = isOver ? "text-red-500" : percentage > 90 ? "text-emerald-500" : percentage > 70 ? "text-orange-500" : stat.color;

                return (
                    <Card key={stat.label} className="border-none shadow-lg bg-white dark:bg-slate-900 overflow-hidden group hover:scale-[1.02] transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                                    <p className="text-2xl font-black tracking-tighter dark:text-white">
                                        {Math.round(stat.value)}<span className="text-sm font-bold text-slate-400 ml-1">{stat.unit || "kcal"}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-slate-500">Progress</span>
                                    <span className={colorClass}>{percentage}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${isOver ? 'bg-red-500' : 'bg-primary'}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Goal: {stat.target}{stat.unit || "kcal"}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
