import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MicNotSupported.css";

const MicNotSupported = ({ setupMediaRecorder }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkIfMobile();
  }, []);

  const handleReturn = () => {
    navigate("/activity/oratoria");
  };

  return (
    <div className="mic-error-container">
      <div className="mic-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mic-error-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 0 1 2 0 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V19h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A7 7 0 0 1 5 10z"
          />
        </svg>
      </div>
      
      {isMobile ? (
        <>
          <h2 className="mic-error-title">Dispositivo no compatible</h2>
          <p className="mic-error-text">
            Esta actividad no es compatible con dispositivos móviles. 
            Por favor, utiliza un ordenador con Chrome, Firefox o Edge para realizar esta actividad.
          </p>
          <button
            className="mic-permission-btn"
            onClick={handleReturn}
          >
            Volver a la actividad
          </button>
        </>
      ) : (
        <>
          <h2 className="mic-error-title">Micrófono no disponible</h2>
          <p className="mic-error-text">
            Tu navegador no soporta reconocimiento de voz o no has otorgado permiso
            para usar el micrófono. Por favor, habilítalo en la configuración o usa
            un navegador compatible como Chrome.
          </p>
          <div className="mic-permission-prompt">
            <h2>Activa tu micrófono</h2>
            <p>Necesitamos permiso para usar tu micrófono antes de comenzar.</p>
            <button
              className="mic-permission-btn"
              onClick={async () => {
                await setupMediaRecorder();
              }}
            >
              Habilitar micrófono
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MicNotSupported;
