// Hay que instalar npm install @mui/lab@6.0.0-beta.32
// FINAL
import type { Appointment } from "@/typesResponse/Appointment";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";
import type { AppointmentWithReports } from "@/types/AppointmentWithReports";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { getReportsUser } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import { tone } from "@shared-theme/themePrimitives";

interface TimeLinePatientsProps {
  patient_id: number;
  onSelectComments: (comments: string) => void;
  selectedComments: string;
}

const getStatusStyle = (statusId: number) => {
  if (statusId === 1)
    return { bg: tone.amber.bg, color: tone.amber.fg, accent: tone.amber.main };
  if (statusId === 2)
    return { bg: tone.green.bg, color: tone.green.fg, accent: tone.green.main };
  if (statusId === 3)
    return { bg: tone.blue.bg, color: tone.blue.fg, accent: tone.blue.main };
  if (statusId === 4)
    return { bg: tone.red.bg, color: tone.red.fg, accent: tone.red.main };
  if (statusId === 5)
    return { bg: tone.purple.bg, color: tone.purple.fg, accent: tone.purple.main };
  return { bg: tone.gray.bg, color: tone.gray.fg, accent: tone.gray.main };
};

export default function TimeLinePatients({
  patient_id,
  onSelectComments,
  selectedComments,
}: TimeLinePatientsProps) {
  const { data, loading } = useRoleData();
  if (loading) return <Progress />;

  const appointments: Appointment[] = data.appointments || [];
  const appointmentsReport: AppointmentReport[] = data.appointmentReports || [];
  const appointmentsReportUser: AppointmentWithReports[] = getReportsUser(
    appointmentsReport,
    patient_id,
    appointments,
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          borderBottom: "0.5px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          Historial de citas
        </Typography>
        <Box
          sx={{
            fontSize: 10,
            fontWeight: 500,
            px: 1,
            py: 0.25,
            borderRadius: "20px",
            bgcolor: "action.hover",
            border: "0.5px solid",
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          {appointmentsReportUser.length} registros
        </Box>
      </Box>

      {/* Lista */}
      <Box sx={{ p: 1.75, display: "flex", flexDirection: "column" }}>
        {appointmentsReportUser.length === 0 ? (
          <Typography
            sx={{
              fontSize: 13,
              color: "text.disabled",
              textAlign: "center",
              py: 4,
            }}
          >
            No hay registros disponibles
          </Typography>
        ) : (
          appointmentsReportUser.map((report, index) => {
            const style = getStatusStyle(
              report.appointment_status.appointment_status_id,
            );
            const isActive =
              report.report?.file === selectedComments && !!selectedComments;
            const isLast = index === appointmentsReportUser.length - 1;

            return (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1.5, pb: isLast ? 0 : 2.5 }}
              >
                {/* Dot + línea */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    pt: 0.375,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: style.accent,
                      bgcolor: style.bg,
                      flexShrink: 0,
                    }}
                  />
                  {!isLast && (
                    <Box
                      sx={{
                        flex: 1,
                        width: "1px",
                        bgcolor: "divider",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>

                {/* Tarjeta */}
                <Box
                  onClick={() =>
                    report.report && onSelectComments(report.report.file || "")
                  }
                  sx={{
                    flex: 1,
                    border: "0.5px solid",
                    borderColor: isActive ? tone.blue.main : "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.default",
                    boxShadow: isActive ? `0 0 0 2px ${tone.blue.bg}` : "none",
                    cursor: report.report ? "pointer" : "default",
                    transition: "border-color 0.15s",
                    "&:hover": report.report
                      ? { borderColor: "action.active" }
                      : {},
                  }}
                >
                  <Box sx={{ p: "10px 12px 8px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography>
                        Fecha:{" "}
                        {report.worker_schedule.schedule.date.split("T")[0]}
                      </Typography>
                      <Box
                        sx={{
                          px: 0.875,
                          py: 0.25,
                          borderRadius: "20px",
                          bgcolor: style.bg,
                          color: style.color,
                        }}
                      >
                        {report.appointment_status.name}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        color: "text.secondary",
                      }}
                    >
                      Hora: {report.worker_schedule.schedule.start_time} —{" "}
                      {report.worker_schedule.schedule.end_time}
                    </Typography>
                    <Typography sx={{ color: "text.disabled", mt: 0.5 }}>
                      {report.professional.first_name}{" "}
                      {report.professional.last_name} · {report.service?.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.875,
                      borderTop: "0.5px solid",
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    {report.report ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontSize: 11,
                          fontWeight: 500,
                          color: tone.blue.fg,
                        }}
                      >
                        <ArticleRoundedIcon sx={{ fontSize: 13 }} />
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: tone.blue.fg,
                          }}
                        >
                          Ver reporte
                        </Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                        Sin reporte
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
}
