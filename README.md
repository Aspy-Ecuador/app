# ASPY · Sistema de gestión de la Fundación Aspy Ecuador

Aplicación web para la **Fundación Aspy Ecuador** (Guayaquil), que acompaña a personas con discapacidad, especialmente dentro del espectro autista. Incluye:

- **Landing pública** (`/`): misión, servicios, ASPY Band y redes sociales.
- **Sistema interno con 4 roles**: agenda de citas, pagos por transferencia con comprobante, recibos, horarios de los profesionales, historial y reportes de sesión.

| Rol | Qué puede hacer |
|---|---|
| **Admin** | Todo: usuarios (incluidos otros admins), servicios, citas, métricas del panel. |
| **Staff** (secretaría) | Gestiona usuarios (no admins), servicios, horarios, agenda citas para clientes, aprueba o rechaza pagos. |
| **Profesional** | Crea sus horarios, ve **sus** pacientes y citas, marca asistencia y sube el reporte de cada sesión. |
| **Cliente** | Se registra solo, agenda citas pagando con comprobante, ve sus recibos y reportes y cancela con más de 24 h de anticipación. |

---

## Tecnologías

**Frontend** (`aspy-web/`)
- React 19 + TypeScript 5.9, empaquetado con Vite 8
- Material UI 7 (tema propio con modo claro/oscuro) + MUI X (DataGrid, Charts, Date Pickers)
- Tailwind CSS 4 (utilidades puntuales; su variante `dark:` está sincronizada con el modo de MUI)
- React Router 7, Redux (sesión), React Hook Form, Axios
- FullCalendar (agenda), jsPDF / react-pdf (recibos y reportes), Framer Motion
- Cloudinary (subida de comprobantes y reportes)
- Despliegue: Vercel

**Backend** (`aspy/`)
- PHP 8.2+ con Laravel 12
- Laravel Sanctum (autenticación por token Bearer)
- PostgreSQL en producción (Railway); SQLite sirve para desarrollo local
- Despliegue: Docker (Nginx + PHP-FPM)

---

## Estructura

```
Aspy/
├── aspy/                 Backend Laravel (API REST en /api)
│   ├── app/Http/Controllers/   Lógica y permisos por recurso
│   ├── app/Http/Middleware/    CheckRole (middleware role:...)
│   ├── app/Models/             Modelos Eloquent
│   ├── database/migrations/    Esquema de la BD
│   ├── database/seeders/       Catálogos (roles, estados, provincias…) + usuario admin
│   └── routes/api.php          Rutas y permisos por rol
├── aspy-web/             Frontend React
│   └── src/
│       ├── API/                Llamadas a la API (axios)
│       ├── components/         Pantallas por rol: admin/, staff/, professional/, client/, landing/
│       ├── routes/             Rutas por rol
│       ├── observer/           RoleDataContext: carga los datos según el rol
│       └── shared-theme/       Tema MUI (colores claro/oscuro, tokens)
├── aspy-studio/          Sanity Studio: panel para editar la landing (esquema + carga inicial)
├── scripts/              Pruebas de seguridad de la API
├── start-dev.bat         Levanta backend + frontend en Windows
└── start-dev.sh          Igual, en Linux/macOS/Git Bash
```

---

## Levantar el proyecto en local

### Requisitos
- **PHP 8.2+** con las extensiones `pdo_sqlite` (desarrollo) y/o `pdo_pgsql` (PostgreSQL) habilitadas en `php.ini`
- **Composer** 2
- **Node.js 20+** y npm
- (Opcional) PostgreSQL, si no usas SQLite

### 1. Backend (Laravel)

```bash
cd aspy
composer install
cp .env.example .env          # en Windows (cmd): copy .env.example .env
php artisan key:generate
```

Configura la base de datos en `aspy/.env`:

- **SQLite (lo más rápido):** deja `DB_CONNECTION=sqlite`, borra las demás líneas `DB_*` y crea el archivo:
  ```bash
  touch database/database.sqlite   # en Windows: type nul > database\database.sqlite
  ```
- **PostgreSQL:** crea una base vacía y completa `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD`.

Crea las tablas y carga los datos iniciales:

```bash
php artisan migrate --seed
php artisan serve             # API en http://127.0.0.1:8000/api
```

