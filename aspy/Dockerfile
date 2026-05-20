FROM php:8.4-fpm

# Instalamos utilidades del sistema
RUN apt-get update && apt-get install -y \
    unzip libzip-dev libpng-dev libonig-dev \
    libxml2-dev procps git nginx \
    libpq-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd fileinfo \
    && docker-php-ext-install pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Establecer el directorio de trabajo
WORKDIR /var/www

# Copiar archivos composer.json y composer.lock para instalación de dependencias
COPY . .

# Instalar dependencias PHP (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY nginx.conf /etc/nginx/sites-available/default

# Copiar y dar permisos al script de arranque
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Exponer puerto 8000 por defecto (Railway sobreescribe con $PORT)
EXPOSE 8000

# Usar script de arranque para aplicar el puerto dinámico de Railway
CMD ["/start.sh"]