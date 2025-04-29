import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";

import Nav from "../../components/Nav/Nav";
import Report from "../../components/Report/Report";
import GenericLoader from "../../components/Loader/Generic";
import PerformanceMetrics from "../../components/PerformanceMetrics/PerformanceMetrics";
import ReportDetail from "../../components/DebateReport/ReportDetail";
import JuanDabot from "../../../oratoria/components/JuanDabot/JuanDabot";

import "./DebateReport.css";
import Button from "../../components/Button/Button";

const DebateReport = () => {
  const reportsPerPage = 4;

  const [isLoading, setIsLoading] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReportID, setSelectedReportID] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [sortOrder, setSortOrder] = useState("date-desc");

  const { user } = useAuth0();

  const notifyError = () =>
    toast.error("Error al cargar los reportes", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyLoading = () =>
    toast.info("Cargando reportes", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifySUccess = () =>
    toast.success("Reportes cargados!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const sortReports = (reports, order) => {
    const sortedReports = [...reports]; 
    
    switch (order) {
      case "date-desc":
        return sortedReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-asc":
        return sortedReports.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "rating-desc":
        return sortedReports.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "rating-asc":
        return sortedReports.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      default:
        return sortedReports;
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setFilteredReports(sortReports(userReports, newSortOrder));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (userReports.length > 0) {
      setFilteredReports(sortReports(userReports, sortOrder));
    }
  }, [sortOrder, userReports]);

  useEffect(() => {
    const getUserReports = () => {
      if (!user) return;

      setIsLoading(true);
      notifyLoading();
      axios
        .get(
          `${process.env.REACT_APP_API_HOST}/debate-topics/reports/${user.email}`
        )
        .then((response) => {
          const reports = response.data;
          setUserReports(reports);
          notifySUccess();
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error("Error al obtener los reportes:", error);
          notifyError();
          setUserReports([]);
          setFilteredReports([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getUserReports();
  }, [user]);

  useEffect(() => {
    for (let index = 0; index < userReports.length; index++) {
      if (userReports[index].id === selectedReportID) {
        setReportDetails(userReports[index]);
        break;
      }
    }
  }, [selectedReportID, userReports]);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports?.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const toggleMetrics = () => {
    setShowMetrics(!showMetrics);
    if (!showMetrics) {
      setSelectedReportID(null);
      setReportDetails(null);
    }
  };

  return (
    <section className="debate-reports__section">
      <Nav />
      <header className="reports-header">
        <h1>Reportes Recientes</h1>
        <Button
          onclick={toggleMetrics}
          typeStyle="main"
          content={showMetrics ? 'Ver Reportes' : 'Ver Métricas'}
          disabled={userReports.length > 0}
        />
      </header>
      
      {isLoading ? (
        <GenericLoader />
      ) : showMetrics ? (
        <PerformanceMetrics reports={userReports} />
      ) : (
        <div className="reports-main-container">
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
          
          <div className="reports-container">
            {currentReports.map((report, key) => (
              <Report
                key={`${key}-${user.email}`}
                id={report.id}
                date={report.created_at}
                userName={user.given_name}
                userPicture={user.picture}
                setSelectedReportID={setSelectedReportID}
                rating={report.rating}
              />
            ))}
            {currentReports.length === 0 && <h2>No hay reportes</h2>}
            {filteredReports?.length > reportsPerPage && (
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
          </div>
        </div>
      )}
      
      {selectedReportID && !showMetrics && (
        <div className="selected-report__container">
          <header>
            <h3>Report Details #{selectedReportID}</h3>
          </header>
          {reportDetails && <ReportDetail report={reportDetails} />}
        </div>
      )}
      <ToastContainer />
      <JuanDabot />
    </section>
  );
};

export default DebateReport;
