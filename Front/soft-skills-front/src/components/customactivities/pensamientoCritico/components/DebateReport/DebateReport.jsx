import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer, toast } from "react-toastify";

import Nav from "../Nav/Nav";
import Report from "../Report/Report";
import GenericLoader from "../Loader/Generic";

import ReportDetail from "../../views/DebateReport/ReportDetail";

import "./DebateReport.css";

const DebateReport = () => {
  const reportsPerPage = 4;

  const [isLoading, setIsLoading] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReportID, setSelectedReportID] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

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
          setUserReports(response.data);
          notifySUccess();
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error("Error al obtener los reportes:", error);
          notifyError();
          setUserReports([]);
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
  }, [selectedReportID]);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = userReports?.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(userReports.length / reportsPerPage);

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

  return (
    <section className="debate-reports__section">
      <Nav />
      <header>
        <h1>Reportes Recientes</h1>
      </header>
      {isLoading ? (
        <GenericLoader />
      ) : (
        <div className="reports-container">
          {currentReports.map((report, key) => (
            <Report
              key={`${key}-${user.email}`}
              id={report.id}
              date={report.created_at}
              userName={user.given_name}
              userPicture={user.picture}
              setSelectedReportID={setSelectedReportID}
            />
          ))}
          {currentReports.length === 0 && <h2>No hay reportes</h2>}
          {userReports?.length > reportsPerPage && (
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
      )}
      {selectedReportID && (
        <div className="selected-report__container">
          <header>
            <h3>Report Details #{selectedReportID}</h3>
          </header>
          {reportDetails && <ReportDetail report={reportDetails} />}
        </div>
      )}
      <ToastContainer />
    </section>
  );
};

export default DebateReport;
