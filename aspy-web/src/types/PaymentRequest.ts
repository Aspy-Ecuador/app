export type PaymentRequest = {
  payment_data: {
    type: string; // Ej: "Transferencia"
    number: number; // Número de cuenta o comprobante
    file: string; // Puede ser una URL, base64 o nombre del archivo
  };
  payment: {
    person_id: number; // ID del cliente
    service_id: number; // ID del servicio
    service_price: number; // Precio unitario del servicio
    total_amount: number; // Monto total a pagar
  };
  scheduled_by: number; // ID del usuario que agenda
  worker_schedule_id: number; // ID del horario profesional
};
