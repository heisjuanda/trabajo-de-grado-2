import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function SignUp() {
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [messageColor, setMessageColor] = React.useState(""); // Añade un estado para el color del mensaje

  const validate = () => {
    const newErrors = {};

    if (!fullname) newErrors.fullname = "El nombre completo es requerido.";
    if (!email) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      newErrors.email = "El correo electrónico debe ser válido.";
    }
    if (!password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[a-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password =
        "La contraseña debe contener al menos una letra y un número.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const response = await fetch(`${process.env.REACT_APP_API_HOST}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: fullname,
      }),
    });

    if (response.ok) {
      setMessage("Usuario registrado con éxito");
      setMessageColor("green"); // Cambia el color del mensaje a verde
      setEmail("");
      setPassword("");
      setFullname("");
    } else {
      setMessage("Error al registrar el usuario");
      setMessageColor("red"); // Cambia el color del mensaje a rojo
    }
  };

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
          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
          <br />
          <Typography
            component="h2"
            variant="h6"
            style={{ color: messageColor, fontWeight: "bold" }}
          >
            {message}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fullname"
                  name="fullname"
                  required
                  fullWidth
                  id="fullname"
                  label="Nombre completo"
                  autoFocus
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  error={!!errors.fullname}
                  helperText={errors.fullname}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin" variant="body2">
                  {"¿Ya tienes una cuenta? Inicia sesión"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
