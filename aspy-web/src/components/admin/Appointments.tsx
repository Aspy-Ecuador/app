import { useEffect, useState } from "react";
import { getAppointmentByProfessional } from "@utils/utils";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Agenda from "@components/Agenda";
import SelectProfessional from "@components/SelectProfessional";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import apiURL from "@/API/apiConfig";

export default function Appointments() {
  const [selectedId, setSelected] = useState<number>(0);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const handleSelectProfessional = (id: number) => {
    setSelected(id);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log("Tenemos:", appointments.length);
      const token = localStorage.getItem("token");
      try {
        const responseAppointments = await axios.get(`${apiURL}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointments: AppointmentResponse[] =
          getAppointmentByProfessional(selectedId, responseAppointments.data);
        console.log(appointments);
        setAppointments(appointments);
      } catch (error) {
        console.error("Error loading appointments", error);
      }
      console.log("Tenemos:", appointments.length);
    };

    fetchAppointments();
  }, [selectedId]);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text={"Citas"} />
        </Grid>
        <Grid size={9}>
          {appointments.length === 0 ? (
            <Progress />
          ) : (
            <Agenda appointments={appointments} />
          )}
        </Grid>
        <Grid size={3}>
          <SelectProfessional onSelect={handleSelectProfessional} />
        </Grid>
      </Grid>
    </Box>
  );
}
