// FINAL
export type InputOption = {
  label: string;
  value: number | string;
  state_id?: number; // ← opcional, solo lo usan las ciudades
};

export type InputConfig = {
  label: string;
  key: string;
  type: string;
  validation: object;
  options?: InputOption[];
  dependsOn?: string;
  disabled?: boolean; // ← opcional, solo lo usa role_id en el config profesional
};

export const inputCreateUserAdminConfig = [
  // ── STEP 1: Datos personales
  {
    label: "Nombre",
    key: "first_name",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Apellido",
    key: "last_name",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Fecha de nacimiento",
    key: "birthdate",
    type: "date",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Rol",
    key: "role_id",
    type: "select",
    options: [
      { label: "Profesional", value: 2 },
      { label: "Cliente", value: 3 },
      { label: "Secretario", value: 4 },
    ],
    validation: {
      required: { value: true, message: "Debe seleccionar un rol" },
    },
  },
  {
    label: "Género",
    key: "gender_id",
    type: "select",
    options: [
      { label: "Masculino", value: 1 },
      { label: "Femenino", value: 2 },
      { label: "Prefiero no decir", value: 3 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Ocupación",
    key: "occupation_id",
    type: "select",
    options: [
      { label: "Psicólogo", value: 1 },
      { label: "Psiquiatra", value: 2 },
      { label: "Terapeuta", value: 3 },
      { label: "Estudiante", value: 4 },
      { label: "Docente", value: 5 },
      { label: "Ingeniero", value: 6 },
      { label: "Médico", value: 7 },
      { label: "Abogado", value: 8 },
      { label: "Empresario", value: 9 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Estado civil",
    key: "marital_status_id",
    type: "select",
    options: [
      { label: "Soltero", value: 1 },
      { label: "Casado", value: 2 },
      { label: "Divorciado", value: 3 },
      { label: "Viudo", value: 4 },
      { label: "Unión libre", value: 5 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Nivel educativo",
    key: "education_id",
    type: "select",
    options: [
      { label: "Primaria", value: 1 },
      { label: "Secundaria", value: 2 },
      { label: "Bachillerato", value: 3 },
      { label: "Técnico", value: 4 },
      { label: "Universitario", value: 5 },
      { label: "Postgrado", value: 6 },
      { label: "Doctorado", value: 7 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Tipo de identificación",
    key: "identification.type",
    type: "select",
    options: [
      { label: "Cédula", value: "cedula" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "RUC", value: "ruc" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Número de identificación",
    key: "identification.number",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  // ── STEP 2: Datos generales (índices 5–10) ────────────────────────────────
  {
    label: "Tipo de teléfono",
    key: "phone.type",
    type: "select",
    options: [
      { label: "Móvil", value: "movil" },
      { label: "Casa", value: "casa" },
      { label: "Trabajo", value: "trabajo" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Número de teléfono",
    key: "phone.number",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "País",
    key: "address.country_id",
    type: "select",
    options: [{ label: "Ecuador", value: 1 }],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Provincia",
    key: "address.state_id",
    type: "select",
    options: [
      { label: "Azuay", value: 1 },
      { label: "Bolívar", value: 2 },
      { label: "Cañar", value: 3 },
      { label: "Carchi", value: 4 },
      { label: "Chimborazo", value: 5 },
      { label: "Cotopaxi", value: 6 },
      { label: "El Oro", value: 7 },
      { label: "Esmeraldas", value: 8 },
      { label: "Galápagos", value: 9 },
      { label: "Guayas", value: 10 },
      { label: "Imbabura", value: 11 },
      { label: "Loja", value: 12 },
      { label: "Los Ríos", value: 13 },
      { label: "Manabí", value: 14 },
      { label: "Morona Santiago", value: 15 },
      { label: "Napo", value: 16 },
      { label: "Orellana", value: 17 },
      { label: "Pastaza", value: 18 },
      { label: "Pichincha", value: 19 },
      { label: "Santa Elena", value: 20 },
      { label: "Santo Domingo de los Tsáchilas", value: 21 },
      { label: "Sucumbíos", value: 22 },
      { label: "Tungurahua", value: 23 },
      { label: "Zamora Chinchipe", value: 24 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Ciudad",
    key: "address.city_id",
    type: "select",
    dependsOn: "address.state_id", // <-- Mejora: Identificador para filtrar dinámicamente
    options: [
      // Azuay (1)
      { label: "Cuenca", value: 1, state_id: 1 },
      { label: "Gualaceo", value: 2, state_id: 1 },
      { label: "Paute", value: 3, state_id: 1 },
      { label: "Sígsig", value: 4, state_id: 1 },
      { label: "Girón", value: 5, state_id: 1 },
      // Bolívar (2)
      { label: "Guaranda", value: 6, state_id: 2 },
      { label: "Chillanes", value: 7, state_id: 2 },
      { label: "Chimbo", value: 8, state_id: 2 },
      { label: "Echeandía", value: 9, state_id: 2 },
      { label: "San Miguel", value: 10, state_id: 2 },
      // Cañar (3)
      { label: "Azogues", value: 11, state_id: 3 },
      { label: "Cañar", value: 12, state_id: 3 },
      { label: "Biblián", value: 13, state_id: 3 },
      { label: "La Troncal", value: 14, state_id: 3 },
      { label: "El Tambo", value: 15, state_id: 3 },
      // Carchi (4)
      { label: "Tulcán", value: 16, state_id: 4 },
      { label: "Montúfar", value: 17, state_id: 4 },
      { label: "Espejo", value: 18, state_id: 4 },
      { label: "Mira", value: 19, state_id: 4 },
      { label: "Bolívar", value: 20, state_id: 4 },
      // Chimborazo (5)
      { label: "Riobamba", value: 21, state_id: 5 },
      { label: "Alausí", value: 22, state_id: 5 },
      { label: "Chambo", value: 23, state_id: 5 },
      { label: "Guano", value: 24, state_id: 5 },
      { label: "Chunchi", value: 25, state_id: 5 },
      // Cotopaxi (6)
      { label: "Latacunga", value: 26, state_id: 6 },
      { label: "La Maná", value: 27, state_id: 6 },
      { label: "Salcedo", value: 28, state_id: 6 },
      { label: "Saquisilí", value: 29, state_id: 6 },
      { label: "Pangua", value: 30, state_id: 6 },
      // El Oro (7)
      { label: "Machala", value: 31, state_id: 7 },
      { label: "Pasaje", value: 32, state_id: 7 },
      { label: "Santa Rosa", value: 33, state_id: 7 },
      { label: "Huaquillas", value: 34, state_id: 7 },
      { label: "Arenillas", value: 35, state_id: 7 },
      // Esmeraldas (8)
      { label: "Esmeraldas", value: 36, state_id: 8 },
      { label: "Atacames", value: 37, state_id: 8 },
      { label: "Quinindé", value: 38, state_id: 8 },
      { label: "Muisne", value: 39, state_id: 8 },
      { label: "San Lorenzo", value: 40, state_id: 8 },
      // Galápagos (9)
      { label: "Puerto Baquerizo Moreno", value: 41, state_id: 9 },
      { label: "Puerto Ayora", value: 42, state_id: 9 },
      { label: "Puerto Villamil", value: 43, state_id: 9 },
      { label: "Santa Cruz", value: 44, state_id: 9 },
      { label: "Isabela", value: 45, state_id: 9 },
      // Guayas (10)
      { label: "Guayaquil", value: 46, state_id: 10 },
      { label: "Samborondón", value: 47, state_id: 10 },
      { label: "Daule", value: 48, state_id: 10 },
      { label: "Milagro", value: 49, state_id: 10 },
      { label: "Durán", value: 50, state_id: 10 },
      // Imbabura (11)
      { label: "Ibarra", value: 51, state_id: 11 },
      { label: "Otavalo", value: 52, state_id: 11 },
      { label: "Cotacachi", value: 53, state_id: 11 },
      { label: "Antonio Ante", value: 54, state_id: 11 },
      { label: "Urcuquí", value: 55, state_id: 11 },
      // Loja (12)
      { label: "Loja", value: 56, state_id: 12 },
      { label: "Catamayo", value: 57, state_id: 12 },
      { label: "Macará", value: 58, state_id: 12 },
      { label: "Cariamanga", value: 59, state_id: 12 },
      { label: "Zamora", value: 60, state_id: 12 },
      // Los Ríos (13)
      { label: "Babahoyo", value: 61, state_id: 13 },
      { label: "Quevedo", value: 62, state_id: 13 },
      { label: "Ventanas", value: 63, state_id: 13 },
      { label: "Vinces", value: 64, state_id: 13 },
      { label: "Baba", value: 65, state_id: 13 },
      // Manabí (14)
      { label: "Portoviejo", value: 66, state_id: 14 },
      { label: "Manta", value: 67, state_id: 14 },
      { label: "Chone", value: 68, state_id: 14 },
      { label: "El Carmen", value: 69, state_id: 14 },
      { label: "Jipijapa", value: 70, state_id: 14 },
      // Morona Santiago (15)
      { label: "Macas", value: 71, state_id: 15 },
      { label: "Gualaquiza", value: 72, state_id: 15 },
      { label: "Sucúa", value: 73, state_id: 15 },
      { label: "Méndez", value: 74, state_id: 15 },
      { label: "Palora", value: 75, state_id: 15 },
      // Napo (16)
      { label: "Tena", value: 76, state_id: 16 },
      { label: "Archidona", value: 77, state_id: 16 },
      { label: "El Chaco", value: 78, state_id: 16 },
      { label: "Quijos", value: 79, state_id: 16 },
      { label: "Carlos Julio Arosemena Tola", value: 80, state_id: 16 },
      // Orellana (17)
      { label: "Francisco de Orellana", value: 81, state_id: 17 },
      { label: "La Joya de los Sachas", value: 82, state_id: 17 },
      { label: "Loreto", value: 83, state_id: 17 },
      { label: "Aguarico", value: 84, state_id: 17 },
      { label: "Dayuma", value: 85, state_id: 17 },
      // Pastaza (18)
      { label: "Puyo", value: 86, state_id: 18 },
      { label: "Mera", value: 87, state_id: 18 },
      { label: "Santa Clara", value: 88, state_id: 18 },
      { label: "Arajuno", value: 89, state_id: 18 },
      { label: "Shell", value: 90, state_id: 18 },
      // Pichincha (19)
      { label: "Quito", value: 91, state_id: 19 },
      { label: "Cayambe", value: 92, state_id: 19 },
      { label: "Mejía", value: 93, state_id: 19 },
      { label: "Pedro Moncayo", value: 94, state_id: 19 },
      { label: "Rumiñahui", value: 95, state_id: 19 },
      // Santa Elena (20)
      { label: "Santa Elena", value: 96, state_id: 20 },
      { label: "La Libertad", value: 97, state_id: 20 },
      { label: "Salinas", value: 98, state_id: 20 },
      { label: "Ancón", value: 99, state_id: 20 },
      { label: "Chanduy", value: 100, state_id: 20 },
      // Santo Domingo de los Tsáchilas (21)
      { label: "Santo Domingo", value: 101, state_id: 21 },
      { label: "La Concordia", value: 102, state_id: 21 },
      { label: "Valle Hermoso", value: 103, state_id: 21 },
      { label: "Alluriquín", value: 104, state_id: 21 },
      { label: "Puerto Limón", value: 105, state_id: 21 },
      // Sucumbíos (22)
      { label: "Nueva Loja", value: 106, state_id: 22 },
      { label: "Shushufindi", value: 107, state_id: 22 },
      { label: "Lago Agrio", value: 108, state_id: 22 },
      { label: "Putumayo", value: 109, state_id: 22 },
      { label: "Gonzalo Pizarro", value: 110, state_id: 22 },
      // Tungurahua (23)
      { label: "Ambato", value: 111, state_id: 23 },
      { label: "Baños de Agua Santa", value: 112, state_id: 23 },
      { label: "Pelileo", value: 113, state_id: 23 },
      { label: "Píllaro", value: 114, state_id: 23 },
      { label: "Patate", value: 115, state_id: 23 },
      // Zamora Chinchipe (24)
      { label: "Zamora", value: 116, state_id: 24 },
      { label: "Yantzaza", value: 117, state_id: 24 },
      { label: "Zumba", value: 118, state_id: 24 },
      { label: "Centinela del Cóndor", value: 119, state_id: 24 },
      { label: "El Pangui", value: 120, state_id: 24 },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Tipo de dirección",
    key: "address.type",
    type: "select",
    options: [
      { label: "Casa", value: "casa" },
      { label: "Trabajo", value: "trabajo" },
      { label: "Otro", value: "otro" },
    ],
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Dirección principal",
    key: "address.primary_address",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Dirección secundaria",
    key: "address.secondary_address",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  // ── STEP 2 (solo professional)
  {
    label: "Título",
    key: "title",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },
  {
    label: "Especialidad",
    key: "specialty",
    type: "text",
    validation: { required: { value: true, message: "Campo requerido" } },
  },

  // ── STEP 3: Seguridad ─────────────────────────────────────────────────────
  {
    label: "Email",
    key: "email",
    type: "email",
    validation: {
      required: { value: true, message: "Campo requerido" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Email no válido",
      },
    },
  },
  {
    label: "Contraseña",
    key: "password",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: { value: 8, message: "Mínimo 8 caracteres" },
    },
  },
  {
    label: "Confirmar Contraseña",
    key: "password_confirmation",
    type: "password",
    validation: {
      required: { value: true, message: "Campo requerido" },
      minLength: { value: 8, message: "Mínimo 8 caracteres" },
    },
  },
];
