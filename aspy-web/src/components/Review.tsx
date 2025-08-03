import { useRoleData } from "@/observer/RoleDataContext";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface ReviewProps {
  service_id: number;
}

export default function Review({ service_id }: ReviewProps) {
  const { data, loading } = useRoleData();
  const [service, setService] = useState<ServiceResponse>();

  useEffect(() => {
    if (!loading && data.services) {
      const found = data.services.find(
        (s: ServiceResponse) => s.service_id === service_id
      );
      setService(found);
    }
  }, [loading, data.services, service_id]);

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={service?.name} />
          <Typography variant="subtitle1">${service?.price}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${service?.price}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        {/*
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Cliente
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
        </div>
        */}
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Detalles de Pago
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Transferencia bancaria
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
