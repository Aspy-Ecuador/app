// FINAL
import { useState, useMemo } from "react";
import { getAuthenticatedUserIdRole } from "@/utils/store";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type { EventContentArg, EventClickArg } from "@fullcalendar/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { useTheme } from "@mui/material/styles";
import type { Appointment } from "@/typesResponse/Appointment";
import appointmentAPI from "@/API/appointmentAPI";
import { useRoleData } from "@/observer/RoleDataContext"; // ← NUEVO
import Success from "@components/Success"; // ← NUEVO
import Progress from "@components/Progress"; // ← NUEVO

interface DetailInfo {
  appointmentId: number;
  clientName: string;
  proName: string;
  serviceName: string;
  statusId: number;
  statusLabel: string;
  startTime: string;
  endTime: string;
  date: string;
  x: number;
  y: number;
  rawDate: string;
  rawStart: string;
}

const fmt = (t: string) => t.slice(0, 5);

const STATUS_MAP: Record<
  number,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    accent: string;
    chipBg: string;
    chipColor: string;
  }
> = {
  1: {
    label: "Guardada",
    bg: "#FAEEDA",
    border: "#BA7517",
    text: "#854F0B",
    accent: "#BA7517",
    chipBg: "#FAEEDA",
    chipColor: "#854F0B",
  },
  2: {
    label: "Agendada",
    bg: "#E1F5EE",
    border: "#1D9E75",
    text: "#0F6E56",
    accent: "#1D9E75",
    chipBg: "#E1F5EE",
    chipColor: "#0F6E56",
  },
  3: {
    label: "Asistió",
    bg: "#E6F1FB",
    border: "#378ADD",
    text: "#185FA5",
    accent: "#378ADD",
    chipBg: "#E6F1FB",
    chipColor: "#185FA5",
  },
  4: {
    label: "No Asistió",
    bg: "#FCEBEB",
    border: "#E24B4A",
    text: "#A32D2D",
    accent: "#E24B4A",
    chipBg: "#FCEBEB",
    chipColor: "#A32D2D",
  },
  5: {
    label: "Cancelada",
    bg: "#F3F0F9",
    border: "#7C5CBF",
    text: "#4B3080",
    accent: "#7C5CBF",
    chipBg: "#F3F0F9",
    chipColor: "#4B3080",
  },
};

const DEFAULT_STATUS = {
  label: "Desconocido",
  bg: "#F5F5F5",
  border: "#9E9E9E",
  text: "#616161",
  accent: "#9E9E9E",
  chipBg: "#F5F5F5",
  chipColor: "#616161",
};

const statusStyle = (statusId: number) =>
  STATUS_MAP[statusId] ?? DEFAULT_STATUS;

const CANCELLABLE_STATUS_IDS = new Set([1, 2]);

const LEGEND = Object.values(STATUS_MAP).map(({ label, accent }) => ({
  label,
  color: accent,
}));

const Legend = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.75,
      flexWrap: "wrap",
      px: 2,
      py: 1,
      border: "0.5px solid",
      borderColor: "divider",
      borderRadius: 3,
      bgcolor: "background.paper",
    }}
  >
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "text.disabled",
        mr: 0.5,
      }}
    >
      Estado
    </Typography>
    {LEGEND.map(({ label, color }) => (
      <Box
        key={label}
        sx={{ display: "flex", alignItems: "center", gap: 0.625 }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "3px",
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{ fontSize: 11, fontWeight: 500, color: "text.secondary" }}
        >
          {label}
        </Typography>
      </Box>
    ))}
  </Box>
);

