import { Receipt } from "./Receipt";

export type FlattenedReceipt = {
  id: number;
  client: string;
  service: string;
  price: number;
  date: string;
  receipt: Receipt;
};
