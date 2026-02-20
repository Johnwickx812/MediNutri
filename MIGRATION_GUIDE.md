# 🏥 MediNutri Migration Guide: MongoDB to PostgreSQL

This guide walks you through migrating the MediNutri database to PostgreSQL, which offers better data integrity (ACID) and relational structure for medical-grade applications.

## Prerequisites

1. **PostgreSQL Installed**: Ensure you have PostgreSQL running locally or a connection string to a cloud provider (Neon, Supabase, etc.).
2. **Python Environment**: You should have Python 3.8+ installed.
3. **Dependencies**:
   ```bash
   pip install psycopg2-binary pymongo python-dotenv pandas
   ```

## Steps for Migration

### 1. Prepare Environment
Update your `.env` file in the root directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=medinutri

# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medinutri
```

### 2. Create the Schema
Run the SQL script to create tables and indexes in your PostgreSQL database:
```bash
# Using psql
psql -d medinutri -f medinutri_schema.sql
```

### 3. (Optional) Consolidate CSV Data
If you have new food datasets in CSV format, place them in a `data/` folder and run:
```bash
python consolidate_food_csvs.py
```

### 4. Run the Data Migration
Transfer data from MongoDB to PostgreSQL:
```bash
python migrate_mongodb_to_postgres.py
```

---

## Technical Comparison

| Feature | MongoDB (Old) | PostgreSQL (New) |
|---------|---------------|------------------|
| **Structure** | Document-based (BSON) | Relational (SQL) |
| **Consistency** | Eventual Consistency | ACID Compliant |
| **Relationships** | Embedded/Manual | Foreign Keys (Enforced) |
| **Search** | Regex-based | GIN Indexes / Full-Text Search |
| **Medical Compliance** | High | Ultra-High (Audit Logs, Enforced Types) |

## After Migration
Once migrated, the backend `main.py` should be updated to point to PostgreSQL using an ORM like SQLAlchemy or raw `psycopg2` queries. 

### Recommended SQLAlchemy Hook:
```python
from sqlalchemy import create_engine
engine = create_engine(os.getenv("DATABASE_URL"))
```

---
*Created by MediNutri Data Engineering Team*
