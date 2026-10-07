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
  get: async (): Promise<BankAccount | null> => (await api.get(`/bank-account`)).data || null,

  update: async (data: BankAccount): Promise<BankAccount> => (await api.put(`/bank-account`, data)).data.bank_account,
};

export default bankAccountAPI;
