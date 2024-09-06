import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignIn() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Button
              onClick={() => loginWithRedirect()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
