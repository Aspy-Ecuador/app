import { Scheduler } from "@aldabil/react-scheduler";
import { es } from "date-fns/locale";
import type { Appointment } from "@/typesResponse/Appointment";

/* Ver documentacion en https://github.com/aldabil21/react-scheduler  */

export default function Agenda({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const events = appointments
    .filter((a) => a.worker_schedule?.schedule)
    .map((appointment) => {
      const schedule = appointment.worker_schedule!.schedule;

      const baseDate = schedule.date.split("T")[0];

      return {
        event_id: `Servicio: ${appointment.appointment_id}`,
        title: `Paciente: ${appointment.client.first_name} ${appointment.client.last_name} | Profesional: ${appointment.professional.first_name} ${appointment.professional.last_name}`,
        subtitle: `Servicio: ${appointment.service.name} | Estado: ${appointment.appointment_status.name}`,
        start: new Date(`${baseDate}T${schedule.start_time}`),
        end: new Date(`${baseDate}T${schedule.end_time}`),
      };
    });
  return (
    <Scheduler
      locale={es}
      view="week"
      editable={false}
      //editable={false}
      deletable={false}
      agenda={false}
      translations={{
        navigation: {
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          today: "Hoy",
        },
        form: {
          addTitle: "Agregar evento",
          editTitle: "Editar evento",
          confirm: "Confirmar",
          delete: "Eliminar",
          cancel: "Cancelar",
        },
        event: {
          title: "Título",
          subtitle: "Subtítulo",
          start: "Inicio",
          end: "Fin",
          allDay: "Todo el día",
        },
        moreEvents: "Más eventos...",
        noDataToDisplay: "No hay eventos para mostrar", // 🔹 Texto cuando no hay eventos
        loading: "Cargando...", // 🔹 Texto mientras se cargan los eventos
      }}
      events={events}
    />
  );
}
