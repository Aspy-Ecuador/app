// Datos de la cuenta donde las familias transfieren el pago de sus citas.
// Solo el Admin entra a esta pantalla y el backend solo acepta cambios del Admin.
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import bankAccountAPI, { type BankAccount } from "@API/bankAccountAPI";
import { tone } from "@shared-theme/themePrimitives";
import Campo from "@forms/Campo";
import { botonPrimarioSx, campoSx } from "@forms/estilos";

const VACIO: BankAccount = { bank_name: "", account_type: "Corriente", account_number: "", holder_name: "", holder_id: "" };

type Errores = Partial<Record<keyof BankAccount, string>>;

export default function DatosBancarios() {
  const [datos, setDatos] = useState<BankAccount>(VACIO);
  const [cargando, setCargando] = useState(true);
  const [configurada, setConfigurada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  useEffect(() => {
    bankAccountAPI
      .get()
      .then((c) => {
        if (c) {
          setDatos({ ...VACIO, ...c });
          setConfigurada(true);
        }
      })
      .catch(() => setMensaje({ tipo: "error", texto: "No se pudieron cargar los datos bancarios." }))
      .finally(() => setCargando(false));
  }, []);

  const cambiar = (campo: keyof BankAccount) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }));
    setErrores((er) => ({ ...er, [campo]: undefined }));
    setMensaje(null);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      const guardada = await bankAccountAPI.update({
        ...datos,
        account_number: datos.account_number.trim(),
        holder_id: datos.holder_id.trim(),
      });
      setDatos({ ...VACIO, ...guardada });
      setConfigurada(true);
      setErrores({});
      setMensaje({ tipo: "success", texto: "Datos bancarios guardados. Las familias ya los ven al pagar." });
    } catch (err) {
      const resp = (err as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }).response;
      if (resp?.status === 422 && resp.data?.errors) {
        setErrores(Object.fromEntries(Object.entries(resp.data.errors).map(([k, v]) => [k, v[0]])) as Errores);
        setMensaje({ tipo: "error", texto: "Revisa los campos marcados." });
      } else {
        setMensaje({ tipo: "error", texto: "No se pudieron guardar los datos. Inténtalo de nuevo." });
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Progress />;

  // Etiqueta arriba (Campo) + control sin etiqueta flotante
  const control = (k: keyof BankAccount) => ({
    id: k,
    value: datos[k],
    onChange: cambiar(k),
    error: !!errores[k],
    fullWidth: true,
    sx: campoSx,
  });

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Datos bancarios" chip="Pagos" />

      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, md: 8, lg: 6 }}>
          <Paper elevation={0} sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ px: 2.5, py: 1.75, borderBottom: "0.5px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: "8px", display: "grid", placeItems: "center", bgcolor: tone.blue.bg, color: tone.blue.fg }}>
                <AccountBalanceRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}>
                  Cuenta para transferencias
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.disabled", lineHeight: 1.2 }}>
                  Se muestra a pacientes y secretaría en la pantalla de pago
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={guardar} noValidate sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
              {!configurada && (
                <Alert severity="warning">
                  Todavía no hay datos bancarios: mientras tanto nadie puede pagar una cita en línea.
                </Alert>
              )}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 2, rowGap: 2, "& > *": { minWidth: 0 } }}>
                <Campo etiqueta="Banco" htmlFor="bank_name" error={errores.bank_name} ayuda="Ej.: Banco Pichincha">
                  <TextField {...control("bank_name")} />
                </Campo>
                <Campo etiqueta="Tipo de cuenta" idEtiqueta="account_type-etiqueta" error={errores.account_type}>
                  <TextField {...control("account_type")} select slotProps={{ select: { labelId: "account_type-etiqueta" } }}>
                    <MenuItem value="Corriente">Corriente</MenuItem>
                    <MenuItem value="Ahorros">Ahorros</MenuItem>
                  </TextField>
                </Campo>
                <Campo etiqueta="Número de cuenta" htmlFor="account_number" error={errores.account_number} ayuda="Solo números (y guiones si el banco los usa)">
                  <TextField {...control("account_number")} slotProps={{ htmlInput: { inputMode: "numeric" } }} />
                </Campo>
                <Campo etiqueta="Titular de la cuenta" htmlFor="holder_name" error={errores.holder_name} ayuda="Ej.: Fundación Aspy Ecuador">
                  <TextField {...control("holder_name")} />
                </Campo>
                <Campo etiqueta="C.I. / RUC del titular" htmlFor="holder_id" error={errores.holder_id} ayuda="10 a 13 números">
                  <TextField {...control("holder_id")} slotProps={{ htmlInput: { inputMode: "numeric" } }} />
                </Campo>
              </Box>

              {mensaje && <Alert severity={mensaje.tipo}>{mensaje.texto}</Alert>}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={guardando}
                  sx={botonPrimarioSx}
                >
                  {guardando ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Guardar"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
