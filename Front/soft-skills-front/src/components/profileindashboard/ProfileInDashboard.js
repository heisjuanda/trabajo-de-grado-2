import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileInDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    isAuthenticated && (
      <React.Fragment>
        <CssBaseline />
        <br />
        <Container maxWidth="md">
          <Box sx={{ bgcolor: "#e3f2fd", height: "auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid container>
                <Grid item xs={1}>
                  <Box sx={{ padding: "3px", alignItems: "center" }}>
                    <img
                      src={user.picture}
                      alt="Imagen de perfil"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ padding: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <b>{user.name}</b>
                      </div>
                      <div>Ver logros</div>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    Mi perfil
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Container>
      </React.Fragment>
    )
  );
}
