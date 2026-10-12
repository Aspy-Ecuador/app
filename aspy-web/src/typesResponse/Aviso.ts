/** Un aviso guardado para la cuenta con sesión (GET /api/avisos). */
export interface Aviso {
  aviso_id: number;
  /** Qué pasó: "pago_aprobado", "cita_reservada"… (ver `Aviso` en el backend). */
  tipo: string;
  titulo: string;
  texto: string;
  /** Pantalla de la web a la que lleva, si la tiene (p. ej. "/dashboard?cita=12"). */
  enlace: string | null;
  leido: boolean;
  /** Cuándo se creó, en hora universal. */
  creado_el: string | null;
}

/** Algo que la cuenta tiene por revisar ahora mismo. No se guarda: el servidor lo cuenta al preguntar. */
export interface Pendiente {
  clave: string;
  cantidad: number;
  titulo: string;
  texto: string;
  enlace: string;
  /** true = le toca resolverlo a esta cuenta; false = solo le conviene saberlo. */
  accion: boolean;
}

export interface ResumenDeAvisos {
  /** Los más recientes primero. */
  avisos: Aviso[];
  sin_leer: number;
  pendientes: Pendiente[];
}
