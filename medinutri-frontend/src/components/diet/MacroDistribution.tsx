import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MacroDistributionProps {
    protein: number;
    carbs: number;
    fat: number;
}

export const MacroDistribution: React.FC<MacroDistributionProps> = ({ protein, carbs, fat }) => {
    const data = [
        { name: "Protein", value: protein, color: "#ef4444" },
        { name: "Carbs", value: carbs, color: "#10b981" },
        { name: "Fat", value: fat, color: "#3b82f6" },
    ];

    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-xl font-black dark:text-white">{Math.round(protein + carbs + fat)}g</p>
            </div>
        </div>
    );
};
