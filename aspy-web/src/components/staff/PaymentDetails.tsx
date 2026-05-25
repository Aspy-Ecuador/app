import { useParams, useNavigate } from "react-router-dom";
import { getPayment } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Header from "@components/Header";
import InvoiceView from "@components/InvoiceView";
import ReceiptDetails from "@staff/ReceiptDetails";
import PDFViewer from "@components/PDFViewer";
import Progress from "@components/Progress"; // <-- Importamos Progress
import { useRoleData } from "@/observer/RoleDataContext";
import type { Payment } from "@/typesResponse/Payment";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = parseInt(id!);
  
  // 1. Extraemos 'loading' del contexto
  const { data, loading } = useRoleData(); 

  const handleBack = () => {
    navigate(-1);
  };

  // 2. ESCUDO PROTECTOR: Si la data está cargando, mostramos el spinner en vez de romper la app
  if (loading) return <Progress />;

  // 3. Ahora es 100% seguro buscar el pago porque la data ya llegó
  const payment: Payment = getPayment(numericId, data.payments ?? []);

  // 4. (Opcional pero buena práctica) Si ponen una URL con un ID que no existe
  if (!payment) return <Box sx={{ p: 4, textAlign: "center" }}>No se encontró el pago especificado.</Box>;

  return (
    <Box 
      className="box-panel-control" 
      sx={{ 
        padding: 2,
        "& .texto-dinero": {
          color: "#0F6E56 !important",
          fontWeight: "600 !important",
        }
      }}
    >
      <Grid container spacing={2}>
        
        {/* Header estandarizado */}
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Detalles del pago"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        {/* Contenedor interno para las columnas */}
        <Grid 
          container 
          size={12} 
          spacing={1.5} 
          alignItems="flex-start" 
          sx={{ margin: 0, width: "100%" }}
        >
          {/* Izquierda: Detalles del recibo */}
          <Grid 
            size={{ xs: 12, md: 6, lg: 3 }} 
            order={{ xs: 1, lg: 1 }}
          >
            <ReceiptDetails receiptData={payment} />
          </Grid>
          
          {/* Centro: Visor PDF */}
          <Grid 
            size={{ xs: 12, md: 12, lg: 6 }} 
            order={{ xs: 3, lg: 2 }}
          >
            <PDFViewer url={payment.payment_data.file!} />
          </Grid>
          
          {/* Derecha: Factura Visual */}
          <Grid 
            size={{ xs: 12, md: 6, lg: 3 }} 
            order={{ xs: 2, lg: 3 }}
          >
            <InvoiceView
              id={payment.payment_id}
              client_id={payment.client_id}
              date={payment.creation_date}
              client={`${payment.client.first_name} ${payment.client.last_name}`}
              service={payment.service.name}
              price={Number(payment.service.price)}
              total={Number(payment.service.price)}
              paymentMethod={payment.payment_data.type}
            />
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
}