// FINAL
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import DateCalendarValue from "@components/DateCalendarValue";
import Progress from "@components/Progress";
import type { ProfessionalService } from "@/typesResponse/ProfessionalService";
import type { WorkerProfessional } from "@/typesResponse/WorkerProfessional";
import type { Person } from "@/typesResponse/Person";
import type { Service } from "@/typesResponse/Service";

interface AppointmentCreationProp {
  isClient: boolean;
}

const SectionPanel = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{
      border: "0.5px solid",
      borderColor: "divider",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        px: 1.75,
        py: 1.25,
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.disabled",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

const StyledSelect = ({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <FormControl fullWidth size="small" disabled={disabled}>
    <InputLabel sx={{ fontSize: 12 }}>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        fontSize: 12,
        borderRadius: 2,
        bgcolor: "action.hover",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
      }}
    >
      <MenuItem value="" sx={{ fontSize: 12 }}>
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
          Selecciona una opción
        </Typography>
      </MenuItem>
      {children}
    </Select>
  </FormControl>
);

export default function AppointmentCreation({
  isClient,
}: AppointmentCreationProp) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [workerId, setWorkerId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { data, loading, refreshWorkerProfessional } = useRoleData();

  const servicesOptions = useMemo<Service[]>(
    () => (data?.services ?? []).filter((s: Service) => s.is_available),
    [data],
  );
  const proServices = useMemo<ProfessionalService[]>(
    () => data?.proServices ?? [],
    [data],
  );
  const workerProfessional = useMemo<WorkerProfessional[]>(
    () => data?.workerProfessional ?? [],
    [data],
  );
  const persons = useMemo<Person[]>(() => data?.persons ?? [], [data]);

  const professionalsOptions = useMemo<Person[]>(() => {
    if (serviceId === null) return [];
    return proServices
      .filter((ps) => ps.service_id === serviceId)
      .map((ps) =>
        persons.find((p) => p.person_id === ps.professional.person_id),
      )
      .filter(
        (p): p is Person => p !== undefined && p.user_account.is_available,
      );
  }, [serviceId, proServices, persons]);

  const clientsOptions = useMemo<Person[]>(() => {
    if (isClient) return [];
    return persons.filter(
      (p) => p.user_account.role.role_id === 3 && p.user_account.is_available,
    );
  }, [isClient, persons]);

  const workerSchedules = useMemo<WorkerProfessional[]>(() => {
    if (professionalId === null) return [];
    return workerProfessional.filter(
      (wp) => wp.professional.person_id === professionalId && wp.is_available,
    );
  }, [professionalId, workerProfessional]);

  const handleToPay = () => {
    if (!serviceId || !workerId || !professionalId) {
      setErrorMessage("Completa todos los campos antes de continuar.");
      return;
    }
    if (!isClient && !clientId) {
      setErrorMessage("Selecciona un paciente antes de continuar.");
      return;
    }
    setErrorMessage(null);
    navigate(
      !isClient
        ? `/pago/${serviceId}/${workerId}/${clientId}/${professionalId}`
        : `/pago/${serviceId}/${workerId}/${professionalId}`,
    );
  };

  useEffect(() => {
    refreshWorkerProfessional();
  }, []);

  if (loading) return <Progress />;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // móvil: una columna, apilados
          sm: "1fr", // tablet pequeña: igual
          md: "260px minmax(0,1fr)", // desktop: formulario fijo + calendario
        },
        gap: 1.5,
        alignItems: "start",
      }}
    >
      {/* Formulario */}
      <SectionPanel label="Datos de la cita">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StyledSelect
            label="Servicio"
            value={serviceId?.toString() ?? ""}
            onChange={(v) => {
              setServiceId(v ? parseInt(v) : null);
              setProfessionalId(null);
              setWorkerId(null);
              setClientId(null);
            }}
          >
            {servicesOptions.map((s) => (
              <MenuItem key={s.service_id} value={s.service_id.toString()}>
                {s.name}
              </MenuItem>
            ))}
          </StyledSelect>

          <StyledSelect
            label="Profesional"
            value={professionalId?.toString() ?? ""}
            disabled={serviceId === null}
            onChange={(v) => {
              setProfessionalId(v ? parseInt(v) : null);
              setWorkerId(null);
            }}
          >
            {professionalsOptions.map((p) => (
              <MenuItem key={p.person_id} value={p.person_id.toString()}>
                {p.first_name} {p.last_name}
              </MenuItem>
            ))}
          </StyledSelect>

          {!isClient && (
            <StyledSelect
              label="Paciente"
              value={clientId?.toString() ?? ""}
              disabled={serviceId === null}
              onChange={(v) => setClientId(v ? parseInt(v) : null)}
            >
              {clientsOptions.map((p) => (
                <MenuItem key={p.person_id} value={p.person_id.toString()}>
                  {p.first_name} {p.last_name}
                </MenuItem>
              ))}
            </StyledSelect>
          )}

          {errorMessage && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                p: 1.25,
                bgcolor: "#FCEBEB",
                border: "0.5px solid #F7C1C1",
                borderRadius: 2,
              }}
            >
              <ErrorOutlineRoundedIcon
                sx={{ fontSize: 14, color: "#A32D2D", flexShrink: 0 }}
              />
              <Typography sx={{ fontSize: 11, color: "#A32D2D" }}>
                {errorMessage}
              </Typography>
            </Box>
          )}

          <Button
            onClick={handleToPay}
            fullWidth
            sx={{
              bgcolor: "#1D9E75",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 2,
              py: 1,
              mt: 0.5,
              "&:hover": { bgcolor: "#0F6E56" },
            }}
          >
            Proceder a pagar
          </Button>
        </Box>
      </SectionPanel>

      {/* Calendario */}
      <SectionPanel label="Selecciona fecha y hora">
        <DateCalendarValue
          availableSchedules={workerSchedules}
          onScheduleSelect={setWorkerId}
        />
      </SectionPanel>
    </Box>
  );
}
