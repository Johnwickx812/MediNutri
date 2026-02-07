import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InteractionAlert } from "@/components/cards/InteractionAlert";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Autocomplete } from "@/components/ui/Autocomplete";
import {
  AlertTriangle,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Info,
  Pill
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Interactions() {
  const { userMedications } = useApp();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [allInteractions, setAllInteractions] = useState<any[]>([]);

  const medicationNames = userMedications.map((m) => m.name);

  // Fetch all known interactions for the user's medications from Backend
  useEffect(() => {
    async function fetchInteractions() {
      if (medicationNames.length === 0) {
        setAllInteractions([]);
        return;
      }

      try {
        const promises = medicationNames.map(name =>
          fetch(`http://localhost:8000/api/interactions/drug/${encodeURIComponent(name)}`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);
        // Combine all interaction lists
        // Note: This might result in duplicates if multiple meds interact with the same food,
        // but for now we list them all.
        const combined = results.flatMap(r => r.success ? r.interactions : []);

        // Map backend fields to frontend interface if needed
        // Backend returns: { food_name, drug_name, interaction_type, severity, description }
        // Frontend expects: { id, medicationName, foodName, severity, reason, recommendation }
        const mapped = combined.map((i, idx) => ({
          id: i._id || `api-${idx}`,
          medicationName: i.drug_name,
          foodName: i.food_name,
          severity: i.severity?.toLowerCase() || 'caution',
          reason: i.description || i.interaction_type,
          recommendation: "Consult your doctor." // Backend might need to provide this
        }));

        // Deduplicate by ID if necessary
        const unique = Array.from(new Map(mapped.map(item => [item.id, item])).values());
        setAllInteractions(unique);

      } catch (error) {
        console.error("Failed to fetch interactions", error);
      }
    }

    fetchInteractions();
  }, [userMedications]);

  // Filter by search
  const filteredInteractions = useMemo(() => {
    if (!searchQuery) return allInteractions;
    const query = searchQuery.toLowerCase();
    return allInteractions.filter(
      (i) =>
        i.foodName.toLowerCase().includes(query) ||
        i.medicationName.toLowerCase().includes(query)
    );
  }, [allInteractions, searchQuery]);

  // Categorize interactions
  const dangerInteractions = filteredInteractions.filter((i) => i.severity === "danger" || i.severity === "high");
  const cautionInteractions = filteredInteractions.filter((i) => i.severity === "caution" || i.severity === "moderate");
  const safeInteractions = filteredInteractions.filter((i) => i.severity === "safe" || i.severity === "low");

  // Quick check a food
  const [quickCheckFood, setQuickCheckFood] = useState("");
  const [quickCheckResult, setQuickCheckResult] = useState<{
    food: string;
    result: { isSafe: boolean; interactions: any[] };
  } | null>(null);

  const handleQuickCheck = async () => {
    if (!quickCheckFood.trim() || medicationNames.length === 0) return;

    try {
      // Check this food against ALL user medications
      const promises = medicationNames.map(drug =>
        fetch(`http://localhost:8000/api/search/interactions?food=${encodeURIComponent(quickCheckFood)}&drug=${encodeURIComponent(drug)}`)
          .then(res => res.json())
      );

      const results = await Promise.all(promises);

      // Collect actual interactions found
      const interactionsFound = results.flatMap(r => r.success && r.has_interaction ? r.interactions : []);

      const mappedInteractions = interactionsFound.map((i, idx) => ({
        id: i._id || `qc-${idx}`,
        medicationName: i.drug_name,
        foodName: i.food_name,
        severity: i.severity?.toLowerCase() || 'caution',
        reason: i.description,
        recommendation: "Consult doctor."
      }));

      const hasDanger = mappedInteractions.some(i => i.severity === 'high' || i.severity === 'danger');
      const hasCaution = mappedInteractions.some(i => i.severity === 'moderate' || i.severity === 'caution');

      setQuickCheckResult({
        food: quickCheckFood,
        result: {
          isSafe: !hasDanger && !hasCaution && mappedInteractions.length === 0,
          interactions: mappedInteractions
        }
      });

    } catch (error) {
      console.error("Quick check failed", error);
    }
  };

  if (userMedications.length === 0) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{t.interactions.foodDrugChecker}</h1>
          <p className="text-muted-foreground text-lg">
            {t.interactions.addMedicationsFirst}
          </p>
          <Link to="/medications">
            <Button size="lg" className="h-14 px-8 text-lg">
              <Pill className="mr-2 h-5 w-5" />
              {t.interactions.addYourMedications}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          {t.interactions.foodSafetyChecker}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t.interactions.checkWhichFoodsSafe}
        </p>
      </div>

      {/* Quick Check Card */}
      <Card className="gradient-bg text-white">
        <CardContent className="p-6 md:p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-center">
              {t.interactions.quickFoodSafetyCheck}
            </h2>
            <p className="text-white/80 text-center">
              {t.interactions.enterFoodName}
            </p>

            <div className="flex gap-3 relative z-20">
              <div className="flex-1">
                <Autocomplete
                  type="food"
                  placeholder={t.interactions.foodPlaceholder}
                  onSelect={(val) => setQuickCheckFood(val)}
                  className=""
                />
              </div>
              <Button
                onClick={handleQuickCheck}
                className="h-10 px-8 bg-white text-primary hover:bg-white/90 font-semibold"
              >
                {t.common.check}
              </Button>
            </div>

            <p className="text-sm text-center text-white/60">
              Start typing to see suggestions from database
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Check Result */}
      {quickCheckResult && (
        <Card className={`animate-scale-in border-2 ${quickCheckResult.result.interactions.some((i) => i.severity === "danger" || i.severity === "high")
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : quickCheckResult.result.interactions.some((i) => i.severity === "caution" || i.severity === "moderate")
              ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
              : "border-green-500 bg-green-50 dark:bg-green-950/20"
          }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {quickCheckResult.result.interactions.some((i) => i.severity === "danger" || i.severity === "high") ? (
                <XCircle className="h-10 w-10 text-red-600 shrink-0" />
              ) : quickCheckResult.result.interactions.some((i) => i.severity === "caution" || i.severity === "moderate") ? (
                <AlertTriangle className="h-10 w-10 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle className="h-10 w-10 text-green-600 shrink-0" />
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  {quickCheckResult.food}
                  {quickCheckResult.result.interactions.some((i) => i.severity === "danger" || i.severity === "high")
                    ? ` - ${t.interactions.avoid}`
                    : quickCheckResult.result.interactions.some((i) => i.severity === "caution" || i.severity === "moderate")
                      ? ` - ${t.interactions.useCaution}`
                      : ` - ${t.interactions.safeToEat}`}
                </h3>
                {quickCheckResult.result.interactions.length > 0 ? (
                  <div className="space-y-3">
                    {quickCheckResult.result.interactions.map((interaction) => (
                      <div key={interaction.id} className="p-3 rounded-lg bg-white/50 dark:bg-black/20">
                        <p className="font-medium">
                          {t.interactions.with} {interaction.medicationName}:
                        </p>
                        <p className="text-muted-foreground">{interaction.reason}</p>
                        <p className="text-sm font-medium mt-1">
                          💡 {interaction.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {t.interactions.noInteractionsFound}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Medications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="h-5 w-5" />
            {t.interactions.yourMedications} ({userMedications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userMedications.map((med) => (
              <Badge key={med.id} variant="secondary" className="text-base py-1 px-3">
                {med.name} ({med.dosage})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="p-4 flex items-center gap-4">
            <XCircle className="h-10 w-10 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {dangerInteractions.length}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">{t.interactions.foodsToAvoid}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {cautionInteractions.length}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">{t.interactions.useCautionLabel}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {safeInteractions.length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">{t.interactions.safeFoods}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t.interactions.searchInteractions}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Interaction Lists */}
      <div className="space-y-8">
        {/* Danger */}
        {dangerInteractions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              {t.interactions.foodsToAvoid} ({dangerInteractions.length})
            </h2>
            <div className="space-y-4">
              {dangerInteractions.map((interaction, index) => (
                <div
                  key={interaction.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <InteractionAlert interaction={interaction} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caution */}
        {cautionInteractions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
              {t.interactions.useCautionLabel} ({cautionInteractions.length})
            </h2>
            <div className="space-y-4">
              {cautionInteractions.map((interaction, index) => (
                <div
                  key={interaction.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <InteractionAlert interaction={interaction} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe */}
        {safeInteractions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              {t.interactions.safeFoods} ({safeInteractions.length})
            </h2>
            <div className="space-y-4">
              {safeInteractions.map((interaction, index) => (
                <div
                  key={interaction.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <InteractionAlert interaction={interaction} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300">{t.interactions.importantDisclaimer}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {t.interactions.disclaimerText}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}