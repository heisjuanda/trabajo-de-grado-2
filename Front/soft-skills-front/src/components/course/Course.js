import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import Stack from "@mui/material/Stack";
import { MdOutlinePlayArrow, MdInfo, MdOutlineAssignment } from "react-icons/md";
import Comments from "../comments/Comments";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  CircularProgress, 
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    background: {
      default: "#f5f7fa",
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: 12,
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
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default function Course() {
  const { id } = useParams();
  const courseId = id;
  const [course, setCourse] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");

  const getActivityIcon = (type) => {
    if (type === "comp") return <MdOutlinePlayArrow style={{ color: "#3f51b5", fontSize: 24 }} />;
    return <MdOutlineAssignment style={{ color: "#f50057", fontSize: 24 }} />;
  };

  const getCourseImage = (courseId) => {
    const courseImages = {
      "253": dashDebateIA,
      "270": dashOratorIA,
    };
    return courseImages[courseId] || juanDabot;
  };

  const getCourseVideo = (courseId) => {
    const courseVideos = {
      "253": "https://www.youtube.com/watch?v=i-htv81L04g",
      "270": "https://www.youtube.com/watch?v=Xp45ayoX_4s&t=126s",
    };
    return courseVideos[courseId] || "https://www.youtube.com/watch?v=i-htv81L04g";
  };

  useEffect(() => {
    setLoading(true);
    
    const fetchCourseData = axios.get(`${process.env.REACT_APP_API_HOST}/courses/${courseId}`);
    const fetchActivities = axios.get(`${process.env.REACT_APP_API_HOST}/activity/course/${courseId}`);
    
    Promise.all([fetchCourseData, fetchActivities])
      .then(([courseResponse, activitiesResponse]) => {
        setCourse(courseResponse.data);
        setActivities(activitiesResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default' 
        }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!course) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h5" color="error">No se pudo cargar el curso</Typography>
          <Button component={Link} to="/dashboard" variant="contained" color="primary">
            Volver al Dashboard
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <ResponsiveAppBar />
        
        <Box sx={{ pt: 3, px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
          {/* Header con imagen de fondo */}
          <Paper 
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '250px',
              backgroundImage: `url(${getCourseImage(courseId)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
              }
            }}
          >
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              p: 4, 
              zIndex: 2,
              width: '100%'
            }}>
              <Chip 
                label={courseId === "270" ? "Oratoria" : "Pensamiento Crítico"}
                color="primary" 
                sx={{ mb: 2, fontWeight: 'bold' }} 
              />
              <Typography variant="h2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                {course.title}
              </Typography>
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* Columna principal */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Acerca de este curso
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description || 
                    (courseId === "253" 
                      ? "Desarrolla habilidades de comunicación verbal y no verbal. Aprende a hablar en público con confianza y claridad en diferentes contextos profesionales."
                      : "Fortalece tu capacidad de análisis, evaluación y resolución de problemas complejos mediante el uso de la lógica y el razonamiento.")}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                    <Chip icon={<MdInfo />} label="Nivel: Intermedio" />
                    <Chip icon={<MdInfo />} label={`ID: ${course.id}`} />
                    <Chip icon={<MdInfo />} label={activities.length + " actividades"} />
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant={activeTab === "activities" ? "contained" : "text"}
                      onClick={() => setActiveTab("activities")}
                      sx={{ borderRadius: '8px' }}
                    >
                      Actividades
                    </Button>
                    <Button 
                      variant={activeTab === "discussion" ? "contained" : "text"}
                      onClick={() => setActiveTab("discussion")}
                      sx={{ borderRadius: '8px' }}
                    >
                      Discusión
                    </Button>
                  </Box>
                </Box>
                
                <CardContent>
                  {activeTab === "activities" ? (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Contenido del curso
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {activities.length > 0 ? (
                        <List sx={{ width: '100%' }}>
                          {activities.map((activity, index) => (
                            <React.Fragment key={activity.id}>
                              <ListItem
                                component={Paper}
                                sx={{ 
                                  mb: 2, 
                                  borderRadius: 2,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    bgcolor: 'rgba(63, 81, 181, 0.05)'
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  {getActivityIcon(activity.content_type)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {index + 1}. {activity.title}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="body2" color="text.secondary">
                                      {activity.content_type === "comp" ? "Componente interactivo" : "Actividad de aprendizaje"}
                                    </Typography>
                                  }
                                />
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  component={Link}
                                  to={activity.content_type === "comp" ? `${activity.path}` : `/activity/${activity.id}`}
                                  sx={{ ml: 2 }}
                                >
                                  Iniciar
                                </Button>
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                          No hay actividades disponibles para este curso
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Comments />
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Columna lateral */}
            <Grid item xs={12} md={4}>
              <Card sx={{ position: 'sticky', top: 24 }}>
                <Box
                  sx={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    title="Course Video"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    src={getCourseVideo(courseId)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
                
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {courseId === "270" ? "Oratoria Efectiva" : "Pensamiento Crítico"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {courseId === "253" ? "O" : "PC"}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Por: Juan David Moreno Alfonso -Universidad Del Valle
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                    component={Link}
                    to={activities.length > 0 ? (activities[0].content_type === "comp" ? `${activities[0].path}` : `/activity/${activities[0].id}`) : "#"}
                    disabled={activities.length === 0}
                  >
                    Comenzar curso
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    component={Link}
                    to="/dashboard"
                  >
                    Volver al Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
