import api from "@API/api";
import { VERSION_POLITICA, type Consentimiento, type Declaracion } from "@/config/politica";
import type { ModoRepresentante } from "@components/privacidad/consentimiento";

/** Lo que responde `GET /consentimiento` sobre la cuenta con sesión. */
export interface EstadoDelConsentimiento {
  /** Le falta aceptar la política vigente (cuentas creadas por la fundación, en su primer ingreso). */
  pendiente: boolean;
  version: string;
  /** Declaraciones que debe aceptar según su rol. */
  declaraciones?: Declaracion[];
  /** Si lo da (o puede darlo) su representante legal, según su edad. */
  representante?: ModoRepresentante;
  aceptado_el?: string | null;
  calidad?: "titular" | "representante" | null;
  /** El retiro en línea es para pacientes y familias. */
  puede_retirar?: boolean;
}

/** Consentimiento de la cuenta con sesión: nadie acepta ni retira por otra persona. */
const consentimientoAPI = {
  estado: async (): Promise<EstadoDelConsentimiento> => (await api.get(`/consentimiento`)).data,

  aceptar: async (consentimiento: Consentimiento): Promise<void> => {
    await api.post(`/consentimiento`, { accepted_privacy_policy: true, policy_version: VERSION_POLITICA, consentimiento });
  },

  /** Deshabilita la cuenta y deja constancia del retiro. */
  retirar: async (): Promise<void> => {
    await api.post(`/consentimiento/retirar`, { confirmar: true });
  },
};

export default consentimientoAPI;
