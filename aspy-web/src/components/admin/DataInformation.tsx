// FINAL
import type { CardAdmin } from "@/types/CardAdmin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface DataInformationProps {
  buttonsData: CardAdmin[];
}

const iconColors: Record<number, { bg: string; color: string }> = {
  0: { bg: "#E6F1FB", color: "#185FA5" },
  1: { bg: "#E1F5EE", color: "#0F6E56" },
  2: { bg: "#EEEDFE", color: "#534AB7" },
};

export default function DataInformation({ buttonsData }: DataInformationProps) {
  return (
    <>
      {buttonsData.map((btn, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 1.75,
            py: 1.25,
            background: "background.paper",
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 3,
            minWidth: 140,
          }}
        >
          {/* Icono */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: iconColors[index]?.bg ?? "action.hover",
              color: iconColors[index]?.color ?? "text.secondary",
              "& svg": { fontSize: 16 },
            }}
          >
            {btn.icon}
          </Box>

          {/* Texto */}
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "text.disabled",
                lineHeight: 1,
              }}
            >
              {btn.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 500,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {btn.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
