import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Pill, Utensils, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config";

interface Suggestion {
    name: string;
    subtext?: string;
    category?: string;
    raw: string;
}

interface AutocompleteProps {
    type: "food" | "drug";
    placeholder?: string;
    onSelect: (value: string) => void;
    className?: string;
}

export function Autocomplete({ type, placeholder, onSelect, className }: AutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const { language } = useLanguage();

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 1) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                // Pass current language to the backend
                const endpoint = type === "food"
                    ? `${API_URL}/foods/autocomplete?q=${encodeURIComponent(query)}&lang=${language}`
                    : `${API_URL}/drugs/autocomplete?q=${encodeURIComponent(query)}`;

                console.log(`Autocomplete fetching: ${endpoint}`);
                const response = await fetch(endpoint);
                console.log(`Autocomplete response status: ${response.status}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                console.log(`Autocomplete data received:`, data);

                if (data.success && Array.isArray(data.suggestions)) {
                    // Normalize suggestions to objects if they are strings
                    const normalized: Suggestion[] = data.suggestions.map((s: any) =>
                        typeof s === "string" ? { name: s, raw: s, category: type === "drug" ? "Medication" : "Food" } : s
                    );
                    setResults(normalized);
                    setShowResults(true);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Autocomplete fetch error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, type, language]);

    return (
        <div ref={wrapperRef} className="relative z-[50]">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || `Search ${type}...`}
                    className={cn("pl-12 w-full", className)}
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground z-10" />
                )}
            </div>

            {showResults && (
                <div className="absolute z-[100] w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-2xl shadow-2xl max-h-[400px] overflow-auto animate-in fade-in zoom-in duration-200">
                    {results.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {/* Group by category if it's a mix, but here we usually have one type */}
                            <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                {type === "food" ? <Utensils className="h-3 w-3" /> : <Pill className="h-3 w-3" />}
                                Suggestions
                            </p>
                            {results.map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center gap-4 px-4 py-3 hover:bg-primary hover:text-white rounded-xl cursor-pointer transition-all duration-200"
                                    onClick={() => {
                                        setQuery(item.name);
                                        onSelect(item.raw);
                                        setShowResults(false);
                                    }}
                                >
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                                        {type === "food" ? (
                                            <Utensils className="h-5 w-5 text-primary group-hover:text-white" />
                                        ) : (
                                            <Pill className="h-5 w-5 text-primary group-hover:text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-bold text-sm truncate">
                                                {item.name}
                                                {item.subtext && (
                                                    <span className="ml-2 font-medium text-xs text-muted-foreground group-hover:text-white/80 italic">
                                                        — {item.subtext}
                                                    </span>
                                                )}
                                            </p>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white/20 text-muted-foreground group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        query.length > 0 && !loading && (
                            <div className="p-8 text-center space-y-2">
                                <Info className="h-8 w-8 text-muted-foreground mx-auto opacity-20" />
                                <p className="text-sm text-muted-foreground font-medium">No results found for "{query}"</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
