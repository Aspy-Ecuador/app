// FINAL
import type { Receipt } from "@typesResponse/Receipt";

export type FlattenedReceipt = {
  id: number;
  client_id: number;
  client: string;
  service: string;
  price: number;
  date: string;
  receipt: Receipt;
};
