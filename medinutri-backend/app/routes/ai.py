from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Any
from app.data_manager import data_manager
import json
import re
import asyncio

router = APIRouter(prefix="/ai", tags=["AI"])

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    userContext: Any = None

def get_session_context(messages: List[Message]) -> str:
    if len(messages) < 2: return ""
    last_msg = messages[-1].content.lower()
    pronouns = [" it", " this", " that", " them", "about it", "about this"]
    has_pronoun = any(p in last_msg for p in pronouns)
    if not has_pronoun and len(last_msg) > 10:
        return ""
    for m in reversed(messages[:-1]):
        if m.role == 'user' and len(m.content) > 3 and "tell me" not in m.content.lower():
            return m.content
    return ""

def is_conversational(text: str) -> bool:
    patterns = [
        r"\bhello\b", r"\bhi\b", r"\bhey\b", r"\bgood morning\b", 
        r"\bgood afternoon\b", r"\bgood evening\b", r"\bhow are you\b",
        r"\bthank\b", r"\bthanks\b", r"\bbye\b", r"\bsee you\b"
    ]
    for p in patterns:
        if re.search(p, text.lower()):
            return True
    return False

# --- Dietitian Formatting ---

def format_food(item: dict) -> str:
    name = item.get("Food_Name", "Unknown")
    desc = item.get("Description", "No detailed description available.")
    desc = re.sub(r'\[.*?\]', '', desc)[:300] + "..." if len(desc) > 300 else desc
    return f"🍎 **{name}**: {desc}"

def format_herb(item: dict) -> str:
    name = item.get("Herb_English_Name") or item.get("Herb_Pinyin_Name", "Unknown")
    func = item.get("Function", "No specific function listed.")
    ind = item.get("Indication", "No indication listed.")
    
    if func == "NA": func = "Not specified"
    if ind == "NA": ind = "Not specified"
    
    return f"🌿 **{name}**\n*Effect*: {func}\n*Uses*: {ind}"

def format_interaction(item: dict) -> str:
    drug = item.get("Drug_Name", "Drug")
    food = item.get("Food_Herb_Name", "Item")
    result = item.get("Conclusion") or item.get("Result") or "Use with caution."
    if len(result) > 150: result = result[:147] + "..."
    return f"⚠️ **Interaction**: {drug} + {food}: {result}"

def generate_dietitian_response(query: str, matches: dict, interactions: list, is_conv: bool, symptoms: dict) -> str:
    parts = []

    # 1. Greeting
    if is_conv:
        parts.append("Hello! I am MediNutri, your offline nutrition assistant. I can help with diet and lifestyle tips.")

    # 2. Disease/Symptom Management (Dietitian Style)
    # If the user asked about a disease, or if we found remedies for the query
    
    # Check if we matched a disease explicitly
    condition_name = ""
    if matches["disease"]:
        condition_name = matches["disease"][0].get("Indication", "")
    elif symptoms["food"] or symptoms["herb"]:
        # User query itself was valid for finding remedies, treat query as condition
        condition_name = query.title()

    if condition_name:
        parts.append(f"🩺 **{condition_name}**")
        parts.append("**Management & Lifestyle:**\n• Ensure adequate hydration with water or herbal teas.\n• Maintain a balanced diet rich in clean, whole foods.\n• Rest appropriately to support recovery.") 
        
        # Add Specific Foods (Nutritional Aids)
        if symptoms["food"]:
            food_list = [format_food(f) for f in symptoms["food"] if f.get("Food_Name") not in ["NA", "Unknown"]]
            if food_list:
                parts.append("**Recommended Foods:**\n" + "\n\n".join(food_list))
        
        # Add Specific Herbs (Natural Aids)
        if symptoms["herb"]:
            herb_list = [format_herb(h) for h in symptoms["herb"] if h.get("Herb_English_Name") not in ["NA", "Unknown"]]
            if herb_list:
                parts.append("**Helpful Herbs:**\n" + "\n\n".join(herb_list))

    # 3. Direct Food/Herb Info (if user asked "Vitamin C" or "Ginger")
    # Only show this if we didn't already frame it as a disease management plan
    # OR if the user asked specifically about an item.
    else:
        # Show Foods
        for item in matches["food"][:2]:
            if item.get("Food_Name") in ["NA", "Unknown"]: continue
            parts.append(format_food(item))
        
        # Show Herbs
        for item in matches["herb"][:2]:
            name = item.get("Herb_English_Name")
            if not name or name in ["NA", "Unknown"]: continue
            parts.append(format_herb(item))

    # 4. Interactions
    # We DO Warn about interactions if detected
    combined_int = interactions + matches.get("interaction", [])
    if combined_int:
        seen = set()
        alert_parts = []
        for i in combined_int:
            key = f"{i.get('Drug_Name')}-{i.get('Food_Herb_Name')}"
            if key not in seen:
                seen.add(key)
                alert_parts.append(format_interaction(i))
                if len(alert_parts) >= 3: break
        
        if alert_parts:
            parts.append("\n".join(alert_parts))

    # 5. Fallback
    if not parts:
        return f"I'm sorry, I couldn't find specific diet recommendations for '{query}'. Please consult a certified nutritionist for personalized advice."

    return "\n\n---\n\n".join(parts)

async def stream_generator(chat_request: ChatRequest):
    current_msg = ""
    for m in reversed(chat_request.messages):
        if m.role == "user":
            current_msg = m.content
            break
            
    if not current_msg:
        yield "data: [DONE]\n\n"
        return

    # Context
    context_subject = get_session_context(chat_request.messages)
    effective_query = current_msg
    if context_subject:
        effective_query = f"{current_msg} {context_subject}"

    # Search
    matches = data_manager.find_matches(effective_query)
    # Search Remedies (treat query as symptom)
    remedies = data_manager.find_natural_remedies(effective_query)
    
    is_conv = is_conversational(current_msg)

    # Interactions
    # Check if user mentioned a drug + match food
    med_names = [m.get("Drug_Name") for m in matches["medicine"]]
    # Also considering raw query words as potential drugs? No, sticking to DB.
    
    item_names = [f.get("Food_Name") for f in matches["food"]] + \
                 [h.get("Herb_English_Name") for h in matches["herb"]] + \
                 [f.get("Food_Name") for f in remedies["food"]] + \
                 [h.get("Herb_English_Name") for h in remedies["herb"]]
    
    specific_interactions = []
    if med_names and item_names:
        specific_interactions = data_manager.get_interaction_specific(med_names, item_names)

    # Generate
    full_text = generate_dietitian_response(current_msg, matches, specific_interactions, is_conv, remedies)

    # Stream
    words = full_text.split(" ")
    chunk_size = 3
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size]) + " "
        data = { "choices": [{ "delta": { "content": chunk } }] }
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(0.02)

    yield "data: [DONE]\n\n"

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(stream_generator(request), media_type="text/event-stream")
