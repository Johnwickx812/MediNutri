# 🏥 MediNutri - Medical-Grade Food-Drug Interaction System

## Overview
MediNutri implements a **medical-grade food-drug interaction checking system** designed to protect users' health by providing accurate, evidence-based warnings about potential interactions between foods and medications.

## ⚕️ Medical Safety Features

### 1. **Comprehensive Interaction Database**
- **97 documented food-drug interactions** from medical literature
- Covers critical medications: Warfarin, Statins, ACE Inhibitors, MAO Inhibitors, Diabetes medications, and more
- Includes common foods: Grapefruit, Leafy greens, Dairy, Alcohol, Caffeine, and many others

### 2. **Severity Classification**
All interactions are classified by medical severity:

#### 🔴 **High Severity** (Life-threatening)
- Examples:
  - Grapefruit + Statins → Toxic drug levels
  - Warfarin + Leafy Greens → Reduced anticoagulation
  - MAO Inhibitors + Tyramine foods → Hypertensive crisis
  - Alcohol + Metronidazole → Severe reaction

#### 🟡 **Medium Severity** (Significant health risk)
- Examples:
  - Dairy + Tetracycline → Reduced antibiotic absorption
  - Cranberry juice + Warfarin → Increased bleeding risk
  - Ginger + Anticoagulants → Bleeding risk

#### 🟢 **Low Severity** (Minor effects)
- Examples:
  - Tea + Iron supplements → Reduced absorption
  - Nuts + Warfarin → Mild vitamin K effect

### 3. **Enhanced Matching Algorithm**
The system uses **fuzzy matching** to catch interactions even with:
- Partial food names (e.g., "leafy greens" matches "spinach", "kale")
- Generic vs. brand drug names
- Common misspellings
- Food categories (e.g., "dairy" matches "milk", "cheese", "yogurt")

### 4. **Multi-Level Safety Checks**

#### Individual Check
```
GET /api/search/interactions?food=Grapefruit&drug=Atorvastatin
```
Returns:
- Specific interaction details
- Severity level
- Medical description
- Risk assessment

#### Batch Check (Meal Planning)
```
POST /api/interactions/batch-check
{
  "foods": ["Spinach", "Grapefruit", "Milk"],
  "medications": ["Warfarin", "Atorvastatin"]
}
```
Returns:
- All interactions found
- Foods categorized by risk level
- Overall risk assessment
- Safe foods list

#### Drug Profile
```
GET /api/interactions/drug/Warfarin
```
Returns all foods that interact with a specific medication

### 5. **Drug Side Effects & Safety Profiles** (NEW)
Comprehensive safety data for **2,931+ medications**, including:
- **Severe Side Effects**: High-priority warnings (e.g., "Call doctor at once")
- **Common Side Effects**: Expected reactions
- **Medical Conditions**: Validated use cases
- **Safety Categories**: Pregnancy warnings, Alcohol interactions, Drug classes
- **User Ratings**: Real-world patient feedback

## 📊 Data Accuracy

### Sources
- Medical literature and clinical guidelines
- FDA drug interaction databases
- Peer-reviewed pharmacology research

### Validation
- Each interaction includes:
  - Mechanism of action
  - Clinical significance
  - Severity rating
  - Patient guidance

## 🎯 Use Cases

### 1. **Meal Planning**
Before preparing a meal, check if any ingredients interact with your medications:
```javascript
const mealIngredients = ["Spinach", "Tomatoes", "Olive oil", "Garlic"];
const userMedications = ["Warfarin", "Aspirin"];

// Batch check returns:
// - High risk: Spinach (Vitamin K reduces Warfarin effectiveness)
// - Medium risk: Garlic (Increases bleeding risk)
// - Safe: Tomatoes, Olive oil
```

### 2. **Grocery Shopping**
Check foods before purchasing to avoid dangerous interactions

### 3. **Restaurant Dining**
Quickly verify if menu items are safe with your medications

### 4. **Medication Review**
When starting a new medication, see what foods to avoid

## ⚠️ Critical Interactions to Know

### Warfarin (Blood Thinner)
**AVOID:**
- Leafy greens (Spinach, Kale, Broccoli) - High Vitamin K
- Cranberry juice - Increases bleeding risk
- Garlic, Ginger, Turmeric - Blood-thinning properties

### Statins (Cholesterol Medications)
**AVOID:**
- Grapefruit - Increases drug levels to toxic range
- Large amounts of alcohol - Liver damage risk

### MAO Inhibitors (Antidepressants)
**AVOID:**
- Aged cheese - Tyramine causes hypertensive crisis
- Smoked meats - High tyramine
- Soy sauce, Pickled foods - Fermented tyramine

### ACE Inhibitors (Blood Pressure)
**AVOID:**
- Bananas, Potatoes - High potassium → Hyperkalemia
- Salt substitutes - Potassium-based

