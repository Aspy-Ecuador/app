// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { tone } from "@shared-theme/themePrimitives";
import VisorArchivo from "@components/VisorArchivo";

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.disabled",
          }}
        >
          Documento adjunto
        </Typography>
      </Box>
      <Box sx={{ p: 1.25 }}>
        {url ? (
          <Box sx={{ height: 420, borderRadius: 2, overflow: "hidden" }}>
            <VisorArchivo archivo={url} titulo="Comprobante de pago" />
          </Box>
        ) : (
          <Box
            sx={{
              height: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              bgcolor: "action.hover",
              borderRadius: 2,
              border: "0.5px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: tone.red.bg,
                color: tone.red.fg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertDriveFileRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              Sin documento adjunto
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
