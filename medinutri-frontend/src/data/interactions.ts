export type InteractionSeverity = "safe" | "caution" | "danger";

export interface FoodDrugInteraction {
  id: string;
  medicationName: string;
  foodName: string;
  severity: InteractionSeverity;
  reason: string;
  recommendation: string;
}

// Real food-drug interactions database
export const foodDrugInteractions: FoodDrugInteraction[] = [
  // Warfarin interactions
  {
    id: "1",
    medicationName: "Warfarin",
    foodName: "Spinach",
    severity: "danger",
    reason: "High vitamin K content reduces warfarin's blood-thinning effect",
    recommendation: "Keep vitamin K intake consistent. Avoid sudden large increases in leafy greens.",
  },
  {
    id: "2",
    medicationName: "Warfarin",
    foodName: "Palak Paneer",
    severity: "danger",
    reason: "Spinach in palak paneer contains high vitamin K which counteracts warfarin",
    recommendation: "Limit portions and keep consumption consistent. Monitor INR levels.",
  },
  
  // Grapefruit interactions (affects many medications)
  {
    id: "3",
    medicationName: "Atorvastatin",
    foodName: "Grapefruit",
    severity: "danger",
    reason: "Grapefruit blocks enzyme that breaks down statins, increasing drug levels dangerously",
    recommendation: "Avoid grapefruit and grapefruit juice completely while on statins.",
  },
  {
    id: "4",
    medicationName: "Amlodipine",
    foodName: "Grapefruit",
    severity: "caution",
    reason: "Grapefruit may increase amlodipine levels in blood",
    recommendation: "Limit grapefruit consumption. Monitor for dizziness or swelling.",
  },
  {
    id: "5",
    medicationName: "Losartan",
    foodName: "Grapefruit",
    severity: "caution",
    reason: "Grapefruit may reduce the effectiveness of losartan",
    recommendation: "Avoid grapefruit or consume in moderation. Monitor blood pressure.",
  },
  
  // Metformin interactions
  {
    id: "6",
    medicationName: "Metformin",
    foodName: "Alcohol",
    severity: "danger",
    reason: "Alcohol increases risk of lactic acidosis and low blood sugar",
    recommendation: "Limit alcohol consumption. Never drink on an empty stomach.",
  },
  {
    id: "7",
    medicationName: "Metformin",
    foodName: "Rice (cooked)",
    severity: "caution",
    reason: "High glycemic index can spike blood sugar",
    recommendation: "Pair with vegetables and protein. Choose brown rice when possible.",
  },
  {
    id: "8",
    medicationName: "Metformin",
    foodName: "Chapati",
    severity: "safe",
    reason: "Whole wheat chapati has moderate glycemic index",
    recommendation: "Good choice for diabetics. Pair with dal and vegetables.",
  },
  {
    id: "9",
    medicationName: "Metformin",
    foodName: "Dal (Toor)",
    severity: "safe",
    reason: "High protein and fiber help stabilize blood sugar",
    recommendation: "Excellent choice. Good source of protein for diabetics.",
  },
  
  // Blood pressure medication interactions
  {
    id: "10",
    medicationName: "Lisinopril",
    foodName: "Banana",
    severity: "caution",
    reason: "Both increase potassium levels, risking hyperkalemia",
    recommendation: "Limit high-potassium foods. Get potassium levels checked regularly.",
  },
  {
    id: "11",
    medicationName: "Losartan",
    foodName: "Banana",
    severity: "caution",
    reason: "Losartan raises potassium; bananas add more",
    recommendation: "Enjoy in moderation. Monitor potassium levels.",
  },
  {
    id: "12",
    medicationName: "Amlodipine",
    foodName: "Orange",
    severity: "safe",
    reason: "No significant interaction",
    recommendation: "Safe to consume. Good source of vitamin C.",
  },
  
  // Thyroid medication
  {
    id: "13",
    medicationName: "Levothyroxine",
    foodName: "Coffee (with milk)",
    severity: "caution",
    reason: "Coffee reduces thyroid medication absorption",
    recommendation: "Wait 30-60 minutes after taking medication before drinking coffee.",
  },
  {
    id: "14",
    medicationName: "Levothyroxine",
    foodName: "Curd/Dahi",
    severity: "caution",
    reason: "Calcium in dairy reduces levothyroxine absorption",
    recommendation: "Wait 4 hours between medication and dairy products.",
  },
  {
    id: "15",
    medicationName: "Levothyroxine",
    foodName: "Paneer (100g)",
    severity: "caution",
    reason: "High calcium content interferes with absorption",
    recommendation: "Consume paneer at least 4 hours after taking medication.",
  },
  
  // Acid reflux medication
  {
    id: "16",
    medicationName: "Omeprazole",
    foodName: "Chai (with milk)",
    severity: "safe",
    reason: "No significant interaction when taken properly",
    recommendation: "Take omeprazole 30 minutes before meals for best effect.",
  },
  {
    id: "17",
    medicationName: "Omeprazole",
    foodName: "Samosa (1 pc)",
    severity: "caution",
    reason: "Fried foods worsen acid reflux symptoms",
    recommendation: "Limit fried foods to reduce acid reflux symptoms.",
  },
  
  // Aspirin interactions
  {
    id: "18",
    medicationName: "Aspirin",
    foodName: "Alcohol",
    severity: "danger",
    reason: "Increases risk of stomach bleeding significantly",
    recommendation: "Avoid alcohol or limit to very small amounts.",
  },
  {
    id: "19",
    medicationName: "Aspirin",
    foodName: "Fish Curry",
    severity: "safe",
    reason: "Omega-3 in fish may enhance heart benefits",
    recommendation: "Good choice. Fish is heart-healthy.",
  },
  
  // Cholesterol medication
  {
    id: "20",
    medicationName: "Atorvastatin",
    foodName: "Puri (2 pcs)",
    severity: "caution",
    reason: "High saturated fat works against cholesterol medication",
    recommendation: "Limit fried foods. Choose baked or grilled options.",
  },
  {
    id: "21",
    medicationName: "Atorvastatin",
    foodName: "Moong Dal",
    severity: "safe",
    reason: "Low fat, high fiber supports cholesterol management",
    recommendation: "Excellent choice for heart health.",
  },
  
  // General safe foods for common medications
  {
    id: "22",
    medicationName: "Metformin",
    foodName: "Idli (2 pcs)",
    severity: "safe",
    reason: "Fermented food with moderate glycemic index",
    recommendation: "Good breakfast option. Pair with sambar for protein.",
  },
  {
    id: "23",
    medicationName: "Amlodipine",
    foodName: "Dal (Toor)",
    severity: "safe",
    reason: "No interaction. Good protein source",
    recommendation: "Safe to consume. Healthy meal component.",
  },
  {
    id: "24",
    medicationName: "Metformin",
    foodName: "Sambar",
    severity: "safe",
    reason: "Vegetables and lentils provide fiber and slow sugar release",
    recommendation: "Excellent choice for blood sugar management.",
  },
  {
    id: "25",
    medicationName: "Losartan",
    foodName: "Chapati",
    severity: "safe",
    reason: "No interaction with blood pressure medication",
    recommendation: "Safe to consume as part of regular diet.",
  },
  
  // More Indian food specific interactions
  {
    id: "26",
    medicationName: "Lisinopril",
    foodName: "Rajma",
    severity: "caution",
    reason: "High potassium content may add to medication's potassium-sparing effect",
    recommendation: "Enjoy in moderation. Monitor potassium levels.",
  },
  {
    id: "27",
    medicationName: "Atorvastatin",
    foodName: "Dosa",
    severity: "safe",
    reason: "Fermented food with low fat content",
    recommendation: "Good choice. Avoid adding too much oil.",
  },
  {
    id: "28",
    medicationName: "Omeprazole",
    foodName: "Rasam",
    severity: "safe",
    reason: "Light, easily digestible soup",
    recommendation: "Excellent for digestion. Soothing for stomach.",
  },
  {
    id: "29",
    medicationName: "Metformin",
    foodName: "Buttermilk/Chaas",
    severity: "safe",
    reason: "Low calorie, probiotic drink",
    recommendation: "Great choice for diabetics. Aids digestion.",
  },
  {
    id: "30",
    medicationName: "Aspirin",
    foodName: "Green Tea",
    severity: "caution",
    reason: "May slightly enhance blood-thinning effect",
    recommendation: "Limit to 1-2 cups daily. Monitor for bruising.",
  },
];

