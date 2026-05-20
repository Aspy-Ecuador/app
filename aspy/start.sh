#!/bin/bash
set -e

PORT=${PORT:-8000}

echo "==> Iniciando en puerto: $PORT"

sed -i "s/listen 8000/listen $PORT/" /etc/nginx/sites-available/default

echo "==> Nginx config:"
cat /etc/nginx/sites-available/default

service nginx start
php-fpm