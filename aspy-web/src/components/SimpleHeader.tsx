// FINAL
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { tone } from "@shared-theme/themePrimitives";
interface SimpleHeaderProps {
  text: string;
  chip: string;
}

export default function SimpleHeader({ text, chip }: SimpleHeaderProps) {
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

      <Typography variant="h2"sx={{
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
    }}>{text}</Typography>


      <Chip
        label={chip}
        size="medium"
         sx={{
      ml: "auto",
      bgcolor: tone.amber.bg,
      color: tone.amber.fg,

      maxWidth: {
        xs: 110,
        sm: 180,
      },

      "& .MuiChip-label": {
        px: 1.25,
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    }}
      />
    </Box>
  );
}