// Function to check interaction between a medication and food
export function checkInteraction(
  medicationName: string,
  foodName: string
): FoodDrugInteraction | null {
  const normalizedMed = medicationName.toLowerCase().trim();
  const normalizedFood = foodName.toLowerCase().trim();
  
  return foodDrugInteractions.find(
    (interaction) =>
      interaction.medicationName.toLowerCase().includes(normalizedMed) ||
      normalizedMed.includes(interaction.medicationName.toLowerCase())
  ) && foodDrugInteractions.find(
    (interaction) =>
      interaction.foodName.toLowerCase().includes(normalizedFood) ||
      normalizedFood.includes(interaction.foodName.toLowerCase())
  )
    ? foodDrugInteractions.find(
        (interaction) =>
          (interaction.medicationName.toLowerCase().includes(normalizedMed) ||
            normalizedMed.includes(interaction.medicationName.toLowerCase())) &&
          (interaction.foodName.toLowerCase().includes(normalizedFood) ||
            normalizedFood.includes(interaction.foodName.toLowerCase()))
      ) || null
    : null;
}

// Function to get all interactions for a list of medications
export function getInteractionsForMedications(
  medications: string[]
): FoodDrugInteraction[] {
  const normalizedMeds = medications.map((m) => m.toLowerCase().trim());
  
  return foodDrugInteractions.filter((interaction) =>
    normalizedMeds.some(
      (med) =>
        interaction.medicationName.toLowerCase().includes(med) ||
        med.includes(interaction.medicationName.toLowerCase())
    )
  );
}

// Function to check if a food is safe with all medications
export function checkFoodSafety(
  foodName: string,
  medications: string[]
): { isSafe: boolean; interactions: FoodDrugInteraction[] } {
  const normalizedFood = foodName.toLowerCase().trim();
  const normalizedMeds = medications.map((m) => m.toLowerCase().trim());
  
  const relevantInteractions = foodDrugInteractions.filter(
    (interaction) =>
      (interaction.foodName.toLowerCase().includes(normalizedFood) ||
        normalizedFood.includes(interaction.foodName.toLowerCase())) &&
      normalizedMeds.some(
        (med) =>
          interaction.medicationName.toLowerCase().includes(med) ||
          med.includes(interaction.medicationName.toLowerCase())
      )
  );
  
  const hasDanger = relevantInteractions.some((i) => i.severity === "danger");
  const hasCaution = relevantInteractions.some((i) => i.severity === "caution");
  
  return {
    isSafe: !hasDanger && !hasCaution,
    interactions: relevantInteractions,
  };
}
