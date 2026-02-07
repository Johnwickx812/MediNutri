
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertTriangle, Activity, Pill, Star, ShieldAlert, ShieldCheck, Stethoscope, Wine, Baby } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Constants for API URL
const API_URL = "http://localhost:8000";

interface DrugSideEffects {
    drug_name: string;
    generic_name: string;
    brand_names: string;
    medical_condition: string;
    medical_condition_description: string;
    side_effects_severe: string[];
    side_effects_common: string[];
    side_effects_full: string;
    drug_classes: string;
    rx_otc: string;
    pregnancy_category: string;
    alcohol_warning: string;
    rating: number;
    num_reviews: number;
    activity: string;
}

interface SearchResponse {
    success: boolean;
    results: DrugSideEffects[];
    count: number;
}

export default function DrugSafety() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDrug, setSelectedDrug] = useState<DrugSideEffects | null>(null);

    // Search Query
    const { data: searchResults, isLoading, isError } = useQuery({
        queryKey: ["drug-side-effects-search", searchQuery],
        queryFn: async () => {
            if (!searchQuery || searchQuery.length < 2) return { results: [] };
            const res = await fetch(`${API_URL}/api/drugs/side-effects/search?q=${searchQuery}&limit=10`);
            if (!res.ok) throw new Error("Search failed");
            return res.json() as Promise<SearchResponse>;
        },
        enabled: searchQuery.length >= 2,
    });

    // Handle drug selection
    const handleDrugSelect = (drug: DrugSideEffects) => {
        setSelectedDrug(drug);
        setSearchQuery(""); // Optional: keep search or clear it
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-12 md:py-20 lg:py-24 px-4 mb-8 rounded-b-[30px] md:rounded-b-[50px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="container relative z-10 max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm uppercase tracking-wider mb-2">
                        <Activity className="w-4 h-4 mr-2" />
                        Medical Grade Safety Check
                    </Badge>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight px-2">
                        {t.drugSafety.title}
                    </h1>
                    <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto px-4">
                        {t.drugSafety.description}
                    </p>

                    <div className="max-w-xl mx-auto mt-6 md:mt-10 relative group px-4 sm:px-0">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                        <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 md:p-2 shadow-2xl">
                            <Search className="w-5 h-5 md:w-6 md:h-6 text-blue-200 ml-3 md:ml-4" />
                            <Input
                                type="text"
                                placeholder={t.drugSafety.searchPlaceholder}
                                className="border-0 bg-transparent text-white placeholder:text-blue-200 focus-visible:ring-0 text-base md:text-lg h-10 md:h-12 px-3 md:px-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQuery.length >= 2 && (searchResults?.results?.length ?? 0) > 0 && (
                            <Card className="absolute top-full left-4 right-4 sm:left-0 sm:right-0 mt-3 z-50 overflow-hidden shadow-2xl border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                <ScrollArea className="h-[300px]">
                                    <div className="p-2">
                                        {searchResults?.results.map((drug, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDrugSelect(drug)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg text-left transition-colors group/item"
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <p className="font-semibold text-foreground flex items-center gap-2 truncate">
                                                        <Pill className="w-4 h-4 text-primary shrink-0" />
                                                        {drug.drug_name}
                                                    </p>
                                                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                                                        {drug.generic_name || drug.medical_condition}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="hidden sm:flex opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                                                    View Profile
                                                </Badge>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container max-w-6xl mx-auto px-4">
                {selectedDrug ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                        {/* Header Card */}
                        <Card className="border-l-4 border-l-blue-500 shadow-lg bg-gradient-to-r from-background to-blue-50/20 dark:to-blue-950/20 overflow-hidden">
                            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {selectedDrug.rx_otc || "Prescription"}
                                        </Badge>
                                        <Badge variant="outline" className="hidden sm:inline-flex">{selectedDrug.drug_classes?.split(',')[0] || "Medication"}</Badge>
                                    </div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                                        {selectedDrug.drug_name}
                                        {selectedDrug.rating >= 8 && (
                                            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500 shrink-0" />
                                        )}
                                    </CardTitle>
                                    <CardDescription className="text-base md:text-lg">
                                        {selectedDrug.generic_name}
                                    </CardDescription>
                                </div>

                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 gap-4">
                                    <div className="text-left md:text-right">
                                        <span className="text-xs md:text-sm text-muted-foreground">User Rating</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl md:text-4xl font-bold font-mono tracking-tighter">{selectedDrug.rating}/10</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-32 md:w-40">
                                        <Progress value={selectedDrug.rating * 10} className={cn("h-2 md:h-2.5", selectedDrug.rating > 7 ? "bg-green-100" : "bg-red-100")} />
                                        <span className="text-[10px] md:text-xs text-muted-foreground md:text-right">{selectedDrug.num_reviews} global reviews</span>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <div className="grid md:grid-cols-3 gap-6">

                            {/* Left Column: Side Effects */}
                            <div className="md:col-span-2 space-y-6">

                                {/* Severe Side Effects - High Priority */}
                                <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-xl">
                                            <ShieldAlert className="w-6 h-6" />
                                            {t.drugSafety.severeSideEffects}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedDrug.side_effects_severe && selectedDrug.side_effects_severe.length > 0 ? (
                                            <ul className="grid gap-3 sm:grid-cols-2">
                                                {selectedDrug.side_effects_severe.map((effect, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                                                        <AlertTriangle className="w-4 h-4 mt-1 shrink-0" />
                                                        <span className="font-medium">{effect}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground italic">No severe side effects listed specially. Always check with doctor.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Common Side Effects */}
                                <Card className="shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <Activity className="w-5 h-5 text-blue-500" />
                                            {t.drugSafety.commonSideEffects}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDrug.side_effects_common && selectedDrug.side_effects_common.length > 0 ? (
                                                selectedDrug.side_effects_common.map((effect, i) => (
                                                    <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                                                        {effect}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground">{selectedDrug.side_effects_full?.slice(0, 200)}...</p>
                                            )}
                                        </div>
                                        {selectedDrug.side_effects_full && (
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {selectedDrug.side_effects_full.slice(0, 500)}...
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                            </div>

                            {/* Right Column: Info & Limits */}
                            <div className="space-y-6">

                                {/* Medical Condition */}
                                <Card className="shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Stethoscope className="w-5 h-5 text-green-600" />
                                            {t.drugSafety.medicalCondition}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium text-lg text-primary">{selectedDrug.medical_condition}</p>
                                        {selectedDrug.medical_condition_description && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {selectedDrug.medical_condition_description.slice(0, 150)}...
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Warnings Section */}
                                <Card className="shadow-md overflow-hidden">
                                    <CardHeader className="bg-orange-50 dark:bg-orange-950/20 pb-4">
                                        <CardTitle className="text-lg text-orange-700 dark:text-orange-400 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            Safety Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y">

                                            {selectedDrug.pregnancy_category && (
                                                <div className="p-4 flex items-start gap-4">
                                                    <div className="bg-pink-100 text-pink-600 p-2 rounded-full">
                                                        <Baby className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-muted-foreground">Pregnancy Category</p>
                                                        <p className="font-bold text-lg">{selectedDrug.pregnancy_category}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedDrug.alcohol_warning && (
                                                <div className="p-4 flex items-start gap-4">
                                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                                                        <Wine className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-muted-foreground">Alcohol</p>
                                                        <p className="text-sm">{selectedDrug.alcohol_warning}</p>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Brand Names */}
                                {selectedDrug.brand_names && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base text-muted-foreground uppercase tracking-wide">Brand Names</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {selectedDrug.brand_names}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-full mb-6">
                            <ShieldCheck className="w-16 h-16 text-blue-500/50" />
                        </div>
                        <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                            {t.drugSafety.searchToView}
                        </h2>
                        <p className="text-muted-foreground max-w-md">
                            Enter the name of a medication above to see comprehensive safety details, side effects, and warning labels.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
