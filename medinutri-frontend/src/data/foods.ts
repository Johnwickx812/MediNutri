export interface Food {
  id: string;
  name: string;
  nameHindi?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  region?: string;
}

export const indianFoods: Food[] = [
  // Grains & Breads
  { id: "1", name: "Rice (cooked)", nameHindi: "चावल", category: "Grains", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, region: "Pan-India" },
  { id: "2", name: "Chapati", nameHindi: "चपाती", category: "Breads", calories: 104, protein: 3.1, carbs: 18, fat: 2.5, fiber: 2.0, region: "North India" },
  { id: "3", name: "Dosa", nameHindi: "डोसा", category: "Breads", calories: 168, protein: 4.0, carbs: 29, fat: 4.0, fiber: 1.0, region: "South India" },
  { id: "4", name: "Idli (2 pcs)", nameHindi: "इडली", category: "Breads", calories: 78, protein: 2.0, carbs: 16, fat: 0.2, fiber: 0.8, region: "South India" },
  { id: "5", name: "Paratha", nameHindi: "पराठा", category: "Breads", calories: 260, protein: 5.0, carbs: 32, fat: 12, fiber: 2.0, region: "North India" },
  { id: "6", name: "Roti", nameHindi: "रोटी", category: "Breads", calories: 71, protein: 2.7, carbs: 15, fat: 0.4, fiber: 1.9, region: "Pan-India" },
  { id: "7", name: "Puri (2 pcs)", nameHindi: "पूरी", category: "Breads", calories: 180, protein: 3.0, carbs: 22, fat: 9, fiber: 1.0, region: "Pan-India" },
  
  // Lentils & Pulses
  { id: "8", name: "Dal (Toor)", nameHindi: "तूर दाल", category: "Lentils", calories: 116, protein: 7.0, carbs: 20, fat: 0.4, fiber: 5.0, region: "Pan-India" },
  { id: "9", name: "Chana Dal", nameHindi: "चना दाल", category: "Lentils", calories: 140, protein: 8.0, carbs: 23, fat: 1.5, fiber: 6.0, region: "Pan-India" },
  { id: "10", name: "Moong Dal", nameHindi: "मूंग दाल", category: "Lentils", calories: 105, protein: 7.0, carbs: 18, fat: 0.4, fiber: 4.0, region: "Pan-India" },
  { id: "11", name: "Rajma", nameHindi: "राजमा", category: "Lentils", calories: 127, protein: 8.5, carbs: 22, fat: 0.5, fiber: 6.5, region: "North India" },
  { id: "12", name: "Chole", nameHindi: "छोले", category: "Lentils", calories: 164, protein: 9.0, carbs: 27, fat: 2.6, fiber: 7.5, region: "North India" },
  
  // Vegetables
  { id: "13", name: "Palak Paneer", nameHindi: "पालक पनीर", category: "Curry", calories: 230, protein: 12, carbs: 8, fat: 18, fiber: 3.0, region: "North India" },
  { id: "14", name: "Aloo Gobi", nameHindi: "आलू गोभी", category: "Curry", calories: 130, protein: 3.0, carbs: 18, fat: 5.0, fiber: 4.0, region: "North India" },
  { id: "15", name: "Bhindi Fry", nameHindi: "भिंडी", category: "Vegetables", calories: 90, protein: 2.0, carbs: 8, fat: 6.0, fiber: 3.0, region: "Pan-India" },
  { id: "16", name: "Baingan Bharta", nameHindi: "बैंगन भर्ता", category: "Vegetables", calories: 110, protein: 2.5, carbs: 12, fat: 6.0, fiber: 4.0, region: "North India" },
  { id: "17", name: "Mixed Vegetable Curry", nameHindi: "मिक्स सब्जी", category: "Curry", calories: 140, protein: 4.0, carbs: 15, fat: 7.0, fiber: 5.0, region: "Pan-India" },
  { id: "18", name: "Sambar", nameHindi: "सांभर", category: "Curry", calories: 95, protein: 5.0, carbs: 14, fat: 2.0, fiber: 4.0, region: "South India" },
  { id: "19", name: "Rasam", nameHindi: "रसम", category: "Soup", calories: 45, protein: 1.5, carbs: 8, fat: 0.8, fiber: 1.0, region: "South India" },
  
  // Non-Veg
  { id: "20", name: "Chicken Curry", nameHindi: "चिकन करी", category: "Non-Veg", calories: 250, protein: 25, carbs: 8, fat: 14, fiber: 1.0, region: "Pan-India" },
  { id: "21", name: "Fish Curry", nameHindi: "मछली करी", category: "Non-Veg", calories: 200, protein: 22, carbs: 6, fat: 10, fiber: 0.5, region: "Coastal" },
  { id: "22", name: "Egg Curry", nameHindi: "अंडा करी", category: "Non-Veg", calories: 180, protein: 12, carbs: 6, fat: 12, fiber: 1.0, region: "Pan-India" },
  { id: "23", name: "Mutton Curry", nameHindi: "मटन करी", category: "Non-Veg", calories: 290, protein: 26, carbs: 6, fat: 18, fiber: 0.5, region: "North India" },
  
  // Dairy
  { id: "24", name: "Curd/Dahi", nameHindi: "दही", category: "Dairy", calories: 60, protein: 3.5, carbs: 5, fat: 3.0, fiber: 0, region: "Pan-India" },
  { id: "25", name: "Paneer (100g)", nameHindi: "पनीर", category: "Dairy", calories: 265, protein: 18, carbs: 3, fat: 20, fiber: 0, region: "North India" },
  { id: "26", name: "Buttermilk/Chaas", nameHindi: "छाछ", category: "Dairy", calories: 40, protein: 2.0, carbs: 4, fat: 1.5, fiber: 0, region: "Pan-India" },
  { id: "27", name: "Lassi (Sweet)", nameHindi: "लस्सी", category: "Dairy", calories: 150, protein: 4.0, carbs: 25, fat: 4.0, fiber: 0, region: "North India" },
  
  // Fruits
  { id: "28", name: "Banana", nameHindi: "केला", category: "Fruits", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.0, region: "Pan-India" },
  { id: "29", name: "Mango", nameHindi: "आम", category: "Fruits", calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, region: "Pan-India" },
  { id: "30", name: "Papaya", nameHindi: "पपीता", category: "Fruits", calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, region: "Pan-India" },
  { id: "31", name: "Orange", nameHindi: "संतरा", category: "Fruits", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.0, region: "Pan-India" },
  { id: "32", name: "Apple", nameHindi: "सेब", category: "Fruits", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.0, region: "Pan-India" },
  { id: "33", name: "Pomegranate", nameHindi: "अनार", category: "Fruits", calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4.0, region: "Pan-India" },
  { id: "34", name: "Grapes", nameHindi: "अंगूर", category: "Fruits", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, region: "Pan-India" },
  { id: "35", name: "Grapefruit", nameHindi: "चकोतरा", category: "Fruits", calories: 52, protein: 0.9, carbs: 13, fat: 0.2, fiber: 2.0, region: "Pan-India" },
  
  // Snacks
  { id: "36", name: "Samosa (1 pc)", nameHindi: "समोसा", category: "Snacks", calories: 262, protein: 4.0, carbs: 32, fat: 13, fiber: 2.5, region: "Pan-India" },
  { id: "37", name: "Pakora (4 pcs)", nameHindi: "पकोड़ा", category: "Snacks", calories: 150, protein: 3.0, carbs: 14, fat: 9.0, fiber: 1.5, region: "Pan-India" },
  { id: "38", name: "Upma", nameHindi: "उपमा", category: "Breakfast", calories: 180, protein: 4.0, carbs: 30, fat: 5.0, fiber: 3.0, region: "South India" },
  { id: "39", name: "Poha", nameHindi: "पोहा", category: "Breakfast", calories: 160, protein: 3.0, carbs: 28, fat: 4.0, fiber: 2.0, region: "Central India" },
  
  // Drinks
  { id: "40", name: "Chai (with milk)", nameHindi: "चाय", category: "Beverages", calories: 50, protein: 1.5, carbs: 6, fat: 2.0, fiber: 0, region: "Pan-India" },
  { id: "41", name: "Coffee (with milk)", nameHindi: "कॉफी", category: "Beverages", calories: 45, protein: 1.5, carbs: 5, fat: 2.0, fiber: 0, region: "South India" },
  { id: "42", name: "Green Tea", nameHindi: "ग्रीन टी", category: "Beverages", calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, region: "Pan-India" },
  { id: "43", name: "Nimbu Pani", nameHindi: "नींबू पानी", category: "Beverages", calories: 25, protein: 0.1, carbs: 6, fat: 0, fiber: 0, region: "Pan-India" },
];

export const foodCategories = [
  "Grains",
  "Breads",
  "Lentils",
  "Curry",
  "Vegetables",
  "Non-Veg",
  "Dairy",
  "Fruits",
  "Snacks",
  "Breakfast",
  "Beverages",
  "Soup",
];
