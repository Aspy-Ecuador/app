// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface HeaderProps {
  textHeader: string;
  isCreate: boolean;
  textIcon?: string;
  handle: () => void;
}

export default function Header({
  textHeader,
  isCreate,
  textIcon,
  handle,
}: HeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1,
        pb: 1.5,
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: {
            xs: "1.05rem",
            sm: "1.5rem",
            md: "2rem",
          },
          maxWidth: {
            xs: "45%",
            sm: "60%",
            md: "70%",
          },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          px: 1,
        }}
      >
        {textHeader}
      </Typography>

      <Box sx={{ ml: "auto" }}>
        {isCreate ? (
          <Button
            onClick={handle}
            size="large"
            startIcon={<AddRoundedIcon />}
            sx={{
              bgcolor: "#E1F5EE",
              color: "#0F6E56",
              border: "0.5px solid #9FE1CB",
              borderRadius: 1.5,
              px: 1.5,
              height: 26,
              "&:hover": { bgcolor: "#9FE1CB" },
            }}
          >
            {textIcon}
          </Button>
        ) : (
          <Button
            onClick={handle}
            size="large"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              bgcolor: "action.hover",
              color: "text.secondary",
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              px: 1.5,
              height: 26,
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            Volver
          </Button>
        )}
      </Box>
    </Box>
  );
}