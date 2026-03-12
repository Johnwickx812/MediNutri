import openai
import os
from typing import List, Dict, Any
import json

# Load config
openai_client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def find_relevant_interactions(question: str, db_pool, top_k=5):
    """
    Search for interactions using pgvector semantic similarity
    """
    try:
        # 1. Embed the user's question
        res = await openai_client.embeddings.create(
            model="text-embedding-3-small", 
            input=question
        )
        question_vector = res.data[0].embedding

        # 2. Search DB for similar records using pgvector
        conn = db_pool.getconn()
        try:
            with conn.cursor() as cur:
                # Use pgvector cosine similarity operator <=>
                cur.execute("""
                    SELECT drug_name, food_name, severity, interaction_text, recommendation
                    FROM food_drug_interactions
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s
                """, (question_vector, top_k))
                
                rows = cur.fetchall()
                results = []
                for r in rows:
                    results.append({
                        "drug_name": r[0],
                        "food_name": r[1],
                        "severity": r[2],
                        "description": r[3],
                        "alternatives": r[4]
                    })
                return results
        finally:
            db_pool.putconn(conn)
    except Exception as e:
        print(f"Vector Search Error: {e}")
        return []

async def get_ai_health_advice(question: str, db_pool, user_context: Dict[str, Any]):
    """
    RAG-based AI assistant response
    """
    # 1. Find relevant records from the database
    records = await find_relevant_interactions(question, db_pool)

    # 2. Format records as context
    context_text = ""
    for r in records:
        context_text += f"""
        - {r['drug_name']} + {r['food_name']}
          Severity: {r['severity']}
          Details: {r['description']}
          Alternatives: {r['alternatives']}
        """

    # 3. Build System Prompt with context
    system_prompt = """
    You are MediNutri's AI Assistant.

    Primary focus:
    - Give clear, practical answers about diet, nutrition, medications, food–drug interactions, fitness, weight loss/gain, and healthy lifestyle.
    - Use the provided database context when it is relevant (especially for food–drug interactions and medical safety).

    General behavior:
    - You can also answer normal everyday questions (technology, productivity, learning, etc.) at a medium, easy-to-understand level.
    - If a question is purely non-medical, you may answer it like a normal helpful chat assistant.
    - If a question involves health or medications, always include a short safety note reminding the user to consult their doctor.

    When using MediNutri interaction data:
    - Prefer the provided records when they exist, and mention severity (High / Medium / Low) if available.
    - If no direct record is found, say that you don't see a specific interaction in the database and give general precautions instead of guessing precise risks.

    Style:
    - Be concise, friendly, and easy to understand.
    - Avoid overly technical language unless the user explicitly asks for deep details.
    """

    # 4. Call GPT-4o-mini
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": (
                        f"User Profile Context: {json.dumps(user_context)}\n\n"
                        f"Question: {question}\n\n"
                        f"Relevant data from MediNutri database (may be empty):\n{context_text}"
                    ),
                },
            ],
            temperature=0.5,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"I'm sorry, I'm having trouble connecting to my knowledge base right now. ({str(e)})"
