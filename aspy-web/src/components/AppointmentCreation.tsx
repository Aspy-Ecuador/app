import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRoleData } from "@/observer/RoleDataContext";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DateCalendarValue from "@components/DateCalendarValue";
import Progress from "@components/Progress";

export default function AppointmentCreation() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [scheduleId, setScheduleId] = useState<number | null>(null);

  const navigate = useNavigate();

  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const schedules = data.workerSchedules;

  const servicesOptions = data.services;

  const handleToPay = () => {
    if (!serviceId || !scheduleId) {
      setErrorMessage(
        "Por favor, complete todos los campos antes de continuar."
      );
      return;
    }

    setErrorMessage(null);
    const newPath = `/pago/${serviceId}/${scheduleId}`;
    navigate(newPath);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setServiceId(value ? parseInt(value) : null);
  };

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
          availableSchedules={schedules}
          onScheduleSelect={setScheduleId}
        />
      </div>
    </div>
  );
}
