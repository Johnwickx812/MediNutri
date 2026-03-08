import React from "react";
import { Check } from "lucide-react";

interface WeeklyCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    loggedDates: string[]; // ISO strings
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ selectedDate, onDateSelect, loggedDates }) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Get start of current week (Monday)
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });

    return (
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {weekDays.map((date, idx) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                const isLogged = loggedDates.includes(date.toISOString().split('T')[0]);

                return (
                    <div
                        key={idx}
                        onClick={() => onDateSelect(date)}
                        className={`flex-1 min-w-[70px] p-3 rounded-2xl cursor-pointer transition-all border ${isSelected
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-primary/30"
                            }`}
                    >
                        <div className="text-center space-y-1">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                                {days[idx]}
                            </p>
                            <p className={`text-xl font-black ${isSelected ? "text-white" : "dark:text-white"}`}>
                                {date.getDate()}
                            </p>
                            <div className="flex justify-center pt-1">
                                {isLogged ? (
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? "bg-white text-primary" : "bg-emerald-500 text-white"}`}>
                                        <Check className="h-3 w-3" />
                                    </div>
                                ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/50" : "bg-slate-200 dark:bg-white/10"}`} />
                                )}
                            </div>
                        </div>
                        {isToday && !isSelected && (
                            <p className="text-[8px] font-black text-primary text-center mt-1 uppercase tracking-tighter">Today</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
