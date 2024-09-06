import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import DOMPurify from "dompurify";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useAuth0 } from "@auth0/auth0-react";

export default function Activity() {
  const { id } = useParams();
  const activityId = id;
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [activity, setActivity] = useState(null);
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/activity/${activityId}`)
        .then((response) => {
          setActivity(response.data);
        })
        .catch((error) => {
          console.error(
            "Error al obtener los detalles de la actividad:",
            error
          );
        });
    }
  }, [activityId, isAuthenticated]);

  if (isLoading || !activity) {
    return <div>Cargando...</div>;
  }

  var activityExample;
  if (activity != null && activity.example != null) {
    activityExample = DOMPurify.sanitize(activity.example);
  } else {
    activityExample = "";
  }

  const handleChange = (e, question) => {
    setAnswers({ ...answers, [question]: e.target.value });
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para enviar tus respuestas.");
      return;
    }
    var guardadasConExito = false;
    // Iterar sobre cada pregunta y enviar su respuesta al endpoint
    Object.entries(answers).forEach(([question, answerText]) => {
      if (answerText.trim() !== "") {
        const answerData = {
          user_email: user.email,
          activity_id: activityId,
          question_number: parseInt(question.replace("answer", "")),
          answer_text: answerText,
        };
        axios
          .post(`${process.env.REACT_APP_API_HOST}/answer`, answerData)
          .then((response) => {
            console.log(`Respuesta ${question} enviada:`, response.data);
            guardadasConExito = guardadasConExito && true;
          })
          .catch((error) => {
            console.error(`Error al enviar respuesta ${question}:`, error);
          });
      }
    });

    if (guardadasConExito) {
      alert("Respuestas guardadas con éxito.");
      navigate("/dashboard");
    } else {
      alert("Ya hay respuestas guardadas para esta actividad.");
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <br />
      <Grid
        container
        spacing={2}
        style={{ padding: "10vh", height: "90vh", paddingLeft: "200px" }}
      >
        <Grid item xs={12}>
          <Stack spacing={2}>
            <div>
              <Grid container spacing={4} style={{ padding: "5vh" }}>
                <Grid item xs={8}>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      {activity.title}
                    </h1>
                    {activity.objective && (
                      <>
                        <h3>Objetivo</h3>
                        {activity.objective}
                      </>
                    )}
                    {activity.metodology && (
                      <>
                        <h3>Metodología</h3>
                        {activity.metodology}
                      </>
                    )}
                    {activity.resources && (
                      <>
                        <h3>Recursos</h3>
                        {activity.resources}
                      </>
                    )}
                    {activity.introduction && (
                      <>
                        <h3>Introducción</h3>
                        {activity.introduction}
                      </>
                    )}
                    {activity.analisis && (
                      <>
                        <h3>Análisis de la situación</h3>
                        {activity.analisis}
                      </>
                    )}
                    {activity.evaluation && (
                      <>
                        <h3>Evaluación de escenarios</h3>
                        {activity.evaluation}
                      </>
                    )}
                  </div>
                </Grid>
                {activityExample && (
                  <div>
                    <h2>Actividad</h2>{" "}
                    <span className="max-w-prose text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                      <div
                        dangerouslySetInnerHTML={{ __html: activityExample }}
                      />
                    </span>
                  </div>
                )}
              </Grid>
              {activity.question1 && (
                <>
                  <h3>Preguntas</h3>
                  <ul>
                    {activity.question1 && (
                      <li
                        style={{
                          padding: "10px",
                        }}
                      >
                        {activity.question1} <br />
                        <TextField
                          id="answer1"
                          value={answers.answer1}
                          onChange={(e) => handleChange(e, "answer1")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question2 && (
                      <li>
                        {activity.question2} <br />
                        <TextField
                          id="answer2"
                          value={answers.answer2}
                          onChange={(e) => handleChange(e, "answer2")}
                          variant="outlined"
                          fullWidth
                        />{" "}
                      </li>
                    )}
                    {activity.question3 && (
                      <li>
                        {activity.question3} <br />
                        <TextField
                          id="answer3"
                          value={answers.answer3}
                          onChange={(e) => handleChange(e, "answer3")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question4 && (
                      <li>
                        {activity.question4} <br />
                        <TextField
                          id="answer4"
                          value={answers.answer4}
                          onChange={(e) => handleChange(e, "answer4")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question5 && (
                      <li>
                        {activity.question5} <br />
                        <TextField
                          id="answer5"
                          value={answers.answer5}
                          onChange={(e) => handleChange(e, "answer5")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                  </ul>
                </>
              )}
              <br />
              <br />
              {activity.question1 && (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                  >
                    Finalizar
                  </Button>
                </>
              )}
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Stack>
        </Grid>
      </Grid>
      <br />
      <br />
    </>
  );
}
