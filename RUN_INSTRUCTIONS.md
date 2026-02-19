# How to Run MediNutri Application

This guide provides instructions on how to run both the backend and frontend of the MediNutri application.

## Prerequisites

- Python 3.x installed
- Node.js and npm installed

## 1. Backend Setup & Running

The backend is built with FastAPI and Python.

### Navigate to the backend directory:
```bash
cd medinutri-backend
```

### Create and activate a virtual environment (if not already created):
**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```
**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies:
```bash
pip install -r requirements.txt
```

### Run the backend server:
```bash
python run.py
```
The backend will be available at `http://localhost:8000`.

## 2. Frontend Setup & Running

The frontend is built with React and Vite.

### Open a new terminal and navigate to the frontend directory:
```bash
cd medinutri-frontend
```

### Install dependencies:
```bash
npm install
```

### Run the development server:
```bash
npm run dev
```
The frontend will typically run on `http://localhost:8080` (or the port shown in the terminal).

## Summary of Commands

**Backend Terminal:**
```bash
cd medinutri-backend
.\venv\Scripts\activate
python run.py
```

**Frontend Terminal:**
```bash
cd medinutri-frontend
npm run dev
```
