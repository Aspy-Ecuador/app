import { useRoleData } from "@/observer/RoleDataContext";
import type { Service } from "@typesResponse/Service";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Progress from "@components/Progress";

interface ReviewProps {
  service_id: number;
}

export default function Review({ service_id }: ReviewProps) {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const service = data.services?.find(
    (s: Service) => s.service_id === service_id,
  );

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
