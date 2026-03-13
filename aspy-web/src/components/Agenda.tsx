import { Scheduler } from "@aldabil/react-scheduler";
import { es } from "date-fns/locale";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import { translateStatus } from "@/utils/utils";

/* Ver documentacion en https://github.com/aldabil21/react-scheduler  */

export default function Agenda({
  appointments,
}: {
  appointments: AppointmentResponse[];
}) {
  const events = appointments.map((appointment) => ({
    event_id: `Servicio: ${appointment.appointment_id}`,
    title: `Paciente: ${appointment.client.first_name} ${appointment.client.last_name} | Profesional: ${appointment.professional.first_name} ${appointment.professional.last_name}`,
    subtitle: `Servicio: ${appointment.service.name} | Estado: ${translateStatus(appointment.status.name)}`,
    start: new Date(
      `${appointment.schedule.date}T${appointment.schedule.start_time}`
    ),
    end: new Date(
      `${appointment.schedule.date}T${appointment.schedule.end_time}`
    ),
  }));
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
