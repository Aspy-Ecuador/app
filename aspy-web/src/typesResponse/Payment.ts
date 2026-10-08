// FINAL
import type { Person } from "@/typesResponse/Person";
import type { PaymentData } from "@/typesResponse/PaymentData";
import type { PaymentStatus } from "@/typesResponse/PaymentStatus";
import type { Service } from "@/typesResponse/Service";
import type { Receipt } from "@/typesResponse/Receipt";

export interface Payment {
  payment_id: number;

  client_id: number;
  service_id: number;
  payment_data_id: number;
  payment_status_id: number;
  /** Monto cobrado en este pago (null en pagos antiguos: usar el precio del servicio). */
  amount?: string | number | null;

  created_by: number | null;
  modified_by: number | null;

  creation_date: string;
  modification_date: string;

  // relaciones
  client: Person;
  service: Service;

  payment_data: PaymentData;
  payment_status: PaymentStatus;

  receipt: Receipt;

  /** Pago rechazado: el motivo que escribió Secretaría (queda aunque el comprobante se borre). */
  motivo_rechazo?: string | null;
  /** Pago rechazado: cuándo se borrará su comprobante (lo decide el Admin). Null si no se borra o ya se borró. */
  comprobante_se_borra_el?: string | null;
}
