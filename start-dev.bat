@echo off
echo =========================================
echo  Iniciando servidores del Proyecto Aspy
echo =========================================
echo.

echo [1] Levantando Backend (Laravel) en segundo plano...
start "Aspy Backend (Laravel)" /MIN cmd /k "cd aspy && php artisan serve"

echo [2] Levantando Frontend (React/Vite)...
start "Aspy Frontend (React)" /MAX cmd /k "cd aspy-web && npm run dev"

echo.
echo ¡Listo! Los servidores se estaran ejecutando en ventanas separadas.
echo Para detenerlos, simplemente cierra esas ventanas emergentes.
echo.
pause
