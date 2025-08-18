import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Grid from "@mui/material/Grid2";
import BancoPacifico from "@assets/BP.jpeg";
import { FileData } from "@/types/FileData";
import UploadButton from "@buttons/UploadButton";
import { Edit, UploadFile } from "@mui/icons-material";
import { useRoleData } from "@/observer/RoleDataContext";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";

interface PaymentFormProps {
  setFile: (valid: FileData) => void;
  setIsValid: (valid: boolean) => void;
  service_id: number;
}

const Card = styled(MuiCard)<{ selected?: boolean }>(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.divider,
  width: "100%",
  "&:hover": {
    background:
      "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
    borderColor: "primary.light",
    boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
    ...theme.applyStyles("dark", {
      background:
        "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
      borderColor: "primary.dark",
      boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5) ",
    }),
  },
  [theme.breakpoints.up("md")]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: theme.palette.primary.light,
        ...theme.applyStyles("dark", {
          borderColor: theme.palette.primary.dark,
        }),
      },
    },
  ],
}));

export default function PaymentForm({
  service_id,
  setIsValid,
  setFile,
}: PaymentFormProps) {
  const { data, loading } = useRoleData();
  const [signature, setSignature] = useState<FileData | null>(null);
  const [service, setService] = useState<ServiceResponse>();

  // Validación en tiempo real
  useEffect(() => {
    const allFilled = !!signature;
    if (allFilled) {
      setFile(signature);
    }
    setIsValid(allFilled);
    if (!loading && data.services) {
      const found = data.services.find(
        (s: ServiceResponse) => s.service_id === service_id
      );
      setService(found);
    }
  }, [signature]);

  return (
    <Stack spacing={{ xs: 1, sm: 3 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Card sx={{ cursor: "pointer" }}>
            <CardActionArea
              sx={{
                ".MuiCardActionArea-focusHighlight": {
                  backgroundColor: "transparent",
                },
                "&:focus-visible": {
                  backgroundColor: "action.hover",
                },
              }}
              className="boton-change"
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <AccountBalanceRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: "grey.400",
                      ...theme.applyStyles("dark", {
                        color: "grey.600",
                      }),
                    }),
                    {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Transferencia Bancaria
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Alert severity="warning" icon={<WarningRoundedIcon />}>
          Recuerde: una vez que suba su comprobante de pago, el personal
          administrativo revisará y aprobará el comprobante. Cuando esto ocurra,
          su cita quedará confirmada.
        </Alert>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
          Total a Pagar
        </Typography>
        <Typography variant="body1" gutterBottom>
          {service?.price}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
          Cuenta Bancaria
        </Typography>
        <Typography variant="body1" gutterBottom>
          Transfiera el pago a la cuenta bancaria que se indica a continuación.
        </Typography>
        <Grid container>
          <Grid size={9}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Banco:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Pacífico
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Tipo
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Cuenta Corriente
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Número de cuenta
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                123456789
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                C.I.
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                987654321
              </Typography>
            </Box>
          </Grid>

          <Grid size={3} className="contenedor-principal">
            <img
              src={BancoPacifico}
              alt="bancoPacifico"
              style={{ width: "50%", height: "auto" }}
            />
          </Grid>
          <Grid size={12}>
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Edit className="mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold">Comprobante de pago</h2>
              </div>
              <UploadButton
                accept="pdf/*"
                label="Subir comprobante"
                icon={<UploadFile className="mr-2 text-blue-600" />}
                buttonClassName="bg-white text-black font-bold border border-blue-600 hover:bg-blue-50"
                onFileSelected={(fileData) => setSignature(fileData)}
              />
              {signature && (
                <>
                  <p className="text-sm text-gray-500 mt-1">
                    Comprobante cargado: <strong>{signature.name}</strong>
                  </p>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