const EventContent = ({ info }: { info: EventContentArg }) => {
  const { extendedProps } = info.event;
  const st = statusStyle(extendedProps.statusId);
  return (
    <Box
      sx={{
        height: "100%",
        px: "5px",
        py: "3px",
        borderLeft: `3px solid ${st.border}`,
        bgcolor: st.bg,
        borderRadius: "0 5px 5px 0",
        overflow: "hidden",
        cursor: "pointer",
        transition: "filter 0.15s",
        "&:hover": { filter: "brightness(0.94)" },
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: st.text,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {extendedProps.clientName}
      </Typography>
      <Typography
        sx={{
          fontSize: 9,
          color: st.text,
          opacity: 0.8,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {extendedProps.serviceName}
      </Typography>
    </Box>
  );
};

const DetailField = ({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
    <Box sx={{ mt: "1px", color: "text.disabled", "& svg": { fontSize: 13 } }}>
      {icon}
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "text.disabled",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: "text.primary",
          fontFamily: mono ? "monospace" : "inherit",
          lineHeight: 1.4,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

const DetailPopover = ({
  detail,
  onClose,
  onCancelled,
}: {
  detail: DetailInfo;
  onClose: () => void;
  onCancelled: () => void;
}) => {
  const st = statusStyle(detail.statusId);
  const safeX = Math.min(detail.x + 12, window.innerWidth - 280);
  const safeY = Math.min(detail.y - 8, window.innerHeight - 260);
  const [cancelling, setCancelling] = useState(false);

  const role = getAuthenticatedUserIdRole();
  const now = useMemo(() => new Date(), []);

  const canCancel = (() => {
    if (!CANCELLABLE_STATUS_IDS.has(detail.statusId)) return false;

    if (role === 4) return true;

    if (role === 3) {
      const appointmentDate = new Date(`${detail.rawDate}T${detail.rawStart}`);
      return (appointmentDate.getTime() - now.getTime()) / 36e5 > 24;
    }

    return false;
  })();

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await appointmentAPI.cancelAppointment(detail.appointmentId);
      onCancelled(); // ← dispara el refresh + Success en el padre
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Box
        onClick={onClose}
        sx={{ position: "fixed", inset: 0, zIndex: 1200 }}
      />
      <Paper
        elevation={0}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "fixed",
          zIndex: 1300,
          left: safeX,
          top: safeY,
          width: 256,
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
          animation: "popIn 0.14s ease",
          "@keyframes popIn": {
            from: { opacity: 0, transform: "scale(0.94) translateY(-4px)" },
            to: { opacity: 1, transform: "scale(1) translateY(0)" },
          },
        }}
      >
        <Box sx={{ height: 3, background: st.accent }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            pt: 1.25,
          }}
        >
          <Chip
            label={detail.statusLabel}
            size="small"
            sx={{
              fontSize: 10,
              fontWeight: 600,
              height: 20,
              bgcolor: st.chipBg,
              color: st.chipColor,
              "& .MuiChip-label": { px: 1 },
            }}
          />
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              width: 22,
              height: 22,
              border: "0.5px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              borderRadius: "6px",
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
          >
            {detail.clientName}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.5,
            pb: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          <Box sx={{ height: "0.5px", bgcolor: "divider", my: 0.25 }} />
          <DetailField
            icon={<PersonRoundedIcon />}
            label="Profesional"
            value={detail.proName}
          />
          <DetailField
            icon={<MedicalServicesRoundedIcon />}
            label="Servicio"
            value={detail.serviceName}
          />
          <DetailField
            icon={<AccessTimeRoundedIcon />}
            label="Horario"
            value={`${detail.startTime} – ${detail.endTime}`}
            mono
          />
          <DetailField
            icon={<CalendarTodayRoundedIcon />}
            label="Fecha"
            value={detail.date}
          />

          {canCancel && (
            <>
              <Box sx={{ height: "0.5px", bgcolor: "divider", my: 0.25 }} />
              <Button
                size="small"
                variant="outlined"
                disabled={cancelling}
                onClick={handleCancel}
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  borderColor: "#E24B4A",
                  color: "#A32D2D",
                  borderRadius: "8px",
                  textTransform: "none",
                  py: 0.5,
                  "&:hover": { bgcolor: "#FCEBEB", borderColor: "#E24B4A" },
                  "&.Mui-disabled": { opacity: 0.6 },
                }}
              >
                {cancelling ? (
                  <CircularProgress size={14} sx={{ color: "#E24B4A" }} />
                ) : (
                  "Cancelar cita"
                )}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function Agenda({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [detail, setDetail] = useState<DetailInfo | null>(null);
  const [open, setOpen] = useState(false); // ← NUEVO: controla el Success

  // ← NUEVO: refresh del contexto tras cancelar
  const { loading, refreshAppointments, refreshWorkerProfessional } =
    useRoleData();

  const handleCancelled = async () => {
    await Promise.all([refreshAppointments(), refreshWorkerProfessional()]);
    setOpen(true); // ← muestra el Success cuando el refresh termina
  };

  const handleSuccessClose = () => setOpen(false);

  // ← NUEVO: mientras refresca muestra el spinner
  if (loading) return <Progress />;

  const events = appointments
    .filter((a) => a.worker_schedule?.schedule)
    .map((a) => {
      const schedule = a.worker_schedule!.schedule;
      const baseDate = (schedule.date as unknown as string).split("T")[0];
      const startStr = schedule.start_time as unknown as string;
      const endStr = schedule.end_time as unknown as string;
      const statusId = a.appointment_status.appointment_status_id;

      return {
        id: String(a.appointment_id),
        title: `${a.client.first_name} ${a.client.last_name}`,
        start: new Date(`${baseDate}T${startStr}`),
        end: new Date(`${baseDate}T${endStr}`),
        extendedProps: {
          appointmentId: a.appointment_id,
          clientName: `${a.client.first_name} ${a.client.last_name}`,
          proName: `${a.professional.first_name} ${a.professional.last_name}`,
          serviceName: a.service.name,
          statusId,
          statusLabel: STATUS_MAP[statusId]?.label ?? a.appointment_status.name,
          startTime: fmt(startStr),
          endTime: fmt(endStr),
          date: new Date(`${baseDate}T00:00:00`).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          rawDate: baseDate,
          rawStart: startStr,
        },
      };
    });

  const handleEventClick = (info: EventClickArg) => {
    const rect = info.el.getBoundingClientRect();
    const ep = info.event.extendedProps;
    setDetail({
      appointmentId: ep.appointmentId,
      clientName: ep.clientName,
      proName: ep.proName,
      serviceName: ep.serviceName,
      statusId: ep.statusId,
      statusLabel: ep.statusLabel,
      startTime: ep.startTime,
      endTime: ep.endTime,
      date: ep.date,
      x: rect.right,
      y: rect.top,
      rawDate: ep.rawDate,
      rawStart: ep.rawStart,
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      <Legend />
      <Box
        sx={{
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
          "& .fc": { fontFamily: "inherit" },
          "& .fc-toolbar": {
            px: 2,
            py: 1.5,
            borderBottom: "0.5px solid",
            borderColor: "divider",
            flexWrap: "wrap",
            gap: 1,
          },
          "& .fc-toolbar-title": {
            fontSize: "14px !important",
            fontWeight: "500 !important",
          },
          "& .fc-button": {
            bgcolor: "action.hover !important",
            border: "0.5px solid !important",
            borderColor: "divider !important",
            borderRadius: "8px !important",
            color: "text.secondary !important",
            fontSize: "11px !important",
            fontWeight: "500 !important",
            textTransform: "none !important",
            px: "10px !important",
            py: "4px !important",
            boxShadow: "none !important",
          },
          "& .fc-button-active, & .fc-button-primary:not(:disabled).fc-button-active":
            {
              bgcolor: "#E6F1FB !important",
              borderColor: "#B5D4F4 !important",
              color: "#185FA5 !important",
            },
          "& .fc-today-button": {
            bgcolor: "#E1F5EE !important",
            borderColor: "#A8DEC9 !important",
            color: "#0F6E56 !important",
            "&:disabled": { opacity: "0.5 !important" },
          },
          "& .fc-col-header-cell": {
            bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA",
            borderColor: "divider",
          },
          "& .fc-col-header-cell-cushion": {
            fontSize: "11px !important",
            fontWeight: "600 !important",
            letterSpacing: "0.04em",
            textDecoration: "none !important",
            color: "text.disabled",
          },
          "& .fc-day-today": {
            bgcolor: `${isDark ? "rgba(75,163,211,0.06)" : "rgba(75,163,211,0.03)"} !important`,
          },
          "& .fc-day-today .fc-col-header-cell-cushion": {
            color: "#185FA5 !important",
          },
          "& .fc-timegrid-slot": { height: "54px !important" },
          "& .fc-timegrid-slot-label": {
            fontSize: "9px !important",
            fontWeight: "500 !important",
            color: "text.disabled",
            fontFamily: "monospace",
            verticalAlign: "top",
            pt: "4px",
          },
          "& .fc-scrollgrid, & .fc-scrollgrid td, & .fc-scrollgrid th": {
            borderColor: `${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} !important`,
          },
          "& .fc-timegrid-now-indicator-line": {
            borderColor: "#1D9E75 !important",
            borderWidth: "1.5px !important",
          },
          "& .fc-timegrid-now-indicator-arrow": {
            borderTopColor: "#1D9E75 !important",
            borderBottomColor: "#1D9E75 !important",
          },
          "& .fc-event": {
            border: "none !important",
            bgcolor: "transparent !important",
            boxShadow: "none !important",
            p: "0 !important",
          },
          "& .fc-event-main": { p: "0 !important", height: "100%" },
          "& .fc-daygrid-day-number": {
            fontSize: "12px !important",
            color: "text.secondary",
            textDecoration: "none !important",
            fontWeight: "500",
          },
          "& .fc-daygrid-day.fc-day-today .fc-daygrid-day-number": {
            color: "#185FA5 !important",
            fontWeight: "700 !important",
          },
        }}
      >
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            month: "Mes",
            week: "Semana",
            day: "Día",
            today: "Hoy",
          }}
          firstDay={1}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          slotDuration="01:00:00"
          allDaySlot={false}
          editable={false}
          selectable={false}
          nowIndicator
          stickyHeaderDates
          height="auto"
          eventContent={(info) => <EventContent info={info} />}
          eventClick={handleEventClick}
          events={events}
        />
      </Box>

      {detail && (
        <DetailPopover
          detail={detail}
          onClose={() => setDetail(null)}
          onCancelled={handleCancelled} // ← NUEVO
        />
      )}

      {/* ← NUEVO: modal de éxito tras cancelar */}
      <Success
        open={open}
        handleClose={handleSuccessClose}
        isRegister={false}
        message="Cita cancelada exitosamente"
      />
    </Box>
  );
}
