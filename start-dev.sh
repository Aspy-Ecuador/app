#!/bin/bash
echo "========================================="
echo " Iniciando servidores del Proyecto Aspy"
echo "========================================="
echo ""

echo "[1] Levantando Backend (Laravel)..."
cd aspy && php artisan serve &
BACKEND_PID=$!

echo "[2] Levantando Frontend (React/Vite)..."
cd aspy-web && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ ¡Ambos servidores estan corriendo en esta terminal!"
echo "❌ Presiona [Ctrl+C] en cualquier momento para apagar ambos procesos."
echo ""

# Atrapar la señal de salida para apagar ambos servidores juntos
trap "echo 'Apagando servidores...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
