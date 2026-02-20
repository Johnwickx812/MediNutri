import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Food } from "@/data/foods";
import { Minus, Plus, Scale } from "lucide-react";

interface QuantitySelectorProps {
    food: Food;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (food: Food, quantity: number, unit: string) => void;
}

// Common serving sizes for different food categories
const servingSizes: Record<string, { value: number; label: string; unit: string }[]> = {
    default: [
        { value: 100, label: "100g (Standard)", unit: "g" },
        { value: 50, label: "50g (Half serving)", unit: "g" },
        { value: 150, label: "150g (Large serving)", unit: "g" },
        { value: 200, label: "200g (Extra large)", unit: "g" },
    ],
    cereals: [
        { value: 30, label: "1 katori (30g)", unit: "g" },
        { value: 60, label: "2 katori (60g)", unit: "g" },
        { value: 100, label: "100g", unit: "g" },
        { value: 150, label: "1 plate (150g)", unit: "g" },
    ],
    vegetables: [
        { value: 50, label: "½ katori (50g)", unit: "g" },
        { value: 100, label: "1 katori (100g)", unit: "g" },
        { value: 150, label: "1½ katori (150g)", unit: "g" },
        { value: 200, label: "1 plate (200g)", unit: "g" },
    ],
    fruits: [
        { value: 100, label: "1 small (100g)", unit: "g" },
        { value: 150, label: "1 medium (150g)", unit: "g" },
        { value: 200, label: "1 large (200g)", unit: "g" },
    ],
    dairy: [
        { value: 250, label: "1 cup (250ml)", unit: "ml" },
        { value: 500, label: "2 cups (500ml)", unit: "ml" },
        { value: 100, label: "100g", unit: "g" },
    ],
    breakfast: [
        { value: 100, label: "1 piece (100g)", unit: "g" },
        { value: 150, label: "1 serving (150g)", unit: "g" },
        { value: 200, label: "Large serving (200g)", unit: "g" },
    ],
    lunch: [
        { value: 150, label: "1 serving (150g)", unit: "g" },
        { value: 250, label: "1 plate (250g)", unit: "g" },
        { value: 300, label: "Large plate (300g)", unit: "g" },
    ],
    dinner: [
        { value: 150, label: "1 serving (150g)", unit: "g" },
        { value: 250, label: "1 plate (250g)", unit: "g" },
        { value: 300, label: "Large plate (300g)", unit: "g" },
    ],
    snacks: [
        { value: 50, label: "Small portion (50g)", unit: "g" },
        { value: 100, label: "1 serving (100g)", unit: "g" },
        { value: 150, label: "Large portion (150g)", unit: "g" },
    ],
};

// Function to get the appropriate serving sizes based on food category
function getServingSizes(category: string | undefined): { value: number; label: string; unit: string }[] {
    if (!category) return servingSizes.default;

    // Normalize category name to lowercase and remove special characters
    const normalizedCategory = category.toLowerCase().trim();

    // Check for exact match first
    if (servingSizes[normalizedCategory]) {
        return servingSizes[normalizedCategory];
    }

    // Check for partial matches
    if (normalizedCategory.includes("cereal") || normalizedCategory.includes("millet") || normalizedCategory.includes("grain")) {
        return servingSizes.cereals;
    }
    if (normalizedCategory.includes("vegetable") || normalizedCategory.includes("veg")) {
        return servingSizes.vegetables;
    }
    if (normalizedCategory.includes("fruit")) {
        return servingSizes.fruits;
    }
    if (normalizedCategory.includes("dairy") || normalizedCategory.includes("milk") || normalizedCategory.includes("yogurt") || normalizedCategory.includes("cheese")) {
        return servingSizes.dairy;
    }
    if (normalizedCategory.includes("breakfast")) {
        return servingSizes.breakfast;
    }
    if (normalizedCategory.includes("lunch")) {
        return servingSizes.lunch;
    }
    if (normalizedCategory.includes("dinner")) {
        return servingSizes.dinner;
    }
    if (normalizedCategory.includes("snack")) {
        return servingSizes.snacks;
    }

    // Default fallback
    return servingSizes.default;
}

