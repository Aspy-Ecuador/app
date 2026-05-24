// FINAL
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FileData } from "@/types/FileData";
import { getAppointment, uploadToCloudinary } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "@components/Progress";
import appointmentReportAPI from "@/API/appointmentReportAPI";
import Success from "../Success";
import type { ReportRequest } from "@/typesRequest/ReportRequest";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

interface AddReportProps {
  setReport: (file: FileData | null) => void;
}

export default function AddReport({ setReport }: AddReportProps) {
  const { appointmentId } = useParams();
  const [reporte, setReporte] = useState<FileData | null>(null);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data,
    loading,
    refreshAppointments,
    refreshServices,
    refreshPersons,
    refreshAppointmentReports,
  } = useRoleData();

  if (loading) return <Progress />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileData: FileData = { file, name: file.name };
    setReport(fileData);
    setReporte(fileData);
    e.target.value = "";
  };

  const handleRemove = () => {
    setReport(null);
    setReporte(null);
  };

  const handleSend = async () => {
    if (!reporte || !appointmentId) return;
    setSending(true);
    try {
      const reportUrl = await uploadToCloudinary(reporte);
      const dataAppointment = getAppointment(
        data.appointments,
        Number(appointmentId),
      );
      if (!dataAppointment) return;

      const dataRequest: ReportRequest = {
        appointmentId: Number(appointmentId),
        file: reportUrl,
        sign: `${dataAppointment.professional.first_name} ${dataAppointment.professional.last_name}`,
      };

      await appointmentReportAPI.createReport(dataRequest);
      await refreshAppointments();
      await refreshServices();
      await refreshPersons();
      await refreshAppointmentReports();
      setOpen(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* ── Sección: subir archivo ── */}
      <Box>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 2, display: "block", mb: 1.5 }}
        >
          Archivo del reporte
        </Typography>

        {reporte ? (
          /* Archivo cargado */
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: "0.5px solid",
              borderColor: "success.light",
              bgcolor: "#EAF3DE",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{ fontSize: 18, color: "success.main", flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Archivo cargado
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                noWrap
                title={reporte.name}
                sx={{ color: "#3B6D11" }}
              >
                {reporte.name}
              </Typography>
            </Box>
            <Button
              size="small"
              color="inherit"
              onClick={handleRemove}
              sx={{
                minWidth: 0,
                p: 0.5,
                borderRadius: 1,
                color: "text.disabled",
                "&:hover": { color: "error.main" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </Button>
          </Stack>
        ) : (
          /* Zona de carga */
          <Box
            component="label"
            htmlFor="report-upload"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              p: 3,
              borderRadius: 2.5,
              border: "1.5px dashed",
              borderColor: "divider",
              cursor: "pointer",
              transition: "all 0.15s",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "#E6F1FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UploadFileRoundedIcon sx={{ fontSize: 18, color: "#185FA5" }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" fontWeight={500}>
                Subir reporte
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Solo PDF · hasta 10 MB
              </Typography>
            </Box>
            <input
              id="report-upload"
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Box>
        )}
      </Box>

      {/* ── Info del archivo si ya cargó ── */}
      {reporte && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <InsertDriveFileOutlinedIcon
            sx={{ fontSize: 14, color: "text.disabled" }}
          />
          <Typography variant="caption" color="text.secondary" noWrap>
            PDF listo para enviar
          </Typography>
        </Stack>
      )}

      <Divider />

      {/* ── Acciones ── */}
      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          Cancelar
        </Button>

        <Button
          fullWidth
          variant="contained"
          size="small"
          disabled={!reporte || sending}
          onClick={handleSend}
          color="info"
          startIcon={
            sending ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <SendRoundedIcon sx={{ fontSize: 15 }} />
            )
          }
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {sending ? "Enviando..." : "Enviar"}
        </Button>
      </Stack>

      <Success
        open={open}
        handleClose={() => {
          setOpen(false);
          navigate("/dashboard");
        }}
        isRegister={true}
        message="Se ha registrado con éxito!!"
      />
    </Box>
  );
}
