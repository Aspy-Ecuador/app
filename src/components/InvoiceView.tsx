import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

interface InvoiceViewProps {
  id: number;
  date: string;
  client: string;
  service: string;
  address: string;
  price: number;
  discount: number;
  total: number;
  paymentMethod: string;
  contactEmail: string;
  contactPhone: string;
}

export default function InvoiceView({
  id,
  date,
  client,
  service,
  address,
  price,
  discount,
  total,
  paymentMethod,
  contactEmail,
  contactPhone,
}: InvoiceViewProps) {
  return (
    <Box
      maxWidth={500}
      mx="auto"
      p={3}
      bgcolor="#fff"
      borderRadius={1}
      border={1}
      borderColor="#000000"
    >
      <Typography variant="h6" fontWeight="bold">
        Invoice
      </Typography>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        #{id}
      </Typography>

      <Typography fontWeight="bold">Issue Date:</Typography>
      <Typography gutterBottom>{date}</Typography>

      <Typography fontWeight="bold">Client Name:</Typography>
      <Typography gutterBottom>{client}</Typography>

      <Typography fontWeight="bold">Address:</Typography>
      <Typography gutterBottom>{address}</Typography>

      <Box mt={4}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={2}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Service
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{service}</TableCell>
                <TableCell align="right">${price.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ marginTop: "2%" }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell align="right">${price.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Descuento</TableCell>
                <TableCell align="right">${discount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Grid container mt={4} spacing={2}>
        <Grid size={6}>
          <Typography fontWeight="bold">Payment Method:</Typography>
          <Typography>{paymentMethod}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography fontWeight="bold">Contact Info:</Typography>
          <Typography>{contactEmail || "N/A"}</Typography>
          <Typography>{contactPhone || "N/A"}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
