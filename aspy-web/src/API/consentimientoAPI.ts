import api from "@API/api";
import { VERSION_POLITICA } from "@/config/politica";

/** Aceptación de la política de privacidad de la cuenta con sesión. */
const consentimientoAPI = {
  /** ¿Le falta aceptar la política vigente? (cuentas creadas por la fundación, en su primer ingreso) */
  pendiente: async (): Promise<boolean> => (await api.get(`/consentimiento`)).data?.pendiente === true,

  aceptar: async (): Promise<void> => {
    await api.post(`/consentimiento`, { accepted_privacy_policy: true, policy_version: VERSION_POLITICA });
  },
};

export default consentimientoAPI;
