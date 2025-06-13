import { ReactNode } from "react";

export interface ButtonControl {
  text: string;
  icon: ReactNode;
  accion: () => void;
}
