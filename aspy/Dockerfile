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

# Exponer puerto 9000 (PHP-FPM)
EXPOSE 8000

# El CMD por defecto de la imagen php:8.4-fpm ya ejecuta php-fpm, por lo que
# no necesitas definirlo explícitamente a menos que quieras personalizarlo.
# Si quieres puedes dejarlo explícito así:
CMD service nginx start && php-fpm