import { Appointment } from "@/types/Appointment";
interface ShowAppointmentProps {
    unmarkedAppointmentsProp: Appointment[];
    unreportedAppointments: Appointment[];
}
export default function ShowAppointment({ unmarkedAppointmentsProp, unreportedAppointments, }: ShowAppointmentProps): import("react/jsx-runtime").JSX.Element;
export {};
