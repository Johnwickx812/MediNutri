export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  category: string;
}

export const commonMedications: Medication[] = [
  { id: "1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "08:00", category: "Diabetes" },
  { id: "2", name: "Atorvastatin", dosage: "10mg", frequency: "Once daily", time: "21:00", category: "Cholesterol" },
  { id: "3", name: "Amlodipine", dosage: "5mg", frequency: "Once daily", time: "08:00", category: "Blood Pressure" },
  { id: "4", name: "Omeprazole", dosage: "20mg", frequency: "Once daily", time: "07:00", category: "Acid Reflux" },
  { id: "5", name: "Losartan", dosage: "50mg", frequency: "Once daily", time: "09:00", category: "Blood Pressure" },
  { id: "6", name: "Aspirin", dosage: "75mg", frequency: "Once daily", time: "08:00", category: "Heart" },
  { id: "7", name: "Levothyroxine", dosage: "50mcg", frequency: "Once daily", time: "06:00", category: "Thyroid" },
  { id: "8", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "08:00", category: "Blood Pressure" },
];

export const medicationCategories = [
  "Diabetes",
  "Blood Pressure",
  "Cholesterol",
  "Heart",
  "Thyroid",
  "Acid Reflux",
  "Pain Relief",
  "Antibiotics",
  "Other",
];
