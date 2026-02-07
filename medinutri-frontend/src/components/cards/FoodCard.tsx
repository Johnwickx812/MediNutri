import { Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Food } from "@/data/foods";

interface FoodCardProps {
  food: Food;
  onAdd?: (food: Food) => void;
  isAdded?: boolean;
  compact?: boolean;
}

export function FoodCard({ food, onAdd, isAdded = false, compact = false }: FoodCardProps) {
  if (compact) {
    return (
      <Card className="card-hover">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium truncate">{food.name}</h4>
              {food.nameHindi && (
                <p className="text-sm text-muted-foreground truncate">{food.nameHindi}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium text-primary">{food.calories} cal</span>
              {onAdd && (
                <Button
                  size="icon"
                  variant={isAdded ? "default" : "outline"}
                  className="h-8 w-8"
                  onClick={() => onAdd(food)}
                  disabled={isAdded}
                >
                  {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{food.name}</h3>
              {food.nameHindi && (
                <p className="text-muted-foreground">{food.nameHindi}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{food.category}</Badge>
              {food.region && (
                <Badge variant="outline">{food.region}</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{food.calories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{food.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-medium">{food.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fat</span>
                <span className="font-medium">{food.fat}g</span>
              </div>
            </div>
          </div>
          
          {onAdd && (
            <Button
              size="icon"
              variant={isAdded ? "default" : "outline"}
              className="shrink-0 h-10 w-10"
              onClick={() => onAdd(food)}
              disabled={isAdded}
            >
              {isAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
