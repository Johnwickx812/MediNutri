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
      const response = await fetch(`http://localhost:8000/api/drug/${encodeURIComponent(drugName)}`);
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

      {/* Reminder Manager */}
      <ReminderManager />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User's Medications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t.medications.yourMedications} ({userMedications.length})
          </h2>

          {userMedications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{t.medications.noMedicationsYet}</h3>
                <p className="text-muted-foreground mb-4">
                  {t.medications.noMedicationsDesc}
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.medications.addFirstMedication}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
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

        {/* Quick Add Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t.medications.quickAddCommon}</h2>

          <div className="relative z-20">
            <Autocomplete
              type="drug"
              placeholder={t.medications.searchMedications}
              onSelect={handleSelectDrug}
              className="w-full"
            />
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="py-3 px-4 flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {t.medications.clickToAdd}
              </p>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Search above to find medicines from the official database.
          </p>
        </div>
      </div>
    </div>
  );
}