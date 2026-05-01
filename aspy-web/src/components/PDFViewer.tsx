// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

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
          <Box
            component="iframe"
            src={url}
            title="Comprobante de pago"
            sx={{
              width: "100%",
              height: 420,
              border: "none",
              borderRadius: 2,
              display: "block",
            }}
          />
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
                bgcolor: "#FCEBEB",
                color: "#A32D2D",
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
