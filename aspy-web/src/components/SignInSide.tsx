import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import AppTheme from "@shared-theme/AppTheme";
import SignInCard from "@components/SignInCard";
import Content from "@components/Content";

import fondoAspy from "../assets/fondoAspy.webp";

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Stack
        direction="column"
        component="main"
        sx={[
          {
            position: "relative",
            justifyContent: "center",
            minHeight: "100vh",
            overflow: "hidden",
          },
          (theme) => ({
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              zIndex: 0,

              backgroundImage: `url(${fondoAspy})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",

              ...theme.applyStyles("dark", {
                backgroundImage: `
                  linear-gradient(
                    rgba(0, 0, 0, 0.6),
                    rgba(0, 0, 0, 0.6)
                  ),
                  url(${fondoAspy})
                `,
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            position: "relative",
            zIndex: 1,
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: "auto",
          }}
        >
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            sx={{
              justifyContent: "center",
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: "auto",
            }}
          >
            <Content />
            <SignInCard />
          </Stack>
        </Stack>
      </Stack>
    </AppTheme>
  );
}