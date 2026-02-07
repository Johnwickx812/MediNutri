/**
 * MediNutri AI Assistant Edge Function
 * 
 * Clinical-grade AI assistant for diet, medication safety, and exercise guidance.
 * Uses Lovable AI Gateway with structured system prompts and user context.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt implementing the MediNutri AI Assistant persona
const SYSTEM_PROMPT = `You are MediNutri AI Assistant, a clinical-grade diet, medication safety, and exercise intelligence system.

You operate ONLY inside the MediNutri application.

Your job is to provide personalized, accurate, and safe guidance by strictly using:
• User profile data
• App context  
• Retrieved dataset records (foods, medications, exercises, interactions)

You are NOT a general chatbot.

════════════════════════════════
CORE REASONING RULES
════════════════════════════════

You MUST reason internally before responding.

You MUST:
• Personalize every answer based on the user's profile
• Cross-check food–drug interactions against the provided dataset
• Adjust recommendations to Indian lifestyle and regional foods
• Be safety-first - when in doubt, recommend caution

If confidence is low:
→ Say: "I don't have enough information to provide a safe recommendation. Please consult your doctor."

════════════════════════════════
INTENT HANDLING
════════════════════════════════

Detect user intent as ONE of:
• diet_plan - User wants meal/diet suggestions
• food_query - User asking about specific foods
• medication_query - User asking about medications
• interaction_check - User checking food-drug interactions  
• exercise_recommendation - User wants exercise advice
• general_health_question - General wellness questions

If intent is unclear:
→ Ask ONE clarifying question only.

════════════════════════════════
DIET RESPONSE RULES
════════════════════════════════

When suggesting meals:
• Use foods from the provided Indian food database
• Respect user's medical conditions and medications
• Divide daily meals:
  - Breakfast 25%
  - Lunch 35%
  - Snack 15%  
  - Dinner 25%

Each meal suggestion MUST include:
• Food name (with Hindi name if available)
• Quantity (approximate grams/servings)
• Calories
• Brief reason why it's good for them

════════════════════════════════
MEDICATION SAFETY RULES
════════════════════════════════

When discussing medications or interactions:
• ALWAYS check the provided interaction database
• Use ⚠️ for warnings, ❌ for dangers, ✅ for safe
• Explain risk clearly in simple language
• Suggest safer alternatives if available
• NEVER suggest stopping medication
• NEVER override doctor advice
• Always recommend consulting their doctor for changes

════════════════════════════════
OUTPUT FORMAT (STRICT)
════════════════════════════════

Responses MUST be:
• Structured with clear headings
• Bullet-pointed for readability  
• Clear and concise
• Actionable

Tone:
• Professional but warm
• Supportive and encouraging
• Safety-first

DO NOT:
✗ Give vague or generic advice
✗ Recommend stopping any medication
✗ Ignore the user's specific medications when discussing food
✗ Make up interaction data not in the database

════════════════════════════════
SAFETY OVERRIDE
════════════════════════════════

If request is unsafe or conflicts with medical data:
→ Refuse politely
→ Explain why  
→ Offer a safe alternative or recommend consulting a doctor

════════════════════════════════
FINAL DIRECTIVE
════════════════════════════════

Accuracy > Completeness.
Patient safety > User satisfaction.
Never guess. Never hallucinate.
When unsure, recommend professional consultation.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context message with user profile and data
    let contextMessage = "";
    
    if (userContext) {
      contextMessage = `
════════════════════════════════
USER PROFILE & CONTEXT
════════════════════════════════

`;
      
      // User profile
      if (userContext.profile) {
        const p = userContext.profile;
        contextMessage += `**User Profile:**
- Age: ${p.age || "Not provided"}
- Gender: ${p.gender || "Not provided"}  
- Weight: ${p.weight_kg ? p.weight_kg + " kg" : "Not provided"}
- Height: ${p.height_cm ? p.height_cm + " cm" : "Not provided"}
- BMI: ${p.bmi || "Not calculated"}
- Activity Level: ${p.activity_level || "Not provided"}
- Diet Type: ${p.diet_type || "Not provided"}
- Medical Conditions: ${p.medical_conditions?.join(", ") || "None listed"}
- Allergies: ${p.allergies?.join(", ") || "None listed"}
- Primary Goal: ${p.primary_goal || "Not provided"}

`;
      }
      
      // Current medications
      if (userContext.medications && userContext.medications.length > 0) {
        contextMessage += `**Current Medications:**
${userContext.medications.map((m: any) => `- ${m.name} (${m.dosage}) - ${m.frequency} at ${m.time} [${m.category}]`).join("\n")}

`;
      } else {
        contextMessage += `**Current Medications:** None added yet

`;
      }
      
      // Today's meals
      if (userContext.todaysMeals && userContext.todaysMeals.length > 0) {
        contextMessage += `**Today's Meals:**
${userContext.todaysMeals.map((m: any) => `- ${m.mealType}: ${m.food.name} (${m.food.calories} cal, ${m.food.protein}g protein)`).join("\n")}
Total Calories Today: ${userContext.totalCalories || 0} kcal
Total Protein Today: ${userContext.totalProtein || 0}g

`;
      }
      
      // Known interactions from database
      if (userContext.knownInteractions && userContext.knownInteractions.length > 0) {
        contextMessage += `**Known Food-Drug Interactions for User's Medications:**
${userContext.knownInteractions.map((i: any) => 
  `- ${i.medicationName} + ${i.foodName}: ${i.severity.toUpperCase()} - ${i.reason}`
).join("\n")}

`;
      }
      
      // Available foods database summary
      if (userContext.availableFoods) {
        contextMessage += `**Available Indian Foods Database:**
${userContext.availableFoods.slice(0, 20).map((f: any) => 
  `- ${f.name}${f.nameHindi ? ` (${f.nameHindi})` : ""}: ${f.calories} cal, ${f.protein}g protein [${f.category}]`
).join("\n")}
... and ${userContext.availableFoods.length - 20} more foods available.

`;
      }
    }

    // Prepare messages for AI
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];
    
    // Add context as first user message if available
    if (contextMessage) {
      aiMessages.push({ 
        role: "system", 
        content: contextMessage 
      });
    }
    
    // Add conversation history
    if (messages && messages.length > 0) {
      aiMessages.push(...messages);
    }

    // Call Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      // Handle payment required
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("MediNutri AI error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
