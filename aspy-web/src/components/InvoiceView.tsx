// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import Progress from "./Progress";
import { useRoleData } from "@/observer/RoleDataContext";
import type { Person } from "@/typesResponse/Person";

interface InvoiceViewProps {
  id: number;
  date: string;
  client: string;
  service: string;
  price: number;
  total: number;
  paymentMethod: string;
  client_id: number;
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ mb: 1.25 }}>
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "text.disabled",
        mb: 0.25,
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
      {value}
    </Typography>
  </Box>
);

export default function InvoiceView({
  id,
  date,
  client,
  service,
  price,
  total,
  paymentMethod,
  client_id,
}: InvoiceViewProps) {
  const { data, loading } = useRoleData();
  if (loading) return <Progress />;

  const clientData = (data?.persons as Person[])?.find(
    (p) => p.person_id === client_id,
  );
  const email = clientData?.user_account.email ?? "N/A";
  const address = clientData?.address?.primary_address ?? "N/A";

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
          Recibo
        </Typography>
      </Box>

      <Box sx={{ p: 1.75 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
            Recibo de pago
          </Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 500 }}>#{id}</Typography>
        </Box>

        <Field label="Cliente" value={client} />
        <Field label="Dirección" value={address} />
        <Field label="Contacto" value={email} />
        <Field
          label="Fecha"
          value={
            date.split("T")[0] +
            " / " +
            date.split("T")[1].split(":")[0] +
            ":" +
            date.split("T")[1].split(":")[1]
          }
        />

        <Box
          sx={{
            borderTop: "0.5px solid",
            borderColor: "divider",
            pt: 1.25,
            mt: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pb: 1,
              borderBottom: "0.5px solid",
              borderColor: "divider",
            }}
          >
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {service}
            </Typography>
            {/* Precio formateado a 2 decimales */}
            <Typography
              sx={{ fontSize: 12, fontWeight: 500, fontFamily: "monospace" }}
            >
              ${Number(price).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              Total
            </Typography>
            {/* Total con la clase texto-dinero y formateo de 2 decimales */}
            <Typography
              className="texto-dinero"
              sx={{
                fontSize: 15,
                fontWeight: 600, // Aumentado para mayor impacto visual
                color: "#0F6E56",
                fontFamily: "monospace",
              }}
            >
              ${Number(total).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            pt: 1.25,
            borderTop: "0.5px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "text.disabled",
              mb: 0.75,
            }}
          >
            Método de pago
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.875,
              bgcolor: "action.hover",
              borderRadius: 2,
              border: "0.5px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                bgcolor: "#E1F5EE",
                color: "#0F6E56",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCardRoundedIcon sx={{ fontSize: 13 }} />
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {paymentMethod}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}