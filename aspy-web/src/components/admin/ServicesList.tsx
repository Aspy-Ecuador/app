// FINAL
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import type { Service } from "@typesResponse/Service";
import { useRoleData } from "@/observer/RoleDataContext";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SimpleHeader from "@components/SimpleHeader";
import Table from "@components/Table";
import Progress from "@components/Progress";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function ServicesList() {
  const { data, loading } = useRoleData();
  const [selectedId, setSelectedId] = useState<GridRowId | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const services: Service[] = data?.services ?? [];

  const columns: GridColDef[] = [
    {
      field: "service_id",
      headerName: "ID",
      flex: 1,
      disableColumnMenu: true,
      resizable: false,
    },
    {
      field: "name",
      headerName: "Nombre",
      flex: 3,
      disableColumnMenu: true,
      resizable: false,
    },
    {
      field: "price",
      headerName: "Costo",
      flex: 2,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "#0F6E56",
            fontFamily: "monospace",
          }}
        >
          ${Number(params.value).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "acciones",
      headerName: "",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      resizable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() =>
            navigate(`${location.pathname}/${params.row.service_id}`)
          }
          sx={{
            width: 26,
            height: 26,
            border: "0.5px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
            borderRadius: 1.5,
            "&:hover": {
              borderColor: "#9FE1CB",
              color: "#0F6E56",
              bgcolor: "#E1F5EE",
            },
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 13 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Lista de servicios" chip="Servicios" />

      {/* Stats + botón */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Tarjeta total */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.75,
            py: 1.25,
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#EEEDFE",
              color: "#534AB7",
              "& svg": { fontSize: 16 },
            }}
          >
            <AssignmentTurnedInRoundedIcon fontSize="inherit" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "text.disabled",
                lineHeight: 1,
              }}
            >
              Total servicios
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
              {services.length}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "0.5px", height: 36, bgcolor: "divider", mx: 0.5 }} />

        {/* Botón agregar */}
        <Button
          onClick={() => navigate("/nuevo-servicio")}
          startIcon={<AddRoundedIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            bgcolor: "#E1F5EE",
            color: "#0F6E56",
            border: "0.5px solid #9FE1CB",
            borderRadius: 3,
            px: 1.75,
            py: 1.25,
            height: "auto",
            textTransform: "none",
            "&:hover": { bgcolor: "#9FE1CB" },
          }}
        >
          Agregar servicio
        </Button>
      </Box>

      {/* Tabla */}
      <Grid size={12}>
        {loading ? (
          <Progress />
        ) : services.length ? (
          <Table<Service>
            columns={columns}
            rows={services}
            getRowId={(row) => row.service_id}
            selectedId={selectedId}
            onRowSelect={setSelectedId}
          />
        ) : (
          <Typography
            sx={{
              fontSize: 13,
              color: "text.disabled",
              textAlign: "center",
              py: 4,
            }}
          >
            No hay servicios registrados
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
