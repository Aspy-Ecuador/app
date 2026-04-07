// FINAL
import type { Receipt } from "@typesResponse/Receipt";

export type FlattenedReceipt = {
  id: number;
  client: string;
  service: string;
  price: string;
  date: string;
  receipt: Receipt;
};
