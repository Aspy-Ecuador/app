#!/usr/bin/env bash
# Rehace la BD de demo desde cero (SQLite en esta carpeta; nunca toca Railway).
# Antes: backend local en :8002 con la MISMA BD (ver README.md de esta carpeta).
set -e
M="$(cd "$(dirname "$0")" && pwd)"
export DB_CONNECTION=sqlite DB_DATABASE="$M/demo.sqlite"
[ -f "$DB_DATABASE" ] || touch "$DB_DATABASE"
cd "$M/../../aspy"
php artisan config:show database.default | grep -q sqlite
php artisan migrate:fresh --seed --force > /dev/null
node "$M/demo-seed.mjs"
BACKDATE_JSON="$M/backdate.json" php artisan tinker --execute "require '$(cygpath -m "$M/backdate.php")';"
node "$M/demo-finalize.mjs"
