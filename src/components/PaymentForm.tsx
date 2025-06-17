import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Grid from "@mui/material/Grid2";
import BancoPacifico from "@assets/BP.jpeg";

interface PaymentFormProps {
  paymentType: string;
  setPaymentType: (value: string) => void;
  setIsValid: (valid: boolean) => void;
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

const PaymentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: "1px solid ",
  borderColor: theme.palette.divider,
  background:
    "linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)",
  boxShadow: "0px 4px 8px hsla(210, 0%, 0%, 0.05)",
  [theme.breakpoints.up("xs")]: {
    height: 300,
  },
  [theme.breakpoints.up("sm")]: {
    height: 350,
  },
  ...theme.applyStyles("dark", {
    background:
      "linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)",
    boxShadow: "0px 4px 8px hsl(220, 35%, 0%)",
  }),
}));

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function PaymentForm({
  paymentType,
  setPaymentType,
  setIsValid,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cardName, setCardName] = useState("");

  const handlePaymentTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentType(event.target.value);
  };

  const handleCardNumberChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCardNameChange = (event: { target: { value: string } }) => {
    setCardName(event.target.value);
  };

  const handleCvvChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleExpirationDateChange = (event: { target: { value: string } }) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, "$1/");
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };

  // Validación en tiempo real
  useEffect(() => {
    const allFilled =
      cardNumber.trim() !== "" &&
      cvv.trim() !== "" &&
      cardName.trim() !== "" &&
      expirationDate.trim() !== "";
    setIsValid(allFilled);
  }, [cardNumber, cvv, cardName, expirationDate, setIsValid]);

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Card
            selected={paymentType === "creditCard"}
            onClick={() => setPaymentType("creditCard")}
            sx={{ cursor: "pointer" }}
          >
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
                <CreditCardRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: "grey.400",
                      ...theme.applyStyles("dark", {
                        color: "grey.600",
                      }),
                    }),
                    paymentType === "creditCard" && {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Tarjeta de Débito o Crédito
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            selected={paymentType === "bankTransfer"}
            onClick={() => setPaymentType("bankTransfer")}
            sx={{ cursor: "pointer" }}
          >
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
                    paymentType === "bankTransfer" && {
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
      {paymentType === "creditCard" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <PaymentContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">
                Tarjeta de Crédito o Débito
              </Typography>
              <CreditCardRoundedIcon sx={{ color: "text.secondary" }} />
            </Box>
            <SimCardRoundedIcon
              sx={{
                fontSize: { xs: 48, sm: 56 },
                transform: "rotate(90deg)",
                color: "text.secondary",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                gap: 2,
              }}
            >
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-number" required>
                  Número de tarjeta
                </FormLabel>
                <OutlinedInput
                  id="card-number"
                  autoComplete="card-number"
                  placeholder="0000 0000 0000 0000"
                  required
                  size="small"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </FormGrid>
              <FormGrid sx={{ maxWidth: "20%" }}>
                <FormLabel htmlFor="cvv" required>
                  CVV
                </FormLabel>
                <OutlinedInput
                  id="cvv"
                  autoComplete="CVV"
                  placeholder="123"
                  required
                  size="small"
                  value={cvv}
                  onChange={handleCvvChange}
                />
              </FormGrid>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-name" required>
                  Nombre
                </FormLabel>
                <OutlinedInput
                  id="card-name"
                  autoComplete="card-name"
                  placeholder="John Smith"
                  required
                  size="small"
                  value={cardName}
                  onChange={handleCardNameChange}
                />
              </FormGrid>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-expiration" required>
                  Fecha de expiración
                </FormLabel>
                <OutlinedInput
                  id="card-expiration"
                  autoComplete="card-expiration"
                  placeholder="MM/YY"
                  required
                  size="small"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                />
              </FormGrid>
            </Box>
          </PaymentContainer>
          <FormControlLabel
            control={<Checkbox name="saveCard" />}
            label="Recuerde los datos de la tarjeta de crédito para la próxima vez"
          />
        </Box>
      )}
      {paymentType === "bankTransfer" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Alert severity="warning" icon={<WarningRoundedIcon />}>
            Su cita será agendada una vez que suba el comprobante de depósito.
          </Alert>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            Cuenta Bancaria
          </Typography>
          <Typography variant="body1" gutterBottom>
            Transfiera el pago a la cuenta bancaria que se indica a
            continuación.
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
          </Grid>
        </Box>
      )}
    </Stack>
  );
}
