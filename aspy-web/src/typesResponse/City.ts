// FINAL
import { State } from "@/typesResponse/State";

export interface City {
  city_id: number;
  state_id: number;
  name: string;

  state: State;
}
