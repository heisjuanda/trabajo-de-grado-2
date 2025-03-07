import { useNavigate } from "react-router-dom";

import "./Nav.css";

const Nav = () => {
  const history = useNavigate();

  const goToDebate = () => {
    history("/activity/debate-ia/start");
  };
  const goToReport = () => {
    history("/activity/debate-ia/reports");
  };
  const goToMainPage = () => {
    history("/activity/debate-ia");
  };
  return (
    <nav className="nav-ia-section">
      <div onClick={goToMainPage}>IA Debate</div>
      <div onClick={goToDebate}>Debates</div>
      <div onClick={goToReport}>Reporte</div>
    </nav>
  );
};

export default Nav;
