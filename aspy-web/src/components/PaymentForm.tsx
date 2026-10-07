// FINAL
import { useState, useEffect, useMemo } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { FileData } from "@/types/FileData";
import UploadButton from "@buttons/UploadButton";
import {
  UploadFile,
  CheckCircleOutline,
  ContentCopyRounded,
} from "@mui/icons-material";
import { useRoleData } from "@/observer/RoleDataContext";
import type { Service } from "@typesResponse/Service";
import bankAccountAPI, { type BankAccount } from "@API/bankAccountAPI";
import CircularProgress from "@mui/material/CircularProgress";

interface PaymentFormProps {
  setFile: (valid: FileData) => void;
  setIsValid: (valid: boolean) => void;
  service_id: number;
}

const PaymentCard = styled(MuiCard)<{ selected?: boolean }>(({ theme }) => ({
  border: "2px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: 16,
  width: "100%",
  background: `linear-gradient(135deg, ${theme.palette.primary.light}18 0%, ${theme.palette.primary.main}08 100%)`,
  boxShadow: "none",
}));

const InfoRow = ({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 0.75,
    }}
  >
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {copyable && (
        <ContentCopyRounded
          sx={{
            fontSize: 14,
            color: "primary.main",
            cursor: "pointer",
            opacity: 0.7,
            "&:hover": { opacity: 1 },
          }}
          onClick={() => navigator.clipboard?.writeText(value)}
        />
      )}
    </Box>
  </Box>
);

export default function PaymentForm({
  service_id,
  setIsValid,
  setFile,
}: PaymentFormProps) {
  const { data, loading } = useRoleData();
  const [signature, setSignature] = useState<FileData | null>(null);
  // Datos bancarios que configura el Admin (undefined = cargando, null = sin configurar)
  const [cuenta, setCuenta] = useState<BankAccount | null | undefined>(undefined);

  useEffect(() => {
    bankAccountAPI.get().then(setCuenta, () => setCuenta(null));
  }, []);

  const service = useMemo(() => {
    if (!loading && data.services) {
      return data.services.find((s: Service) => s.service_id === service_id);
    }
    return undefined;
  }, [loading, data.services, service_id]);

  useEffect(() => {
    // Sin cuenta configurada no se puede pagar, aunque se suba un archivo
    const allFilled = !!signature && !!cuenta;
    if (allFilled) setFile(signature);
    setIsValid(allFilled);
  }, [signature, cuenta, setFile, setIsValid]);

  return (
    <Stack spacing={3} useFlexGap>
      {/* Selección de método de pago */}
      <Box>
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            letterSpacing: 1.2,
            mb: 1.5,
            display: "block",
          }}
        >
          Método de pago
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup name="paymentType">
            <PaymentCard>
              <CardActionArea
                sx={{
                  borderRadius: 3,
                  ".MuiCardActionArea-focusHighlight": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AccountBalanceRoundedIcon
                      sx={{ color: "white", fontSize: 20 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      Transferencia Bancaria
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Pago directo a cuenta
                    </Typography>
                  </Box>
                  <Chip
                    label="Seleccionado"
                    size="small"
                    sx={{
                      backgroundColor: "primary.main",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      // El tema pinta el texto de los chips con el color primario: aquí va blanco para que se lea
                      "& .MuiChip-label": { color: "#fff" },
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </PaymentCard>
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Monto a pagar */}
      <Box
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.75)", letterSpacing: 1 }}
          >
            TOTAL A PAGAR
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: "white", fontWeight: 800, lineHeight: 1.1, mt: 0.25 }}
          >
            ${service?.price}
          </Typography>
        </Box>
        <AccountBalanceRoundedIcon sx={{ color: "rgba(255,255,255,0.85)", fontSize: 40 }} />
      </Box>

      {/* Datos de la cuenta */}
      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            backgroundColor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Datos de transferencia
          </Typography>
        </Box>
        <Box sx={{ px: 2.5, py: 1.5 }}>
          {cuenta === undefined ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={22} />
            </Box>
          ) : cuenta === null ? (
            <Alert severity="warning" sx={{ my: 1, borderRadius: 2 }}>
              La fundación todavía no ha registrado sus datos bancarios, así que por ahora no se puede pagar
              en línea. Comunícate con la fundación para agendar tu cita.
            </Alert>
          ) : (
            <>
              <InfoRow label="Banco" value={cuenta.bank_name} />
              <Divider />
              <InfoRow label="Tipo" value={`Cuenta ${cuenta.account_type}`} />
              <Divider />
              <InfoRow label="Número de cuenta" value={cuenta.account_number} copyable />
              <Divider />
              <InfoRow label="Titular" value={cuenta.holder_name} />
              <Divider />
              <InfoRow label="C.I. / RUC" value={cuenta.holder_id} copyable />
            </>
          )}
        </Box>
      </Box>

      {/* Alerta */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon fontSize="small" />}
        sx={{
          borderRadius: 2,
          "& .MuiAlert-message": { fontSize: "0.82rem" },
        }}
      >
        El personal administrativo revisará y aprobará su comprobante. Su cita
        quedará confirmada una vez verificado el pago.
      </Alert>

      {/* Upload */}
      <Box
        sx={{
          borderRadius: 3,
          border: "2px dashed",
          borderColor: signature ? "success.main" : "divider",
          p: 2.5,
          transition: "border-color 0.2s ease",
          backgroundColor: signature ? "success.50" : "transparent",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Comprobante de pago
        </Typography>

        {signature ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleOutline sx={{ color: "success.main", fontSize: 22 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {signature.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Archivo cargado correctamente
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              Suba el comprobante de pago en formato PDF o Imagen.
            </Typography>
            <UploadButton
              accept="image/*,application/pdf"
              label="Subir comprobante"
              icon={<UploadFile fontSize="small" />}
              buttonClassName="bg-white text-blue-700 font-semibold border-2 border-blue-500 hover:bg-blue-50 rounded-xl px-4 py-2 transition-all dark:bg-transparent dark:text-blue-300 dark:hover:bg-blue-500/15"
              onFileSelected={(fileData) => setSignature(fileData)}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
}
