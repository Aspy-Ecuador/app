import { Scheduler } from "@aldabil/react-scheduler";
import { es } from "date-fns/locale";
import { AppointmentResponse } from "@/types/AppointmentResponse";
import { PersonResponse } from "@/types/PersonResponse";
import { WorkerScheduleResponse } from "@/types/WorkerScheduleResponse";
import { ServiceResponse } from "@/types/ServiceResponse";

/* Ver documentacion en https://github.com/aldabil21/react-scheduler  */

export function getPerson(person_id: number): PersonResponse {
  const getPersonsFromLocalStorage = (): PersonResponse[] => {
    const personsData = localStorage.getItem("persons");
    return personsData ? (JSON.parse(personsData) as PersonResponse[]) : [];
  };

  const persons = getPersonsFromLocalStorage();
  const person = persons.find((person) => person.person_id === person_id);
  if (!person) throw new Error(`No se encontró la persona con ID ${person_id}`);
  return person;
}

export function getWorkerSchedule(
  worker_schedule_id: number
): WorkerScheduleResponse {
  const getWorkerScheduleFromLocalStorage = (): WorkerScheduleResponse[] => {
    const workerscheduleData = localStorage.getItem("workerSchedules");
    return workerscheduleData
      ? (JSON.parse(workerscheduleData) as WorkerScheduleResponse[])
      : [];
  };

  const workerschedules = getWorkerScheduleFromLocalStorage();
  const workerschedule = workerschedules.find(
    (workerschedule) => workerschedule.worker_schedule_id === worker_schedule_id
  );
  if (!workerschedule)
    throw new Error(
      `No se encontró el worker schedule con ID ${worker_schedule_id}`
    );
  return workerschedule;
}

export function getService(service_id: number): ServiceResponse {
  const getServiceFromLocalStorage = (): ServiceResponse[] => {
    const workerscheduleData = localStorage.getItem("services");
    return workerscheduleData
      ? (JSON.parse(workerscheduleData) as ServiceResponse[])
      : [];
  };

  const services = getServiceFromLocalStorage();
  const service = services.find((service) => service.service_id === service_id);
  if (!service)
    throw new Error(`No se encontró el worker schedule con ID ${service_id}`);
  return service;
}

export default function Agenda({
  appointments,
}: {
  appointments: AppointmentResponse[];
}) {
  const events = appointments.map((appointment) => ({
    event_id: `Servicio: ${getService(appointment.payment.service_id).name}`,
    title: `Paciente: ${getPerson(appointment.payment.person_id).first_name} ${getPerson(appointment.payment.person_id).middle_name} | Profesional: ${getPerson(appointment.worker_schedule.person_id).first_name} ${getPerson(appointment.worker_schedule.person_id).middle_name}`,
    subtitle: `Estado: ${appointment.status.name}`,
    start: new Date(
      `${getWorkerSchedule(appointment.worker_schedule_id).schedule.date}T${getWorkerSchedule(appointment.worker_schedule_id).schedule.start_time}`
    ),
    end: new Date(
      `${getWorkerSchedule(appointment.worker_schedule_id).schedule.date}T${getWorkerSchedule(appointment.worker_schedule_id).schedule.end_time}`
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
