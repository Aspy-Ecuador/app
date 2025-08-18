import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRoleData } from "@/observer/RoleDataContext";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import { getClientsAppointment, getProfessionalService } from "@/utils/utils";
import { getProfessionalSchedule } from "@/utils/utils";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DateCalendarValue from "@components/DateCalendarValue";
import Progress from "@components/Progress";
import { User } from "@/types/User";

interface AppointmentCreationProp {
  isClient: boolean;
}

export default function AppointmentCreation({
  isClient,
}: AppointmentCreationProp) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [professionalsOptions, setProfessionalsOptions] = useState<
    PersonResponse[]
  >([]);
  const [clientsOptions, setClientsOptions] = useState<User[]>([]);
  const [workerSchedules, setWorkerSchedules] = useState<
    WorkerScheduleResponse[]
  >([]);

  const navigate = useNavigate();

  const { data, loading } = useRoleData();

  useEffect(() => {
    if (serviceId !== null) {
      const professionals: PersonResponse[] = getProfessionalService(
        serviceId,
        data
      );
      setProfessionalsOptions(professionals);
      const clients: User[] = getClientsAppointment(data);
      setClientsOptions(clients);
      if (professionalId !== null) {
        const workerschedules: WorkerScheduleResponse[] =
          getProfessionalSchedule(professionalId, data);
        setWorkerSchedules(workerschedules);
      } else {
        setWorkerSchedules([]);
      }
    } else {
      setClientsOptions([]);
      setWorkerSchedules([]);
      setProfessionalsOptions([]);
    }
  }, [serviceId, data, professionalId]);

  const servicesOptions = data.services;

  const handleToPay = () => {
    if (!serviceId || !scheduleId || !professionalId) {
      setErrorMessage(
        "Por favor, complete todos los campos antes de continuar."
      );
      return;
    }

    if (!isClient) {
      if (!clientId) {
        setErrorMessage(
          "Por favor, complete todos los campos antes de continuar.xd"
        );
        return;
      }
    }

    setErrorMessage(null);
    if (!isClient) {
      const newPath = `/pago/${serviceId}/${scheduleId}/${clientId}`;
      navigate(newPath);
    } else {
      const newPath = `/pago/${serviceId}/${scheduleId}`;
      navigate(newPath);
    }
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setServiceId(value ? parseInt(value) : null);
    setProfessionalId(null); // ✅ Resetea el profesional seleccionado
    setScheduleId(null); // (opcional) resetea también el horario si es necesario
    setClientId(null);
    setProfessionalsOptions([]);
    setWorkerSchedules([]);
  };

  const handleProfessionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setProfessionalId(value ? parseInt(value) : null);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClientId(value ? parseInt(value) : null);
  };

  if (loading) return <Progress />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0px",
      }}
    >
      {/* Div izquierdo - contenido del formulario */}
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Servicio</h6>
              </div>
              <select
                onChange={handleServiceChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Escoja el servicio</option>
                {servicesOptions.map((option: any) => (
                  <option key={option.service_id} value={option.service_id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Profesional</h6>
              </div>
              <select
                onChange={handleProfessionalChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Escoja el profesional</option>
                {professionalsOptions?.map((option) => (
                  <option key={option.person_id} value={option.person_id}>
                    {option.first_name} {option.last_name}
                  </option>
                ))}
              </select>
            </div>
            {!isClient && (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-2 w-full">
                  <h6 className="grow">Paciente</h6>
                </div>
                <select
                  onChange={handleClientChange}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Escoja el paciente</option>
                  {clientsOptions?.map((option) => (
                    <option key={option.person_id} value={option.person_id}>
                      {option.full_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full mt-8">
            <Button variant="contained" onClick={handleToPay}>
              Proceder a pagar
            </Button>
          </div>
          {errorMessage && (
            <div className="text-red-600 text-sm mb-2 text-center">
              {errorMessage}
            </div>
          )}
        </FormControl>
      </div>

      {/* Div derecho - calendario */}
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DateCalendarValue
          availableSchedules={workerSchedules}
          onScheduleSelect={setScheduleId}
        />
      </div>
    </div>
  );
}
