import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useRoleData } from "@/observer/RoleDataContext";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DateCalendarValue from "@components/DateCalendarValue";
import Progress from "@components/Progress";
import type { ProfessionalService } from "@/typesResponse/ProfessionalService";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import type { Person } from "@/typesResponse/Person";
import type { Service } from "@/typesResponse/Service";

interface AppointmentCreationProp {
  isClient: boolean;
}

export default function AppointmentCreation({
  isClient,
}: AppointmentCreationProp) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [workerId, setWorkerId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { data, loading } = useRoleData();

  const servicesOptions: Service[] = data.services;
  const proServices: ProfessionalService[] = data.proServices;
  const workerProfessional: WorkerProfessional[] = data.workerProfessional;
  const persons: Person[] = data.persons;

  // Calculado derivado del serviceId
  const professionalsOptions = useMemo<Person[]>(() => {
    if (serviceId === null) return [];

    return proServices
      .filter((ps) => ps.service_id === serviceId)
      .map((ps) =>
        persons.find((p) => p.person_id === ps.professional.person_id),
      )
      .filter((p): p is Person => p !== undefined);
  }, [serviceId, proServices, persons]);

  // Calculado derivado de persons (solo para secretario)
  const clientsOptions = useMemo<Person[]>(() => {
    if (isClient) return [];
    return persons.filter((p) => p.client !== null);
  }, [isClient, persons]);

  // Calculado derivado del professionalId
  const workerSchedules = useMemo<WorkerProfessional[]>(() => {
    if (professionalId === null) return [];
    return workerProfessional.filter(
      (wp) => wp.professional.person_id === professionalId,
    );
  }, [professionalId, workerProfessional]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServiceId(value ? parseInt(value) : null);
    setProfessionalId(null);
    setWorkerId(null);
    setClientId(null);
  };

  const handleProfessionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    setProfessionalId(value ? parseInt(value) : null);
    setWorkerId(null);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setClientId(value ? parseInt(value) : null);
  };

  const handleToPay = () => {
    console.log({ serviceId, professionalId, workerId, clientId });
    if (!serviceId || !workerId || !professionalId) {
      setErrorMessage(
        "Por favor, complete todos los campos antes de continuar.",
      );
      return;
    }

    if (!isClient && !clientId) {
      setErrorMessage("Por favor, seleccione un paciente antes de continuar.");
      return;
    }

    setErrorMessage(null);

    const newPath = !isClient
      ? `/pago/${serviceId}/${workerId}/${clientId}`
      : `/pago/${serviceId}/${workerId}`;

    navigate(newPath);
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
      {/* Formulario */}
      <div
        style={{
          width: "20%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControl>
          <div className="grid grid-cols-1 gap-8">
            {/* Servicio */}
            <div className="flex flex-col gap-2 w-full">
              <h6>Servicio</h6>
              <select
                onChange={handleServiceChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Escoja el servicio</option>
                {servicesOptions.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Profesional */}
            <div className="flex flex-col gap-2 w-full">
              <h6>Profesional</h6>
              <select
                onChange={handleProfessionalChange}
                disabled={serviceId === null}
                className="border border-gray-300 rounded-md p-2 w-full disabled:opacity-50"
              >
                <option value="">Escoja el profesional</option>
                {professionalsOptions.map((person) => (
                  <option key={person.person_id} value={person.person_id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Paciente - solo secretario */}
            {!isClient && (
              <div className="flex flex-col gap-2 w-full">
                <h6>Paciente</h6>
                <select
                  onChange={handleClientChange}
                  disabled={serviceId === null}
                  className="border border-gray-300 rounded-md p-2 w-full disabled:opacity-50"
                >
                  <option value="">Escoja el paciente</option>
                  {clientsOptions.map((person) => (
                    <option key={person.person_id} value={person.person_id}>
                      {person.first_name} {person.last_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Botón */}
          <div className="flex flex-col gap-2 w-full mt-8">
            <Button variant="contained" onClick={handleToPay}>
              Proceder a pagar
            </Button>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="text-red-600 text-sm mt-2 text-center">
              {errorMessage}
            </div>
          )}
        </FormControl>
      </div>

      {/* Calendario */}
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
          onScheduleSelect={setWorkerId}
        />
      </div>
    </div>
  );
}
