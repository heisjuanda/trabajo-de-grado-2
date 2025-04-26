import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Nav from "../../components/Nav/Nav";
import Section from "../../components/Section/Section";
import Button from "../../../pensamientoCritico/components/Button/Button";
import Loader from "../../../pensamientoCritico/components/Loader/Loader";

import "./OratoryReport.css";

const OratoryReport = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
  };

  const notifyInfo = (message) => {
    toast.info(message);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      notifyError("Debes iniciar sesión para ver tu historial.");
      return;
    }

    const fetchReport = async () => {
      if (!user || !user.email) return;

      setLoading(true);
      notifyInfo("Cargando grabaciones...");
      setError(null);

      try {
        const url = `${
          process.env.REACT_APP_API_HOST
        }/oratory-audio/list?user_email=${encodeURIComponent(
          user.email
        )}&skip=0&limit=100`;

        const response = await axios.get(url);

        setRecordings(response.data || []);
        notifySuccess("Grabaciones cargadas correctamente");
      } catch (error) {
        console.error("Error al obtener el reporte de oratoria:", error);
        setError(error.message || "Error al obtener las grabaciones");
        notifyError(error.message || "Error al obtener las grabaciones");

        if (error.response) {
          notifyError(error.response.data);
          notifyError(error.response.status);
          notifyError(error.response.headers);
        } else if (error.request) {
          notifyError(error.request);
        } else {
          notifyError(error.message);
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
          <Loader />
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
                      <p className="recording-duration">
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
                typeStyle="secondary"
                disabled={!loading}
              />
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default OratoryReport;
