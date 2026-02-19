-- MediNutri PostgreSQL Schema
-- Migration from MongoDB

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    age INTEGER,
    gender VARCHAR(50),
    height FLOAT,
    weight FLOAT,
    medical_conditions JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    diet_preference VARCHAR(100),
    cuisine_preference VARCHAR(100),
    profile_image TEXT
);

-- 2. Foods Table (Nutrition Data)
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255),
    name_tamil VARCHAR(255),
    name_malayalam VARCHAR(255),
    calories FLOAT DEFAULT 0,
    protein FLOAT DEFAULT 0,
    carbs FLOAT DEFAULT 0,
    fat FLOAT DEFAULT 0,
    fiber FLOAT DEFAULT 0,
    food_group VARCHAR(100),
    data_source VARCHAR(100) DEFAULT 'USDA/NIN',
    is_regional BOOLEAN DEFAULT FALSE,
    region VARCHAR(100)
);

CREATE INDEX idx_food_name ON foods (food_name);

-- 3. Medications Table
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    composition TEXT,
    uses TEXT,
    side_effects TEXT,
    manufacturer VARCHAR(255),
    category VARCHAR(100)
);

CREATE INDEX idx_medicine_name ON medications (medicine_name);

-- 4. User Data (Medications, Meals, Reminders)
-- This replaces the unstructured "user_data" collection

CREATE TABLE IF NOT EXISTS user_medications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    time TIME,
    category VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meal_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id) ON DELETE SET NULL,
    food_name_snapshot VARCHAR(255), -- Store name at time of logging
    meal_type VARCHAR(50), -- breakfast, lunch, etc.
    quantity FLOAT DEFAULT 100,
    unit VARCHAR(20) DEFAULT 'g',
    calories_snapshot FLOAT,
    protein_snapshot FLOAT,
    logged_date DATE DEFAULT CURRENT_DATE,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_reminders (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}', -- Store specific med reminder states
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Food-Drug Interactions Table
CREATE TABLE IF NOT EXISTS food_drug_interactions (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    interaction_text TEXT,
    severity VARCHAR(50), -- High, Moderate, Low
    recommendation TEXT,
    scientific_source TEXT
);

CREATE INDEX idx_interaction_lookup ON food_drug_interactions (food_name, drug_name);
