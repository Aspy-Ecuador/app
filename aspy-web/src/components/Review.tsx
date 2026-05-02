// FINAL
import { useRoleData } from "@/observer/RoleDataContext";
import type { Service } from "@typesResponse/Service";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Progress from "@components/Progress";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

interface ReviewProps {
  service_id: number;
}

export default function Review({ service_id }: ReviewProps) {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const service = data.services?.find(
    (s: Service) => s.service_id === service_id,
  );

  return (
    <Stack spacing={3}>
      {/* Resumen del servicio */}
      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header de la tarjeta */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <MedicalServicesRoundedIcon sx={{ color: "white", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ color: "white", fontWeight: 600, letterSpacing: 0.5 }}
          >
            Resumen de la Cita
          </Typography>
        </Box>

        {/* Contenido */}
        <Box sx={{ px: 3, py: 2 }}>
          {/* Servicio */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                Servicio
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.25 }}>
                {service?.name}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              ${service?.price}
            </Typography>
          </Box>

          <Divider />

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              pb: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, color: "primary.main" }}
              >
                ${service?.price}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                IVA incluido
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Método de pago */}
      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: "primary.50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AccountBalanceRoundedIcon sx={{ color: "primary.main" }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Método de pago
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Transferencia bancaria
          </Typography>
        </Box>
        <Chip
          icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
          label="Verificando"
          size="small"
          sx={{
            backgroundColor: "warning.50",
            color: "warning.dark",
            fontWeight: 600,
            "& .MuiChip-icon": { color: "warning.main" },
          }}
        />
      </Box>
    </Stack>
  );
}
