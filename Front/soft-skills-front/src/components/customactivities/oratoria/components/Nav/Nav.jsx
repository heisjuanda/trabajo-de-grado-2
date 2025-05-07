import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import "./Nav.css";

const Nav = () => {
  const history = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history("/dashboard");
    }
  }, [isAuthenticated, isLoading, history]);

  const goToDashboard = () => {
    history("/dashboard");
  };
  const goToDebate = () => {
    history("/activity/oratoria/start");
  };
  const goToReport = () => {
    history("/activity/oratoria/reports");
  };
  const goToMainPage = () => {
    history("/activity/oratoria");
  };
  return (
    <nav className="nav-oratoria-section">
      <div onClick={goToDashboard}>Dashboard</div>
      <div onClick={goToMainPage}>Inicio</div>
      <div onClick={goToDebate}>Discursos</div>
      <div onClick={goToReport}>Reportes</div>
    </nav>
  );
};

export default Nav;
