import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";

interface SafetyAlertsProps {
    medications: string[];
    alerts: {
        medication: string;
        food: string;
        severity: "caution" | "danger";
        reason: string;
        recommendation: string;
    }[];
}

export const SafetyAlerts: React.FC<SafetyAlertsProps> = ({ medications, alerts }) => {
    if (medications.length === 0) return null;

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-8 border-b dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-500 rounded-2xl">
                                <ShieldAlert className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tighter uppercase dark:text-white">Medication Safety Check</h3>
                                <p className="text-xs font-bold text-slate-500">{medications.length} active medications monitored</p>
                            </div>
                        </div>
                        {alerts.length === 0 && (
                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-black uppercase tracking-widest">All Meals Safe</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 space-y-4">
                    {alerts.length > 0 ? (
                        alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 p-5 rounded-3xl border ${alert.severity === 'danger'
                                    ? 'bg-red-50 dark:bg-red-500/5 border-red-500/20'
                                    : 'bg-orange-50 dark:bg-orange-500/5 border-orange-500/20'
                                    }`}
                            >
                                <div className={`mt-1 p-2 rounded-xl h-fit ${alert.severity === 'danger' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${alert.severity === 'danger' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                            }`}>
                                            {alert.severity === 'danger' ? 'Avoid' : 'Caution'}
                                        </span>
                                        <h4 className="font-bold text-sm dark:text-white leading-none">
                                            {alert.food} + {alert.medication}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                        {alert.reason}
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-[10px] font-black uppercase text-primary tracking-widest">Recommendation:</span>
                                        <p className="text-[10px] font-bold text-slate-500">{alert.recommendation}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-500">No interactions detected with today's meals.</p>
                            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary gap-2">
                                View Full Interaction Guide <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
