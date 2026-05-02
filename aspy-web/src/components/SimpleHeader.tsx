// FINAL
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
interface SimpleHeaderProps {
  text: string;
  chip: string;
}

export default function SimpleHeader({ text, chip }: SimpleHeaderProps) {
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
        size="large"
        onClick={() => navigate(-1)}
        sx={{
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 1.5,
        }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>
      <Typography variant="h3">{text}</Typography>
      <Chip
        label={chip}
        size="medium"
        sx={{
          ml: "auto",
          bgcolor: "#FAEEDA",
          color: "#854F0B",
          "& .MuiChip-label": { px: 1.25 },
        }}
      />
    </Box>
  );
}
