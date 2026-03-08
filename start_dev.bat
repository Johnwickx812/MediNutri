@echo off
echo Starting MediNutri Development Environment...

REM Check for backend venv
if not exist "medinutri-backend\venv" (
    echo [INFO] Backend virtual environment not found. Creating and installing dependencies...
    cd medinutri-backend
    python -m venv venv
    call venv\Scripts\activate
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    cd ..
)

REM Check for frontend node_modules
if not exist "medinutri-frontend\node_modules" (
    echo [INFO] Frontend node_modules not found. Installing dependencies...
    cd medinutri-frontend
    call npm install
    cd ..
)

start "MediNutri Backend" cmd /k "cd medinutri-backend && call venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
start "MediNutri Frontend" cmd /k "cd medinutri-frontend && npm run dev"

echo.
echo Servers starting in new windows...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
