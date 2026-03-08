import openai
import asyncpg
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)

async def embed_interactions():
    conn = await asyncpg.connect(DATABASE_URL)
    print("Connected to DB. Fetching interactions...")
    rows = await conn.fetch("SELECT * FROM food_drug_interactions")
    print(f"Found {len(rows)} records. Starting embedding...")

    for row in rows:
        # Prepare text for embedding
        text = f"""
        Drug: {row['drug_name']}
        Food: {row['food_name']}
        Severity: {row['severity']}
        Details: {row['interaction_text']}
        Recommendation: {row['recommendation']}
        """
        
        try:
            res = await client.embeddings.create(
                model="text-embedding-3-small", 
                input=text.strip()
            )
            vector = res.data[0].embedding

            await conn.execute("""
                UPDATE food_drug_interactions 
                SET embedding = $1 WHERE id = $2
            """, vector, row['id'])
            print(f"Done: {row['drug_name']} + {row['food_name']}")
        except Exception as e:
            print(f"Error embedding {row['drug_name']}: {e}")

    await conn.close()
    print("All interaction embeddings completed!")

if __name__ == "__main__":
    asyncio.run(embed_interactions())
