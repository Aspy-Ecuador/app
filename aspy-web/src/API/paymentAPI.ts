// FINAL
import api from "@API/api";
import type { Payment } from "@/typesResponse/Payment";

const paymentAPI = {
  getAllPayments: async (): Promise<Payment[]> =>
    (await api.get(`/payment`)).data,
};

export default paymentAPI;
