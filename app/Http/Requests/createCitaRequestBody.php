<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class createCitaRequestBody extends FormRequest
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
            'cedulaPaciente' => 'string|required',
            'profesional'=> 'string|required',
            'servicio'=> 'string|required',
            'tipoConsulta'=> 'string|required',
            'fecha'=> 'date|required',
            'horaInicio'=> 'string|required',
            'horaFin'=> 'string|required',
        ];
    }
}
