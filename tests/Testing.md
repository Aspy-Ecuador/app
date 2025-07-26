# Testing with Model Factories in Laravel

Welcome! This guide will help you (and your team) use Laravel model factories to write clean, powerful, and maintainable tests in this project.

---

## How to Run Tests

### Prerequisites
- Create a `.env.testing` file in your project root with the following content:
```env
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_DRIVER=sync
```

### Run All Tests
```bash
php artisan test
```

This command will automatically use SQLite for testing because of the `.env.testing` configuration.

---

## What Are Factories?

Factories are blueprints for generating fake data for your Eloquent models. They are used in tests and database seeders to quickly create valid, realistic records—without manually specifying every field.

**Why use factories?**
- No more repetitive, manual data setup
- Tests are easier to read and maintain
- Automatically handle relationships between models
- Great for both simple and complex test scenarios

---

## Basic Usage

### Create a Single Model
```php
$appointment = Appointment::factory()->create();
```
This creates a valid `Appointment` and all its required relationships (like `Payment`, `Person`, etc.) automatically.

### Override Specific Fields
```php
$person = Person::factory()->create([
    'first_name' => 'Alice',
    'birthdate' => '1990-01-01',
]);
```

### Create Multiple Records
```php
$payments = Payment::factory()->count(5)->create();
```

### Just Make (Don’t Save)
```php
$service = Service::factory()->make(); // Not saved to DB
```

---

## Relationships

Factories can automatically create related models. For example:
```php
$appointment = Appointment::factory()->create();
// $appointment->payment, $appointment->workerSchedule, etc. are all valid
```

You can also override relationships:
```php
$person = Person::factory()->create();
$appointment = Appointment::factory()->create([
    'scheduled_by' => $person->person_id,
]);
```

---

## Checking Values in Tests

Use Pest or PHPUnit assertions to check values:
```php
expect($appointment->payment)->not->toBeNull();
expect($person->first_name)->toBe('Alice');
$this->assertEquals('Alice', $person->first_name); // PHPUnit style
```

---

## Inspecting Database Records During Tests

- Use `dump($model->toArray())` or `dd($model->toArray())` to print model data during a test.
- Query all records: `dump(Appointment::all()->toArray());`
- Use `php artisan tinker` if you use a persistent test database.
- Log to file: `\Log::info($model->toArray());`

---

## Best Practices
- Always use factories for test data—don’t hand-write arrays unless you must.
- Override only the fields you care about in each test.
- Use `create()` to save to the DB, `make()` for just an instance.
- If you get a NOT NULL error, check your factory to ensure all required fields are set.
- Factories **do not** affect your production data or app logic.
- Keep your factories in version control—they’re part of your test infrastructure!

---

## Troubleshooting
- **Missing required field?** Add it to your factory.
- **Want to see what was created?** Use `dump()` or `dd()` in your test.
- **Primary key missing?** Make sure you used `create()`, not `make()`.
- **Database error?** Check your migrations and factory fields for NOT NULL columns.

---

## Project-Specific Tips
- This project uses custom models like `UserAccount`, `Person`, `WorkerSchedule`, etc. Use their factories for all test data.
- Factories are set up to handle relationships automatically—no need to create related models by hand unless you want to customize them.
- You can always override any field or relationship in your test for custom scenarios.

---

## Example: Full Appointment Test
```php
it('creates a valid appointment with all relationships', function () {
    $appointment = Appointment::factory()->create();

    expect($appointment)->toBeInstanceOf(App\Models\Appointment::class);
    expect($appointment->payment)->not->toBeNull();
    expect($appointment->workerSchedule)->not->toBeNull();
    expect($appointment->scheduledBy)->not->toBeNull();
    expect($appointment->status)->not->toBeNull();
});
```

---

Happy testing! 🎉 