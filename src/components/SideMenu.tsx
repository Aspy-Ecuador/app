import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import ColorModeToggle from "@shared-theme/ColorModeToggle";
import ThemedLogo from "@shared-theme/ThemedLogo";
import {
  getAuthenticatedUserName,
  getAuthenticatedUserEmail,
} from "@/utils/store";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      {/*
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemedLogo></ThemedLogo>
      </Box>
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {<MenuContent />}
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {getAuthenticatedUserName()}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {getAuthenticatedUserEmail()}
          </Typography>
        </Box>

        <OptionsMenu />
        <ColorModeToggle />
      </Stack>
    </Drawer>
  );
}
