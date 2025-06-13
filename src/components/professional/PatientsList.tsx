import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { User } from "@/types/User";
import { pacientes } from "@data/Pacientes";
import { columnsUsers } from "@utils/columns";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import OverviewPersona from "@professional/OverviewPersona";
import Table from "@components/Table";

export default function PatientsList() {
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);
  const [user, setUser] = useState<User | null>(null);

  const theme = useTheme();
  const themeClass =
    theme.palette.mode === "dark" ? "dark-theme" : "light-theme";

  useEffect(() => {
    if (rowSelection.length > 0) {
      const selectedUser = pacientes.find(
        (item) => item.id === rowSelection[0]
      );
      if (selectedUser) {
        setUser(selectedUser);
      }
    } else {
      setUser(null);
    }
  }, [rowSelection]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMoreInfo = () => {
    if (user) {
      const newPath = `${location.pathname}/${user.id}`;
      navigate(newPath);
    }
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9} marginBottom={"4px"}>
              <Typography variant="h3">Pacientes</Typography>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={8} className={themeClass + " grid-tabla"}>
          <Table<User>
            columns={columnsUsers}
            rows={pacientes}
            rowSelectionModel={rowSelection}
            onRowSelectionChange={(newSelection) =>
              setRowSelection(newSelection)
            }
          />
        </Grid>
        {user && (
          <Grid size={4} className={themeClass}>
            <OverviewPersona
              key={user.id}
              selectedData={user}
              moreInfo={handleMoreInfo}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
