/**
 * UserProfileCard Component
 * 
 * Collects and displays user health profile for AI personalization.
 * Data is stored locally and sent as context to the AI.
 */

import { useState } from "react";
import { User, Edit2, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAIChat, UserProfile } from "@/hooks/useAIChat";
import { useLanguage } from "@/context/LanguageContext";

export function UserProfileCard() {
  const { t } = useLanguage();
  const { userProfile, updateProfile } = useAIChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  // Calculate BMI
  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height) return undefined;
    const heightM = height / 100;
    return Math.round((weight / (heightM * heightM)) * 10) / 10;
  };

  const handleSave = () => {
    const bmi = calculateBMI(editedProfile.weight_kg, editedProfile.height_cm);
    updateProfile({ ...editedProfile, bmi });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const isProfileComplete = userProfile.age && userProfile.gender && 
    userProfile.weight_kg && userProfile.height_cm;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          {t.ai.healthProfile}
        </CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!isProfileComplete && !isEditing && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm mb-2">{t.ai.completeProfile}</p>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              {t.ai.addProfile}
            </Button>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t.ai.age}</Label>
                <Input
                  type="number"
                  value={editedProfile.age || ""}
                  onChange={(e) => setEditedProfile(prev => ({ 
                    ...prev, 
                    age: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="25"
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">{t.ai.gender}</Label>
                <Select
                  value={editedProfile.gender || ""}
                  onValueChange={(v) => setEditedProfile(prev => ({ ...prev, gender: v }))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={t.ai.select} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t.ai.male}</SelectItem>
                    <SelectItem value="female">{t.ai.female}</SelectItem>
                    <SelectItem value="other">{t.ai.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t.ai.weightKg}</Label>
                <Input
                  type="number"
                  value={editedProfile.weight_kg || ""}
                  onChange={(e) => setEditedProfile(prev => ({ 
                    ...prev, 
                    weight_kg: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  placeholder="70"
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">{t.ai.heightCm}</Label>
                <Input
                  type="number"
                  value={editedProfile.height_cm || ""}
                  onChange={(e) => setEditedProfile(prev => ({ 
                    ...prev, 
                    height_cm: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  placeholder="170"
                  className="h-8"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <Label className="text-xs">{t.ai.activityLevel}</Label>
              <Select
                value={editedProfile.activity_level || ""}
                onValueChange={(v) => setEditedProfile(prev => ({ ...prev, activity_level: v }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t.ai.select} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">{t.ai.sedentary}</SelectItem>
                  <SelectItem value="light">{t.ai.lightActive}</SelectItem>
                  <SelectItem value="moderate">{t.ai.moderateActive}</SelectItem>
                  <SelectItem value="active">{t.ai.active}</SelectItem>
                  <SelectItem value="very_active">{t.ai.veryActive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Diet Type */}
            <div>
              <Label className="text-xs">{t.ai.dietType}</Label>
              <Select
                value={editedProfile.diet_type || ""}
                onValueChange={(v) => setEditedProfile(prev => ({ ...prev, diet_type: v }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t.ai.select} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">{t.ai.vegetarian}</SelectItem>
                  <SelectItem value="non_vegetarian">{t.ai.nonVegetarian}</SelectItem>
                  <SelectItem value="vegan">{t.ai.vegan}</SelectItem>
                  <SelectItem value="eggetarian">{t.ai.eggetarian}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Primary Goal */}
            <div>
              <Label className="text-xs">{t.ai.primaryGoal}</Label>
              <Select
                value={editedProfile.primary_goal || ""}
                onValueChange={(v) => setEditedProfile(prev => ({ ...prev, primary_goal: v }))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder={t.ai.select} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">{t.ai.weightLoss}</SelectItem>
                  <SelectItem value="weight_gain">{t.ai.weightGain}</SelectItem>
                  <SelectItem value="maintain">{t.ai.maintainWeight}</SelectItem>
                  <SelectItem value="manage_diabetes">{t.ai.manageDiabetes}</SelectItem>
                  <SelectItem value="heart_health">{t.ai.heartHealth}</SelectItem>
                  <SelectItem value="general_wellness">{t.ai.generalWellness}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : isProfileComplete ? (
          <div className="space-y-3">
            {/* Display profile info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t.ai.age}:</span>
                <span className="ml-1 font-medium">{userProfile.age}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t.ai.gender}:</span>
                <span className="ml-1 font-medium capitalize">{userProfile.gender}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t.ai.weight}:</span>
                <span className="ml-1 font-medium">{userProfile.weight_kg} kg</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t.ai.height}:</span>
                <span className="ml-1 font-medium">{userProfile.height_cm} cm</span>
              </div>
            </div>

            {/* BMI Badge */}
            {userProfile.bmi && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">BMI:</span>
                <Badge variant={
                  userProfile.bmi < 18.5 ? "secondary" :
                  userProfile.bmi < 25 ? "default" :
                  userProfile.bmi < 30 ? "secondary" : "destructive"
                }>
                  {userProfile.bmi} - {
                    userProfile.bmi < 18.5 ? t.ai.underweight :
                    userProfile.bmi < 25 ? t.ai.normal :
                    userProfile.bmi < 30 ? t.ai.overweight : t.ai.obese
                  }
                </Badge>
              </div>
            )}

            {/* Other info */}
            {userProfile.activity_level && (
              <div className="text-sm">
                <span className="text-muted-foreground">{t.ai.activity}:</span>
                <span className="ml-1 capitalize">{userProfile.activity_level.replace("_", " ")}</span>
              </div>
            )}
            {userProfile.diet_type && (
              <div className="text-sm">
                <span className="text-muted-foreground">{t.ai.diet}:</span>
                <span className="ml-1 capitalize">{userProfile.diet_type.replace("_", " ")}</span>
              </div>
            )}
            {userProfile.primary_goal && (
              <div className="text-sm">
                <span className="text-muted-foreground">{t.ai.goal}:</span>
                <span className="ml-1 capitalize">{userProfile.primary_goal.replace("_", " ")}</span>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
