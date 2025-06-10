<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateReporteRequestBody extends FormRequest
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
            'idPaciente' => 'required|integer',
            'idProfesional' => 'required|integer',
            'idCita' => 'required|integer',
            'fecha' => 'required|date',
            'hora' => 'required|string',
            'comentario' => 'required|string',
            'firma' => 'required|string',
        ];
    }
}
