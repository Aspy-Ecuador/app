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

import DateCalendarValue from "./DateCalendarValue";
import { ProfessionalOptions } from "@/types/ProfessionalOptions";

export default function AppointmentCreation() {
  const navigate = useNavigate();
  const handleToPay = () => {
    navigate("/pago");
  };

  const servicesOptions: ServiceOptions[] = getServicesAppointment();
  const [serviceId, setServiceId] = useState<number | null>(null);
  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setServiceId(value ? parseInt(value) : null);
  };

  const [professionalsOptions, setProfessionalsOptions] = useState<
    ProfessionalOptions[]
  >([]);

  useEffect(() => {
    if (serviceId !== null) {
      const professionals = getProfessionalAppointment(serviceId); // o await si es async
      setProfessionalsOptions(professionals);
    }
  }, [serviceId]);

  const [queryType, setQueryType] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const handleProfessionalChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setProfessionalId(value ? parseInt(value) : null);
  };
  console.log(professionalId); //SACAR
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
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
                className="w-full md:w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row gap-2 w-full">
                <h6 className="grow">Nombre del paciente</h6>
              </div>
              <TextField
                required
                type="text"
                variant="outlined"
                size="small"
                className="w-full md:w-[300px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button variant="contained" onClick={handleToPay}>
              Proceder a pagar
            </Button>
          </div>
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
        <DateCalendarValue />
      </div>
    </div>
  );
}
