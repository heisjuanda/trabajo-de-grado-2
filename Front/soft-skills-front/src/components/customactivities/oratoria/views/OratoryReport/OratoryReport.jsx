import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Nav from "../../components/Nav/Nav";
import Section from "../../components/Section/Section";
import Button from "../../../pensamientoCritico/components/Button/Button";

import "./OratoryReport.css";

const OratoryReport = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    if (!authLoading && !isAuthenticated) {
      //   navigate("/signin");
      return;
    }

    const fetchReport = async () => {
      if (!user || !user.email) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Obteniendo grabaciones para:", user.email);

        // Construye la URL con los parámetros de consulta manualmente para asegurar que
        // se codifican correctamente
        const url = `${
          process.env.REACT_APP_API_HOST
        }/oratory-audio/list?user_email=${encodeURIComponent(
          user.email
        )}&skip=0&limit=100`;

        console.log("URL de la petición:", url);

        const response = await axios.get(url);

        console.log("Respuesta completa:", response);
        setRecordings(response.data || []);
      } catch (error) {
        console.error("Error al obtener el reporte de oratoria:", error);
        setError(error.message || "Error al obtener las grabaciones");

        // Información detallada para depuración
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error("Datos de respuesta:", error.response.data);
          console.error("Estado HTTP:", error.response.status);
          console.error("Cabeceras:", error.response.headers);
        } else if (error.request) {
          // La petición fue realizada pero no se recibió respuesta
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          // Algo ocurrió al preparar la petición
          console.error("Error de configuración:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchReport();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  // Función para parsear el JSON del feedback
  const parseFeedback = (feedbackJson) => {
    try {
      return JSON.parse(feedbackJson);
    } catch (error) {
      console.error("Error al parsear el feedback:", error);
      return null;
    }
  };

  return (
    <section className="oratory-report-container">
      <Nav />
      <header>
        <h1>Historial de Grabaciones de Oratoria</h1>
      </header>
      <div className="oratory-report-container">
        {authLoading || loading ? (
          <p>Cargando grabaciones...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button
              className="back-button"
              onClick={() => navigate("/activity/oratoria")}
            >
              Volver a Oratoria
            </button>
          </div>
        ) : !isAuthenticated ? (
          <p>Debes iniciar sesión para ver tu historial.</p>
        ) : recordings.length === 0 ? (
          <div>
            <p>No se encontraron grabaciones.</p>
            <Button
              className="recording-item button"
              onclick={() => navigate("/activity/oratoria")}
              content="Volver a Oratoria"
              typeStyle="main"
            />
          </div>
        ) : (
          <>
            <div className="recordings-list">
              {recordings.map((recording) => {
                const feedback = parseFeedback(recording.feedback);

                return (
                  <div key={recording.id} className="recording-item">
                    <h6>
                      Grabación del{" "}
                      {new Date(recording.created_at).toLocaleString()}
                    </h6>

                    <div className="recording-details">
                      <p>
                        <strong>Calificación:</strong> {recording.calification}
                        /10
                      </p>
                      <p>
                        <strong>Duración:</strong>{" "}
                        {Math.floor(recording.duration_ms / 1000)} segundos
                      </p>
                    </div>

                    {feedback && (
                      <div className="recording-feedback">
                        <details>
                          <summary>Ver transcripción</summary>
                          <p className="transcript">
                            {feedback.transcripcion_whisper ||
                              feedback.transcripcion}
                          </p>
                        </details>

                        {feedback.resumen && (
                          <div className="feedback-section">
                            <details>
                              <summary>Ver análisis detallado</summary>
                              <div className="feedback-content">
                                <Section
                                  title="Resumen"
                                  content={feedback.resumen}
                                />

                                {feedback.sentimiento && (
                                  <Section
                                    title="Sentimiento"
                                    content={feedback.sentimiento}
                                  />
                                )}

                                {feedback.temas_clave && (
                                  <Section
                                    title="Temas clave"
                                    content={feedback.temas_clave}
                                  />
                                )}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      onclick={() =>
                        window.open(
                          `${process.env.REACT_APP_API_HOST}/oratory-audio/blob/${recording.id}`,
                          "_blank"
                        )
                      }
                      content="Escuchar grabación"
                      typeStyle="main"
                      disabled={!recording.audio_url}
                    />
                  </div>
                );
              })}
            </div>

            <div className="navigation-buttons">
              <Button
                className="back-button"
                onclick={() => navigate("/activity/oratoria")}
                content="Volver a Oratoria"
                typeStyle="main"
                disabled={!loading}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OratoryReport;
