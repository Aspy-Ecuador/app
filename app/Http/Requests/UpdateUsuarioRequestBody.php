<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarioRequestBody extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'nullable|string',
            'apellido' => 'nullable|string',
            'email' => 'nullable|email',
            'telefono' => 'nullable|string',
            'cedula' => 'nullable|string',
            'rol' => 'nullable|string',
            'password' => 'nullable|string',
            'direccion' => 'nullable|string',
            'fecha_nacimiento' => 'nullable|date',
            'estado' => 'nullable|boolean',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sobreMi' => 'nullable|string',
            'genero' => 'nullable|string',
            'nombreRepresentante' => 'nullable|string',
            'apellidoRepresentante' => 'nullable|string',
            'telefonoRepresentante' => 'nullable|string',
            'cedulaRepresentante' => 'nullable|string',
            'emailRepresentante' => 'nullable|email',
            'parentesco' => 'nullable|string',
        ];
    }
}
