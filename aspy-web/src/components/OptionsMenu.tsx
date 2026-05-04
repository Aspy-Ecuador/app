import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useNavigate } from "react-router-dom";
import { logout } from "@store";

const menuItemSx = {
  borderRadius: 1.5,
  mx: 0.5,
  px: 1.25,
  py: 0.75,
  mb: 0.25,
  fontSize: 12,
  "& .MuiListItemText-primary": { fontSize: 12 },
  "& .MuiListItemIcon-root": { minWidth: 28, color: "text.secondary" },
  "&:hover": { bgcolor: "action.hover" },
};

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleClose = () => setAnchorEl(null);

  const actions = [
    {
      label: "Perfil",
      icon: <PersonOutlineRoundedIcon sx={{ fontSize: 15 }} />,
      action: () => navigate("/perfil"),
    },
    {
      label: "Sobre ASPY",
      icon: <InfoOutlinedIcon sx={{ fontSize: 15 }} />,
      action: () => navigate("/sobreAspy"),
    },
  ];

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 26,
          height: 26,
          borderRadius: "6px",
          border: "0.5px solid rgba(255,255,255,0.1)",
          bgcolor: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.4)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        <MoreVertRoundedIcon sx={{ fontSize: 14 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 2.5,
              minWidth: 160,
              p: 0.5,
              mt: -0.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {actions.map(({ label, icon, action }) => (
          <MenuItem key={label} onClick={action} sx={menuItemSx}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}

        <MenuItem
          onClick={() => {
            logout();
            navigate("/login");
          }}
          sx={{
            ...menuItemSx,
            color: "#A32D2D",
            "& .MuiListItemIcon-root": { minWidth: 28, color: "#A32D2D" },
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon sx={{ fontSize: 15 }} />
          </ListItemIcon>
          <ListItemText>
            <Typography sx={{ fontSize: 12, color: "#A32D2D" }}>
              Cerrar sesión
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
