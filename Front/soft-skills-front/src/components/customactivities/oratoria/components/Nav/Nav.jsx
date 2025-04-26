import { useNavigate } from "react-router-dom";

import "./Nav.css";

const Nav = () => {
  const history = useNavigate();

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
      <div onClick={goToMainPage}>Orator-IA</div>
      <div onClick={goToDebate}>Empezar Discurso</div>
      <div onClick={goToReport}>Reporte</div>
    </nav>
  );
};

export default Nav;