> El seeder crea el usuario **admin@aspy.com / ADMIN**. Cambia esa contraseña en cuanto entres.
> Desde el panel del admin puedes crear profesionales y staff; los clientes se registran solos en `/register`.

### 2. Frontend (React)

```bash
cd aspy-web
npm install
cp .env.example .env          # VITE_API_URL=http://127.0.0.1:8000/api
npm run dev                   # http://localhost:5173
```

### 3. Atajo: los dos a la vez
Con las dependencias ya instaladas, desde la raíz:
- Windows: `start-dev.bat`
- Linux/macOS/Git Bash: `./start-dev.sh`

---

## Comandos útiles

| Dónde | Comando | Para qué |
|---|---|---|
| `aspy/` | `php artisan migrate` | Aplicar migraciones nuevas |
| `aspy/` | `php artisan migrate:fresh --seed` | ⚠️ Borra **toda** la BD y la recrea (solo en local) |
| `aspy/` | `php artisan route:list --path=api` | Ver las rutas de la API y sus middlewares |
| `aspy/` | `php artisan config:clear && php artisan cache:clear` | Limpiar cachés |
| `aspy-web/` | `npm run build` | Compilar para producción (incluye el chequeo de TypeScript) |
| `aspy-web/` | `npm run lint` | ESLint |

---

## Sanity (contenido editable de la landing)

La fundación edita la landing (textos, fotos del collage, servicios, contacto, etc.) desde **Sanity Studio**, sin tocar código. El Studio está en `aspy-studio/`.

### Configuración inicial (una sola vez)
1. Crea una cuenta en https://www.sanity.io y un proyecto nuevo en https://www.sanity.io/manage. Anota el **Project ID**.
2. En `aspy-studio/`:
   ```bash
   cd aspy-studio
   cp .env.example .env              # pon SANITY_STUDIO_PROJECT_ID=<tu project id>
   npm install
   npx sanity login                  # inicia sesión con tu cuenta de Sanity
   npx sanity dataset create production --visibility public   # si el proyecto no lo creó
   npm run seed                      # carga el contenido y las fotos actuales
   npm run dev                       # Studio local: http://localhost:3333
   ```
3. **CORS**: en sanity.io/manage → API → CORS origins, agrega `https://aspy-web.vercel.app` y `http://localhost:5173`, ambos **sin** "Allow credentials".
4. **Frontend**: en `aspy-web/.env` y en Vercel (Settings → Environment Variables) define `VITE_SANITY_PROJECT_ID` y `VITE_SANITY_DATASET=production`. Luego vuelve a desplegar.
5. **Publicar el Studio en internet**: `npm run deploy` (queda en `https://aspy-ecuador.sanity.studio`).
6. **Invitar a la fundación**: sanity.io/manage → Members → Invite, con rol **Editor**.

### Uso diario (fundación)
Entrar al Studio → elegir en la barra lateral la sección (Portada, Nosotros, Servicios…) → editar → **Publish**. La web toma los cambios publicados en segundos (los borradores no se ven en la web).

## Despliegue

- **Frontend (Vercel):** definir `VITE_API_URL` con la URL pública del backend terminada en `/api`. `vercel.json` redirige todas las rutas a `index.html`.
- **Backend (Docker):** `aspy/Dockerfile` (Nginx + PHP-FPM, puerto 8000). En el servidor:
  - `APP_ENV=production`, `APP_DEBUG=false` y un `APP_KEY` propio.
  - Credenciales de la BD como variables de entorno de la plataforma, **no** dentro de la imagen.
  - Después de cada despliegue con migraciones nuevas: `php artisan migrate --force`.

---

## Seguridad (resumen)

- Toda la API (salvo login y registro) exige token de Sanctum. Los tokens vencen a los 7 días (`SANCTUM_EXPIRATION`); al vencer, el frontend vuelve al login.
- Permisos en dos niveles:
  1. **Por rol**, en `routes/api.php` con el middleware `role:...` (el Admin siempre pasa).
  2. **Por dueño del registro**, en cada controlador: un cliente solo ve y edita lo suyo, y un profesional solo ve a sus pacientes y sus citas.
- El registro público siempre crea un **Cliente**: el rol nunca se toma del formulario.
- Límite de 10 intentos de login por minuto (por email + IP) y de 5 registros por minuto.
- Nunca subas archivos `.env` a git. Usa `.env.example` como plantilla.
