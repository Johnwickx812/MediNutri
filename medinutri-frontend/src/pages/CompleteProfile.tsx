import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Activity, User, Heart, ShieldAlert, Languages, Utensils, ArrowRight, Check } from "lucide-react";

const MEDICAL_CONDITIONS = [
    "None", "Diabetes", "Hypertension (BP)", "Thyroid Issues", "Heart Disease", "Kidney Issues", "Cholesterol"
];

const ALLERGIES = [
    "None", "Peanuts", "Dairy", "Gluten", "Shellfish", "Soy", "Eggs"
];

const CompleteProfile = () => {
    const { user, updateUser } = useAuth();
    const { t, language, setLanguage, languageNames } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        age: user?.age || "",
        gender: user?.gender || "",
        height: user?.height || "",
        weight: user?.weight || "",
        medicalConditions: user?.medicalConditions || [],
        allergies: user?.allergies || [],
        dietPreference: user?.dietPreference || "non-vegetarian",
        cuisinePreference: user?.cuisinePreference || "Indian",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.age || !formData.gender || !formData.height || !formData.weight) {
            toast.error("Please fill in all mandatory fields");
            return;
        }

        await updateUser({
            ...formData,
            gender: formData.gender as any,
            age: Number(formData.age),
            height: Number(formData.height),
            weight: Number(formData.weight),
            onboardingComplete: true
        });

        toast.success("Profile completed successfully!");
        navigate("/");
    };

    const toggleCondition = (condition: string) => {
        setFormData(prev => {
            const isNone = condition === "None";
            if (isNone) {
                return {
                    ...prev,
                    medicalConditions: prev.medicalConditions.includes("None") ? [] : ["None"]
                };
            }

            const newConditions = prev.medicalConditions.includes(condition)
                ? prev.medicalConditions.filter(c => c !== condition)
                : [...prev.medicalConditions.filter(c => c !== "None"), condition];

            return { ...prev, medicalConditions: newConditions };
        });
    };

    const toggleAllergy = (allergy: string) => {
        setFormData(prev => {
            const isNone = allergy === "None";
            if (isNone) {
                return {
                    ...prev,
                    allergies: prev.allergies.includes("None") ? [] : ["None"]
                };
            }

            const newAllergies = prev.allergies.includes(allergy)
                ? prev.allergies.filter(a => a !== allergy)
                : [...prev.allergies.filter(a => a !== "None"), allergy];

            return { ...prev, allergies: newAllergies };
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] translate-y-1/2 opacity-30" />

            <div className="w-full max-w-4xl relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter text-white">Let's Personalize Your Health</h1>
                    <p className="text-slate-400 font-bold max-w-2xl mx-auto">
                        We need a few details to calculate your nutritional needs, check drug interactions, and keep you safe.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <User className="h-6 w-6 text-primary" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Mandatory for BMI & Calories</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="text-white font-bold ml-1">Age</Label>
                                        <Input
                                            id="age" type="number" placeholder="25"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                                            value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-white font-bold ml-1">Gender</Label>
                                        <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v as any })}>
                                            <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                                                <SelectItem value="male" className="font-bold">Male</SelectItem>
                                                <SelectItem value="female" className="font-bold">Female</SelectItem>
                                                <SelectItem value="other" className="font-bold">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="height" className="text-white font-bold ml-1">Height (cm)</Label>
                                        <Input
                                            id="height" type="number" placeholder="170"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                                            value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight" className="text-white font-bold ml-1">Weight (kg)</Label>
                                        <Input
                                            id="weight" type="number" placeholder="70"
                                            className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                                            value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Language & Preference */}
                        <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Languages className="h-6 w-6 text-emerald-400" />
                                    Preferences
                                </CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Tailor your experience</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white font-bold ml-1">App Language</Label>
                                    <Select value={language} onValueChange={v => setLanguage(v as any)}>
                                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                                            {Object.entries(languageNames).map(([key, name]) => (
                                                <SelectItem key={key} value={key} className="font-bold">{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white font-bold ml-1">Diet Type</Label>
                                    <Select value={formData.dietPreference} onValueChange={v => setFormData({ ...formData, dietPreference: v as any })}>
                                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                                            <SelectItem value="vegetarian" className="font-bold">Vegetarian</SelectItem>
                                            <SelectItem value="non-vegetarian" className="font-bold">Non-Vegetarian</SelectItem>
                                            <SelectItem value="vegan" className="font-bold">Vegan</SelectItem>
                                            <SelectItem value="eggetarian" className="font-bold">Eggetarian</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Medical Conditions */}
                        <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <Heart className="h-6 w-6 text-red-400" />
                                    Medical Conditions
                                </CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Important for Food Restrictions</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 gap-2">
                                    {MEDICAL_CONDITIONS.map(condition => (
                                        <div
                                            key={condition}
                                            onClick={() => toggleCondition(condition)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${formData.medicalConditions.includes(condition)
                                                ? "bg-primary/20 border-primary text-white"
                                                : "bg-white/5 border-white/5 text-slate-400"
                                                }`}
                                        >
                                            <span className="font-bold">{condition}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.medicalConditions.includes(condition) ? "bg-primary border-primary" : "border-white/20"
                                                }`}>
                                                {formData.medicalConditions.includes(condition) && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Allergies */}
                        <Card className="border border-white/10 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <ShieldAlert className="h-6 w-6 text-orange-400" />
                                    Allergies
                                </CardTitle>
                                <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Crucial for your safety</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-2 gap-3">
                                    {ALLERGIES.map(allergy => (
                                        <div
                                            key={allergy}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleAllergy(allergy);
                                            }}
                                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${formData.allergies.includes(allergy)
                                                ? "bg-orange-500/20 border-orange-500 text-white"
                                                : "bg-white/5 border-white/5 text-slate-400"
                                                }`}
                                        >
                                            <span className="font-bold">{allergy}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.allergies.includes(allergy) ? "bg-orange-500 border-orange-500" : "border-white/20"
                                                }`}>
                                                {formData.allergies.includes(allergy) && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center pt-8">
                        <Button
                            type="submit"
                            className="h-16 rounded-[2rem] px-12 text-xl font-black gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                        >
                            Complete Profile
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
