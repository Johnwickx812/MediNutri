import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface AutocompleteProps {
    type: "food" | "drug";
    placeholder?: string;
    onSelect: (value: string) => void;
    className?: string;
}

export function Autocomplete({ type, placeholder, onSelect, className }: AutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
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
                    ? `http://localhost:8000/foods/autocomplete?q=${encodeURIComponent(query)}&lang=${language}`
                    : `http://localhost:8000/drugs/autocomplete?q=${encodeURIComponent(query)}`;

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                if (data.success && Array.isArray(data.suggestions)) {
                    setResults(data.suggestions);
                    setShowResults(true);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Autocomplete fetch error:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch suggestions. Please try again.",
                    variant: "destructive",
                });
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, type, toast, language]);

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || `Search ${type}...`}
                    className="pl-10"
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {showResults && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border rounded-md shadow-lg max-h-60 overflow-auto">
                    {results.length > 0 ? (
                        <ul className="py-1">
                            {results.map((item, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
                                    onClick={() => {
                                        setQuery(item);
                                        onSelect(item);
                                        setShowResults(false);
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        query.length > 0 && !loading && (
                            <div className="px-4 py-2 text-sm text-muted-foreground">No results found.</div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
