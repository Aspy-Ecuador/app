// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        pb: 1.5,
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <IconButton
        size="small"
        onClick={() => navigate(-1)}
        sx={{
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 1.5,
        }}
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Typography variant="h3">{textHeader}</Typography>

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
