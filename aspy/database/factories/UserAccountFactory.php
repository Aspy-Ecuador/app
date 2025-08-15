<?php

namespace Database\Factories;

use App\Models\UserAccount;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\UserAccountStatus;
class UserAccountFactory extends Factory
{
    protected $model = UserAccount::class;

    public function definition(): array
    {
        return [
            // this is auto increment user id
            'role_id' => Role::factory(), // Should be replaced with Role::factory() when available
            'email' => $this->faker->unique()->safeEmail(),
            'password_hash' => Hash::make('password'),
            'status' => UserAccountStatus::factory(),
            'last_login' => now(),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 