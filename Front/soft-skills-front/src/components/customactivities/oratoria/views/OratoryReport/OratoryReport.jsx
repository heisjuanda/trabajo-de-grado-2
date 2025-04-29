import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Nav from "../../components/Nav/Nav";
import Section from "../../components/Section/Section";
import Button from "../../../pensamientoCritico/components/Button/Button";
import Loader from "../../../pensamientoCritico/components/Loader/Loader";
import PerformanceMetrics from "../../../pensamientoCritico/components/PerformanceMetrics/PerformanceMetrics";
import JuanDabot from "../../components/JuanDabot/JuanDabot";

import "./OratoryReport.css";

const OratoryReport = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [recordings, setRecordings] = useState([]);
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordingsPerPage] = useState(3);
  const [showMetrics, setShowMetrics] = useState(false);
  const [sortOrder, setSortOrder] = useState("date-desc");

  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
  };

  const notifyInfo = (message) => {
    toast.info(message);
  };

  const sortRecordings = (recs, order) => {
    const sortedRecordings = [...recs]; 
    
    switch (order) {
      case "date-desc":
        return sortedRecordings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-asc":
        return sortedRecordings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "rating-desc":
        return sortedRecordings.sort((a, b) => (b.calification || 0) - (a.calification || 0));
      case "rating-asc":
        return sortedRecordings.sort((a, b) => (a.calification || 0) - (b.calification || 0));
      default:
        return sortedRecordings;
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setFilteredRecordings(sortRecordings(recordings, newSortOrder));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (recordings.length > 0) {
      setFilteredRecordings(sortRecordings(recordings, sortOrder));
    }
  }, [sortOrder, recordings]);

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
        const recordingsData = response.data || [];

        setRecordings(recordingsData);
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

  const parseFeedback = (feedbackJson) => {
    try {
      return JSON.parse(feedbackJson);
    } catch (error) {
      console.error("Error al parsear el feedback:", error);
      return null;
    }
  };

  const indexOfLastRecording = currentPage * recordingsPerPage;
  const indexOfFirstRecording = indexOfLastRecording - recordingsPerPage;
  const currentRecordings = filteredRecordings.slice(indexOfFirstRecording, indexOfLastRecording);
  const totalPages = Math.ceil(filteredRecordings.length / recordingsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  const metricsData = recordings.map(recording => ({
    rating: recording.calification,
    created_at: recording.created_at
  }));

  return (
    <section className="oratory-report-container">
      <Nav />
      <header className="reports-header">
        <h1>Historial de Grabaciones de Oratoria</h1>
        {recordings.length > 0 && (
          <Button
            onclick={toggleMetrics}
            content={showMetrics ? 'Ver Grabaciones' : 'Ver Métricas'}
            typeStyle="main"
            disabled={recordings.length > 0}
          />
        )}
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
        ) : showMetrics ? (
          <PerformanceMetrics reports={metricsData} />
        ) : (
          <>
            <div className="reports-filters">
              <label htmlFor="sort-order">Ordenar por:</label>
              <select 
                id="sort-order" 
                value={sortOrder} 
                onChange={handleSortChange}
                className="filter-select"
              >
                <option value="date-desc">Fecha (más reciente primero)</option>
                <option value="date-asc">Fecha (más antiguo primero)</option>
                <option value="rating-desc">Calificación (mayor a menor)</option>
                <option value="rating-asc">Calificación (menor a mayor)</option>
              </select>
            </div>
            
            <div className="recordings-list">
              {currentRecordings.map((recording) => {
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

            {filteredRecordings.length > recordingsPerPage && (
              <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                  &#8592;
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  &#8594;
                </button>
              </div>
            )}

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
      <JuanDabot />
    </section>
  );
};

export default OratoryReport;
