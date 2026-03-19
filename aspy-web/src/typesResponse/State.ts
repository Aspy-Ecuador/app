// FINAL
import { Country } from "@/typesResponse/Country";

export interface State {
  state_id: number;
  country_id: number;
  name: string;

  country: Country;
}