### Diabetes Medications
**MONITOR:**
- High-sugar foods - Blood glucose spikes
- Alcohol - Unpredictable glucose effects
- Ginseng - May lower blood sugar too much

## 🔒 Safety Disclaimers

### Medical Disclaimer
```
⚕️ IMPORTANT MEDICAL NOTICE:
This application provides informational guidance only.
It is NOT a substitute for professional medical advice.

ALWAYS:
✓ Consult your healthcare provider before dietary changes
✓ Inform your doctor about all foods and supplements
✓ Follow your prescribed medication schedule
✓ Report any unusual symptoms immediately

NEVER:
✗ Stop medications without doctor approval
✗ Ignore severe symptoms
✗ Rely solely on this app for medical decisions
```

## 🚀 API Endpoints

### 1. Check Single Interaction
```http
GET /api/search/interactions?food=Spinach&drug=Warfarin
```

**Response:**
```json
{
  "success": true,
  "food": "Spinach",
  "drug": "Warfarin",
  "has_interaction": true,
  "risk_level": "danger",
  "interactions": [{
    "food_name": "Spinach",
    "drug_name": "Warfarin",
    "interaction_type": "Reduces drug effectiveness",
    "severity": "High",
    "description": "High vitamin K content interferes with anticoagulation"
  }],
  "severity_breakdown": {
    "high": 1,
    "medium": 0,
    "low": 0
  },
  "medical_note": "Always consult your healthcare provider..."
}
```

### 2. Batch Check Multiple Foods
```http
POST /api/interactions/batch-check
Content-Type: application/json

{
  "foods": ["Grapefruit", "Spinach", "Rice"],
  "medications": ["Atorvastatin", "Warfarin"]
}
```

**Response:**
```json
{
  "success": true,
  "total_foods_checked": 3,
  "total_medications_checked": 2,
  "interactions_found": 2,
  "safe_foods": ["Rice"],
  "risky_foods": {
    "high_risk": ["Grapefruit", "Spinach"],
    "medium_risk": [],
    "low_risk": []
  },
  "overall_risk": "high",
  "interactions": [...]
}
```

### 3. Get All Interactions for a Drug
```http
GET /api/interactions/drug/Warfarin
```

### 4. Drug Safety Profile
Get comprehensive side effects and safety info:
```http
GET /api/drugs/side-effects/{drug_name}
```
**Response:**
```json
{
  "drug_name": "Lipitor",
  "medical_condition": "High Cholesterol",
  "side_effects_severe": ["Unexplained muscle pain", "Weakness", "Fever"],
  "side_effects_common": ["Diarrhea", "Joint pain"],
  "rating": 7.5,
  "pregnancy_category": "X",
  "alcohol_warning": "Avoid drinking alcohol..."
}
```

### 5. Search Drug Safety
```http
GET /api/drugs/side-effects/search?q=Metformin
```
Returns matching drugs with safety summaries.

## 📱 Frontend Integration

### Check Safety Page
The "Check Safety" page allows users to:
1. Enter a food name
2. Automatically check against their medication list
3. See color-coded results:
   - 🔴 Red = High risk (AVOID)
   - 🟡 Yellow = Medium risk (CAUTION)
   - 🟢 Green = Safe to consume

### Real-time Warnings
When adding food to diet log, the system:
1. Checks against user's medications
2. Shows warning if interaction exists
3. Requires confirmation for risky foods

## 🔬 Technical Implementation

### Database Schema
```javascript
{
  food_name: "Grapefruit",
  drug_name: "Statins",
  interaction_type: "Increases drug levels",
  severity: "High",
  description: "Grapefruit can increase blood levels...",
  food_name_lower: "grapefruit",  // For exact matching
  drug_name_lower: "statins",
  food_keywords: ["grapefruit"],  // For fuzzy matching
  drug_keywords: ["statins"]
}
```

### Matching Algorithm
1. **Exact match** - Direct name comparison
2. **Partial match** - Substring search
3. **Keyword match** - Category/group matching
4. **Fuzzy match** - Handles variations

## 📈 Future Enhancements

### Planned Features
- [ ] Supplement-drug interactions
- [ ] Herb-drug interactions
- [ ] Alcohol-medication calculator
- [ ] Timing recommendations (e.g., "Take 2 hours before meals")
- [ ] Severity-based notifications
- [ ] Export interaction report for doctor

### Additional Datasets Needed
If you have access to:
- Supplement interaction data
- Herbal medicine interactions
- Regional food databases
- Clinical trial data

Please provide them for integration!

## 📞 Support

For medical emergencies: **Call emergency services immediately**

For questions about this system: Contact development team

---

**Remember: Your health is not a toy. This system is designed with medical accuracy in mind, but it's a tool to support—not replace—professional medical care.**
