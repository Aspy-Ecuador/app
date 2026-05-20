FROM php:8.4-fpm

# Instalamos utilidades del sistema
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    procps \
    git \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd fileinfo

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Establecer el directorio de trabajo
WORKDIR /var/www

# Copiar archivos composer.json y composer.lock para instalación de dependencias
COPY . .

# Instalar dependencias PHP (Laravel)
RUN composer install --no-dev --optimize-autoloader

# Exponer puerto 9000 (PHP-FPM)
EXPOSE 9000

# El CMD por defecto de la imagen php:8.4-fpm ya ejecuta php-fpm, por lo que
# no necesitas definirlo explícitamente a menos que quieras personalizarlo.
# Si quieres puedes dejarlo explícito así:
CMD ["php-fpm"]
