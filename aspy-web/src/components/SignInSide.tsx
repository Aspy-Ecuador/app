import Stack from "@mui/material/Stack";
import AuthShell from "@components/auth/AuthShell";
import SignInCard from "@components/SignInCard";
import Content from "@components/Content";

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  return (
    <AuthShell {...props}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{ alignItems: "center", justifyContent: "center", gap: { md: 8, lg: 12 }, width: "100%" }}
      >
        <Content />
        <SignInCard />
      </Stack>
    </AuthShell>
  );
}
