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
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import ProfileInDashboard from "../profileindashboard/ProfileInDashboard";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import dashDebateIA from "../../resources/icons/dashDebateIA.png"
import dashOratorIA from "../../resources/icons/dashOratorIA.png"
import juanDabot from "../../resources/icons/juandabot.png"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const getCourseImage = (courseId) => {
  const courseImages = {
    "253": dashDebateIA, 
    "270": dashOratorIA,
  };
  return courseImages[courseId] || juanDabot; 
};

const getCourseTitle = (courseId, originalTitle) => {
  if (originalTitle && originalTitle.trim() !== "") return originalTitle;
  
  const courseTitles = {
    "253": "Oratoria Efectiva",
    "270": "Pensamiento Crítico",
  };
  return courseTitles[courseId] || "Curso de Habilidades Blandas";
};

const getCourseDescription = (courseId) => {
  const courseDescriptions = {
    "253": "Desarrolla habilidades de comunicación verbal y no verbal. Aprende a hablar en público con confianza y claridad en diferentes contextos profesionales.",
    "270": "Fortalece tu capacidad de análisis, evaluación y resolución de problemas complejos mediante el uso de la lógica y el razonamiento.",
  };
  return courseDescriptions[courseId] || "Mejora tus habilidades blandas con este curso especializado.";
};

export default function Album() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuth0();

  const allowedCourseIds = ["253", "270"];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/courses`)
      .then((response) => {
        const filteredCourses = response.data.filter(course => 
          allowedCourseIds.includes(course.id.toString())
        );
        setCourses(filteredCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los cursos:", error);
        setLoading(false);
      });
  }, []);

  if (isLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <ResponsiveAppBar />
        <ProfileInDashboard />
        
        <Box sx={{ bgcolor: '#f5f7fa', py: 6 }}>
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="primary"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Mis Cursos de Habilidades Blandas
            </Typography>
            
            <Grid container spacing={4}>
              {courses.map((course) => (
                <Grid item key={course.id} xs={12} sm={6} md={6}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        pt: "56.25%",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background: "rgba(0,0,0,0.2)",
                        },
                      }}
                      image={course.image || getCourseImage(course.id)}
                    />
                    <CardContent sx={{ flexGrow: 1, py: 3 }}>
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h2"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {getCourseTitle(course.id, course.title)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Curso ID: {course.id}
                      </Typography>
                      <Typography variant="body1">
                        {course.description || getCourseDescription(course.id)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="medium"
                        >
                          Ver más
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}
