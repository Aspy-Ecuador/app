import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { Payment } from "@/types/Payment";
import { GridColDef } from "@mui/x-data-grid";
import { columnsPayment } from "@utils/columns";
import { paymentList } from "@data/Pagos";
import Button from "@mui/material/Button";
import Table from "@components/Table";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

export default function PaymentsList() {
  const rowSelection: GridRowSelectionModel = [];

  const theme = useTheme().palette.mode;
  const themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  //Ruta para aprobar
  const navigate = useNavigate();
  const location = useLocation();
  const handleApprove = (id: number) => {
    const newPath = `${location.pathname}/${id}`;
    navigate(newPath);
  };

  const columnasExtra: GridColDef[] = [
    {
      field: "total_amount",
      headerName: "Total",
      disableColumnMenu: true,
      flex: 1,
      resizable: false,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        return <Typography variant="body1">$ {params.value}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Verificar",
      flex: 2,
      disableColumnMenu: true,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          onClick={() => handleApprove(params.row.id)}
          variant="text"
          color="primary"
          className="boton-editar"
        >
          <VisibilityRoundedIcon />
        </Button>
      ),
    },
    {
      field: "status",
      headerName: "Estado de aprobación",
      disableColumnMenu: true,
      flex: 2,
      resizable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <CheckCircleRoundedIcon color="success" />
        ) : (
          <AccessTimeFilledRoundedIcon color="warning" />
        ),
    },
  ];

  const newColumns: GridColDef[] = [...columnsPayment, ...columnasExtra];

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Pagos"} />
        </Grid>
        <Grid size={12} className={themeClass + " grid-tabla"}>
          <Table<Payment>
            columns={newColumns}
            rows={paymentList}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
