#!/bin/sh
# Aplica las migraciones pendientes cada vez que arranca el contenedor: el despliegue (Railway)
# no tiene otro paso para hacerlo, y sin ellas el código nuevo falla contra una base vieja.
# Nunca impide que el sitio arranque: si algo falla, el aviso queda en el log del despliegue.
M=database/migrations

if ! timeout 120 php artisan migrate --force; then
  # Pasa si la base se creó sin registrar las migraciones iniciales (que no se pueden repetir).
  # Estas sí se pueden repetir: revisan qué falta antes de crear nada.
  echo "AVISO: 'migrate' falló. Se aplican solo las migraciones repetibles."
  timeout 120 php artisan migrate --force \
    --path=$M/2026_10_05_000000_add_is_available_columns.php \
    --path=$M/2026_10_06_000000_add_payment_amount_and_bank_account.php \
    --path=$M/2026_10_06_000001_add_occupation_other.php \
    --path=$M/2026_10_08_000001_alinear_nombres_de_estados.php \
    || echo "AVISO: tampoco se pudieron aplicar. Revisa la conexión a la base de datos."
fi

# migrate corre como root y puede crear archivos (log, caché) que PHP-FPM (www-data) no podría escribir después
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
