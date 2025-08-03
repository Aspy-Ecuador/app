import { SharedRoutes } from "./SharedRoutes";
import ControlPanel from "@client/ControlPanel";
import Profile from "@components/Profile";
import AppointmentView from "@components/AppointmentView";
import ReceiptList from "@components/ReceiptList";
import CheckoutView from "@components/CheckoutView";
import PDFViewer from "@/components/PDFViewer";

export const ClientRoutes = [
  { path: "/", element: <ControlPanel /> },
  { path: "/perfil", element: <Profile /> },
  { path: "/agendar-cita", element: <AppointmentView /> },
  { path: "/recibos", element: <ReceiptList /> },
  { path: "/pago/:serviceId/:scheduleId", element: <CheckoutView /> },
  {
    path: "/prueba",
    element: (
      <PDFViewer url="https://res.cloudinary.com/dyqznwbdb/raw/upload/v1754109097/pdfs/qtdl3y4exwrsmkciufxp.pdf" />
    ),
  },
  ...SharedRoutes,
];
