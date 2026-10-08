// FINAL
import type { Appointment } from "@/typesResponse/Appointment";
import { estadoCita } from "@utils/estadoCita";
import { horaCorta } from "@utils/utils";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { tone } from "@shared-theme/themePrimitives";

interface ShowAppointmentProps {
  appointments: Appointment[];
}

const getInitials = (first: string, last: string) =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

export default function ShowAppointment({
  appointments,
}: ShowAppointmentProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {appointments.map((appointment, index) => {
        const status = estadoCita(appointment.appointment_status);
        const {
          client,
          professional,
          service,
          worker_schedule,
        } = appointment;
        const schedule = worker_schedule.schedule;

        return (
          <Card
            key={index}
            elevation={0}
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "action.active" },
            }}
          >
            {/* Barra de color superior según estado */}
            <Box
              sx={{
                height: 3,
                background: status.main,
              }}
            />

            <CardContent sx={{ p: "16px 18px !important" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Paciente y profesional */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    {
                      label: "Paciente",
                      first: client.first_name,
                      last: client.last_name,
                      avatarBg: tone.blue.bg,
                      avatarColor: tone.blue.fg,
                    },
                    {
                      label: "Profesional",
                      first: professional.first_name,
                      last: professional.last_name,
                      avatarBg: tone.green.bg,
                      avatarColor: tone.green.fg,
                    },
                  ].map(({ label, first, last, avatarBg, avatarColor }) => (
                    <Box
                      key={label}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: avatarBg,
                          color: avatarColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(first, last)}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "text.disabled",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            lineHeight: 1,
                          }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            lineHeight: 1.3,
                          }}
                        >
                          {first} {last}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Estado y servicio */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 0.75,
                  }}
                >
                  <Chip
                    label={status.nombre}
                    size="small"
                    sx={{
                      background: status.bg,
                      color: status.fg,
                      fontWeight: 500,
                      fontSize: 11,
                      height: 22,
                      borderRadius: "20px",
                      "& .MuiChip-label": { px: 1.25 },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      textAlign: "right",
                    }}
                  >
                    {service.name}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            {/* Footer con horario */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: "18px",
                py: "10px",
                bgcolor: "action.hover",
                borderTop: "0.5px solid",
                borderColor: "divider",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
              <Typography
                sx={{ fontFamily: "monospace", fontSize: 12, fontWeight: 500 }}
              >
                {horaCorta(schedule.start_time)} — {horaCorta(schedule.end_time)}
              </Typography>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  bgcolor: "text.disabled",
                  mx: 0.5,
                }}
              />
              <Typography
                sx={{ fontSize: 12, color: "text.secondary", ml: "auto" }}
              >
                {schedule.date.split("T")[0]}
              </Typography>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
