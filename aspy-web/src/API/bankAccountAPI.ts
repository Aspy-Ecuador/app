import api from "@API/api";

/** Cuenta de la fundación para pagar por transferencia. La edita solo el Admin. */
export interface BankAccount {
  bank_name: string;
  account_type: "Ahorros" | "Corriente";
  account_number: string;
  holder_name: string;
  holder_id: string;
}

const bankAccountAPI = {
  /** null si el Admin todavía no la configuró. */
  get: async (): Promise<BankAccount | null> => {
    // Sin cuenta guardada el servidor responde `{}` (así serializa Laravel un null), no `null`:
    // solo cuenta como configurada si trae el número de cuenta.
    const cuenta = (await api.get(`/bank-account`)).data as Partial<BankAccount> | null;
    return cuenta?.account_number ? (cuenta as BankAccount) : null;
  },

  update: async (data: BankAccount): Promise<BankAccount> => (await api.put(`/bank-account`, data)).data.bank_account,
};

export default bankAccountAPI;