export function QuantitySelector({ food, isOpen, onClose, onAdd }: QuantitySelectorProps) {
    const [quantity, setQuantity] = useState(100);
    const [unit, setUnit] = useState("g");
    const [selectedPreset, setSelectedPreset] = useState("100");

    const presets = getServingSizes(food.category);

    // Calculate nutritional values based on quantity
    const multiplier = quantity / 100;
    const calculatedNutrition = {
        calories: (food.calories * multiplier).toFixed(2),
        protein: (food.protein * multiplier).toFixed(2),
        carbs: (food.carbs * multiplier).toFixed(2),
        fat: (food.fat * multiplier).toFixed(2),
        fiber: food.fiber ? (food.fiber * multiplier).toFixed(2) : "0.00",
    };

    const handlePresetChange = (value: string) => {
        setSelectedPreset(value);
        const preset = presets.find((p) => p.value.toString() === value);
        if (preset) {
            setQuantity(preset.value);
            setUnit(preset.unit);
        }
    };

    const handleCustomQuantityChange = (value: string) => {
        const num = parseFloat(value);
        if (!isNaN(num) && num > 0) {
            setQuantity(num);
            setSelectedPreset("custom");
        }
    };

    const incrementQuantity = (amount: number) => {
        setQuantity((prev) => Math.max(1, prev + amount));
        setSelectedPreset("custom");
    };

    const handleAdd = () => {
        const adjustedFood: Food = {
            ...food,
            calories: parseFloat(calculatedNutrition.calories),
            protein: parseFloat(calculatedNutrition.protein),
            carbs: parseFloat(calculatedNutrition.carbs),
            fat: parseFloat(calculatedNutrition.fat),
            fiber: parseFloat(calculatedNutrition.fiber),
        };
        onAdd(adjustedFood, quantity, unit);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Scale className="h-5 w-5 text-primary" />
                        {food.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Preset Servings */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Quick Select Serving</Label>
                        <Select value={selectedPreset} onValueChange={handlePresetChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select serving size" />
                            </SelectTrigger>
                            <SelectContent>
                                {presets.map((preset) => (
                                    <SelectItem key={preset.value} value={preset.value.toString()}>
                                        {preset.label}
                                    </SelectItem>
                                ))}
                                <SelectItem value="custom">Custom Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Quantity Input */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Custom Quantity</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => incrementQuantity(-10)}
                                className="h-10 w-10"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 flex gap-2">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleCustomQuantityChange(e.target.value)}
                                    className="text-center text-lg font-semibold"
                                    min="1"
                                />
                                <Select value={unit} onValueChange={setUnit}>
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="g">g</SelectItem>
                                        <SelectItem value="ml">ml</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => incrementQuantity(10)}
                                className="h-10 w-10"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Nutritional Preview */}
                    <div className="bg-primary/5 rounded-xl p-4 space-y-3 border-2 border-primary/10">
                        <h4 className="font-semibold text-sm text-primary/80 uppercase tracking-wide">
                            Nutritional Values
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-primary">{calculatedNutrition.calories}</p>
                                <p className="text-xs text-muted-foreground mt-1">Calories</p>
                            </div>
                            <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">{calculatedNutrition.protein}g</p>
                                <p className="text-xs text-muted-foreground mt-1">Protein</p>
                            </div>
                            <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-amber-600">{calculatedNutrition.carbs}g</p>
                                <p className="text-xs text-muted-foreground mt-1">Carbs</p>
                            </div>
                            <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-rose-600">{calculatedNutrition.fat}g</p>
                                <p className="text-xs text-muted-foreground mt-1">Fat</p>
                            </div>
                        </div>
                        {parseFloat(calculatedNutrition.fiber) > 0 && (
                            <div className="bg-background rounded-lg p-3 text-center">
                                <p className="text-lg font-bold text-green-600">{calculatedNutrition.fiber}g</p>
                                <p className="text-xs text-muted-foreground mt-1">Fiber</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} className="min-w-[120px]">
                        Add to Log
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
