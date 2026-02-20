@echo off
echo Starting MediNutri Development Environment...

start "MediNutri Backend" cmd /k "cd medinutri-backend && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
start "MediNutri Frontend" cmd /k "cd medinutri-frontend && npm run dev"

echo Servers starting in new windows...
