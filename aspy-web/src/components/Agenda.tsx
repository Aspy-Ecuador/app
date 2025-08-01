import { Scheduler } from "@aldabil/react-scheduler";
import { es } from "date-fns/locale";
import { AppointmentResponse } from "@/types/AppointmentResponse";
import { getPerson, getService, getWorkerSchedule } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";

/* Ver documentacion en https://github.com/aldabil21/react-scheduler  */

export default function Agenda({
  appointments,
}: {
  appointments: AppointmentResponse[];
}) {
  const { data } = useRoleData();
  const events = appointments.map((appointment) => ({
    event_id: `Servicio: ${getService(appointment.payment.service_id, data).name}`,
    title: `Paciente: ${getPerson(appointment.payment.person_id, data).first_name} ${getPerson(appointment.payment.person_id, data).middle_name} | Profesional: ${getPerson(appointment.worker_schedule.person_id, data).first_name} ${getPerson(appointment.worker_schedule.person_id, data).middle_name}`,
    subtitle: `Estado: ${appointment.status.name}`,
    start: new Date(
      `${getWorkerSchedule(appointment.worker_schedule_id, data).schedule.date}T${getWorkerSchedule(appointment.worker_schedule_id, data).schedule.start_time}`
    ),
    end: new Date(
      `${getWorkerSchedule(appointment.worker_schedule_id, data).schedule.date}T${getWorkerSchedule(appointment.worker_schedule_id, data).schedule.end_time}`
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
