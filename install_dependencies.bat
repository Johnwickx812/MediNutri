@echo off
echo Installing all dependencies for MediNutri...

echo.
echo [1/2] Installing Backend Dependencies...
cd medinutri-backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo.
echo [2/2] Installing Frontend Dependencies...
cd medinutri-frontend
call npm install
cd ..

echo.
echo Setup Complete! You can now run start_dev.bat to start the servers.
pause
