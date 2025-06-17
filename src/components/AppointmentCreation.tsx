import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ServiceOptions } from "@/types/ServiceOptions";
import {
  getProfessionalAppointment,
  getServicesAppointment,
} from "@utils/utils";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DateCalendarValue from "@components/DateCalendarValue";
import { ProfessionalOptions } from "@/types/ProfessionalOptions";
import { getDates } from "@utils/utils";

export default function AppointmentCreation() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const servicesOptions: ServiceOptions[] = getServicesAppointment();
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [queryType, setQueryType] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [professionalsOptions, setProfessionalsOptions] = useState<
    ProfessionalOptions[]
  >([]);

  const navigate = useNavigate();
  const handleToPay = () => {
    if (
      !serviceId ||
      !professionalId ||
      !queryType ||
      !identity.trim() ||
      !selectedDate ||
      !selectedHour
    ) {
      setErrorMessage(
        "Por favor, complete todos los campos antes de continuar."
      );
      return;
    }

    // Si todo está correcto, limpiar error y continuar
    setErrorMessage(null);
    console.log({
      serviceId,
      professionalId,
      queryType,
      selectedDate,
      selectedHour,
      identity,
    });
    navigate("/pago");
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setServiceId(value ? parseInt(value) : null);
  };

  useEffect(() => {
    if (serviceId !== null) {
      const professionals = getProfessionalAppointment(serviceId); // o await si es async
      setProfessionalsOptions(professionals);
    }
  }, [serviceId]);

  const handleProfessionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setProfessionalId(value ? parseInt(value) : null);
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
                {servicesOptions?.map((option) => (
                  <option key={option.id} value={option.id}>
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
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Tipo de consulta</h6>
              </div>
              <RadioGroup
                row
                name="row-radio-buttons-group"
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
              >
                <FormControlLabel
                  value="presencial"
                  control={<Radio />}
                  label="Presencial"
                />
                <FormControlLabel
                  value="virtual"
                  control={<Radio />}
                  label="Virtual"
                />
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Cédula del paciente</h6>
              </div>
              <TextField
                required
                type="tel"
                variant="outlined"
                size="small"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full"
              />
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
          fetchAvailableDates={getDates}
          onDateChange={setSelectedDate}
          onHourChange={setSelectedHour}
        />
      </div>
    </div>
  );
}
