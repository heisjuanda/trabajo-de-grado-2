import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import ProfileInDashboard from "../profileindashboard/ProfileInDashboard";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Album() {
  const [courses, setCourses] = useState([]);
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    // Hacer una solicitud a tu API para obtener la lista de cursos
    axios
      .get(`${process.env.REACT_APP_API_HOST}/courses`)
      .then((response) => {
        setCourses(response.data); // Actualiza el estado con los datos de los cursos
      })
      .catch((error) => {
        console.error("Error al obtener los cursos:", error);
      });
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        <ResponsiveAppBar />
        <ProfileInDashboard />
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image={
                      course.image ||
                      "https://source.unsplash.com/random?wallpapers"
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {course.title}
                    </Typography>
                    <Typography>{course.id}</Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={`/courses/${course.id}`}>
                      <Button size="small">Ver más</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
