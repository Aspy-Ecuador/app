<?php

namespace App\Http\Controllers;

use App\Models\UserAccount;

abstract class Controller
{
    // IDs de la tabla role (ver DatabaseSeeder)
    public const ROLE_ADMIN = 1;
    public const ROLE_PROFESSIONAL = 2;
    public const ROLE_CLIENT = 3;
    public const ROLE_STAFF = 4;

    protected function currentUser(): ?UserAccount
    {
        $user = auth()->user();

        return $user?->loadMissing('role', 'person');
    }

    protected function currentRoleId(): ?int
    {
        return $this->currentUser()?->role_id;
    }

    /** person_id del usuario autenticado (es también el id de client/professional/staff). */
    protected function currentPersonId(): ?int
    {
        $id = $this->currentUser()?->person?->person_id;

        return $id === null ? null : (int) $id;
    }

    protected function isAdmin(): bool
    {
        return $this->currentRoleId() === self::ROLE_ADMIN;
    }

    /** Staff (secretaría) o administrador: acceso de gestión a todos los registros. */
    protected function isStaffOrAdmin(): bool
    {
        return in_array($this->currentRoleId(), [self::ROLE_ADMIN, self::ROLE_STAFF], true);
    }

    protected function isProfessional(): bool
    {
        return $this->currentRoleId() === self::ROLE_PROFESSIONAL;
    }

    protected function isClient(): bool
    {
        return $this->currentRoleId() === self::ROLE_CLIENT;
    }

    protected function forbidden(string $message = 'No tienes permiso para realizar esta acción.')
    {
        return response()->json(['message' => $message], 403);
    }

    /** Respuesta 500 sin filtrar detalles internos (el error queda en el log). */
    protected function serverError(string $message, \Throwable $e)
    {
        report($e);

        return response()->json(['message' => $message], 500);
    }
}
