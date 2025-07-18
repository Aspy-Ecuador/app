
# Laravel Project Setup

## Prerequisites

Make sure you have the following installed on your system:
- PHP 8.3+
- Composer
- PostgreSQL

## Step-by-Step Setup

### 1. Clone the Repository
Clone the project repository to your local machine

### 2. Install Project Dependencies
Run the following command to install the necessary dependencies:

```bash
composer install
```

Make sure the extensions are enabled (without ;) in your `php.ini` files. Wic

```bash
extension=pgsql
extension=pdo_pgsql
```

### 3. Generate the Application Key
Run the following command to generate a unique application key:

```bash
php artisan key:generate
```

### 4. Run Migrations
Set up your PostgreSQL database and copy the `.env` file with your database credentials to the root. Then, run the database migrations:

```bash
php artisan migrate
```

### 5. Start the Development Server
Finally, run the Laravel development server:

```bash
php artisan serve
```

The server will start on [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

