import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/config";
import { MedicationCard } from "@/components/cards/MedicationCard";
import { ReminderManager } from "@/components/notifications/ReminderManager";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { Plus, Pill, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Medications() {
  const { userMedications, addMedication, removeMedication } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once daily",
    time: "08:00",
    category: "Other",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: t.common.error,
        description: t.medications.pleaseEnterName,
        variant: "destructive",
      });
      return;
    }

    addMedication({
      ...formData,
      id: Date.now().toString(),
    });

    toast({
      title: t.medications.medicationAdded,
      description: `${formData.name} ${t.medications.hasBeenAdded}`,
    });

    setFormData({
      name: "",
      dosage: "",
      frequency: "Once daily",
      time: "08:00",
      category: "Other",
    });
    setDialogOpen(false);
  };

  const handleSelectDrug = async (drugName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/drug/${encodeURIComponent(drugName)}`);
      const data = await response.json();

      if (data.success && data.drug) {
        const med = data.drug;
        // Construct medication object from API details and populate form
        setFormData({
          name: med["Medicine Name"],
          dosage: med["Composition"] || "",
          frequency: "Once daily", // Default
          time: "08:00", // Default
          category: "Prescription",
        });

        // Open the dialog to let the user confirm/edit details
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
      toast({
        title: "Error",
        description: "Failed to fetch drug details",
        variant: "destructive"
      });
    }
  };

  const handleRemove = (id: string) => {
    const med = userMedications.find((m) => m.id === id);
    removeMedication(id);
    toast({
      title: t.medications.medicationRemoved,
      description: med ? `${med.name} ${t.medications.hasBeenRemoved}` : t.medications.hasBeenRemoved,
    });
  };

  // Frequency options with translations
  const frequencyOptions = [
    { value: "Once daily", label: t.medications.onceDaily },
    { value: "Twice daily", label: t.medications.twiceDaily },
    { value: "Three times daily", label: t.medications.threeTimesDaily },
    { value: "As needed", label: t.medications.asNeeded },
  ];

  const medicationCategories = ["Prescription", "OTC", "Supplement", "Other"];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Pill className="h-8 w-8 text-primary" />
            {t.medications.myMedications}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.medications.trackAndManage}
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12 px-6">
              <Plus className="mr-2 h-5 w-5" />
              {t.medications.addMedication}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.medications.addNewMedication}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.medications.medicationName}</Label>
                <Input
                  id="name"
                  placeholder="e.g., Metformin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosage">{t.medications.dosage}</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t.medications.time}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.medications.frequency}</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {frequencyOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.medications.category}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      {medicationCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg">
                {t.medications.addMedication}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add Section - Moved to top for better accessibility */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-[2.5rem] overflow-visible">
        <CardContent className="p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              {t.medications.quickAddCommon}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
              <Info className="h-4 w-4" />
              <span>Official Drug Database</span>
            </div>
          </div>

          <div className="relative z-20">
            <Autocomplete
              type="drug"
              placeholder={t.medications.searchMedications}
              onSelect={handleSelectDrug}
              className="w-full h-14 text-lg rounded-full border-2 border-primary bg-slate-900/90 text-white placeholder:text-slate-400 shadow-none"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-[1.5rem] border border-primary/20 group hover:bg-primary/10 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Info className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {t.medications.clickToAdd}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Manager */}
      <ReminderManager />

      {/* User's Medications List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white uppercase px-2">
          {t.medications.yourMedications} ({userMedications.length})
        </h2>

        {userMedications.length === 0 ? (
          <Card className="border-2 border-dashed border-white/10 bg-white/5 rounded-[4rem]">
            <CardContent className="py-24 text-center">
              <Pill className="h-16 w-16 text-slate-600 mx-auto mb-6" />
              <h3 className="font-black text-2xl mb-2 text-slate-400">{t.medications.noMedicationsYet}</h3>
              <p className="text-slate-500 font-bold mb-8 max-w-sm mx-auto">
                {t.medications.noMedicationsDesc}
              </p>
              <Button onClick={() => setDialogOpen(true)} size="lg" className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" />
                {t.medications.addFirstMedication}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userMedications.map((med, index) => (
              <div
                key={med.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <MedicationCard medication={med} onRemove={handleRemove} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}