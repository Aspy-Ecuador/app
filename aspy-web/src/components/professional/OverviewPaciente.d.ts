import { User } from "@/types/User";
interface OverviewPacienteProps {
    paciente: User;
    representante: User;
    newReport: () => void;
}
export default function OverviewPaciente({ paciente, representante, newReport, }: OverviewPacienteProps): import("react/jsx-runtime").JSX.Element;
export {};
