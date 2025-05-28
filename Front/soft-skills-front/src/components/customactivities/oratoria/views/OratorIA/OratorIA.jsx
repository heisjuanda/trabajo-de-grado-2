import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import InputSelection from "../../../pensamientoCritico/components/InputSelection/InputSelection";
import Button from "../../../pensamientoCritico/components/Button/Button";
import JuanDabot from "../../components/JuanDabot/JuanDabot";

import { ALL_DIFFICULTIES, ORATORY_FEEDBACK_STORAGE_KEY } from "../../constantes/constants";

import BoxInfo from "../../../pensamientoCritico/components/BoxInfo/BoxInfo";
import Nav from "../../components/Nav/Nav";

import "./OratorIA.css";
import { parseOratoryTopic, saveOratoryTopic, removeOratoryTopic } from "../../helpers/helpers";

const OratorIA = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    const checkDevice = async () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));

      const isBrave = navigator.brave && await navigator.brave.isBrave() || false
      const isChrome = !!window.chrome && !isBrave;
      
      const isIE = /*@cc_on!@*/false || !!document.documentMode;
      const isEdge = !isIE && !!window.StyleMedia;
      
      const isFirefox = typeof InstallTrigger !== 'undefined';

      setIsSupportedBrowser(isChrome || isEdge || isFirefox);
    };

    checkDevice();
  }, []);

  const handleSelection = (value) => {
    setDifficulty(value);
  };

  const getRandomTopic = () => {
    if (!difficulty) return;
    
    if (isMobile) {
      notifyWarning("Esta actividad no es compatible con dispositivos móviles. Por favor, utiliza un ordenador.");
      return;
    }
    
    if (!isSupportedBrowser) {
      notifyWarning("Esta actividad requiere Chrome, Firefox o Edge para funcionar correctamente. Por favor, cambia de navegador.");
      return;
    }
    
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/oratory-topics/${difficulty}`)
      .then((response) => {
        const parsedTopic = parseOratoryTopic(response.data);
        if (!parsedTopic) {
          notifyFailure("Intentando nuevamente");
          getRandomTopic();
          return;
        }
        const topicToStore = {
          ...parsedTopic,
          difficulty: difficulty
        }
        saveOratoryTopic(topicToStore);
        history("/activity/oratoria/topic-start");
      })
      .catch((error) => {
        console.error("Error al obtener los temas:", error);
        notifyFailure()
        removeOratoryTopic();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const notifyFailure = (additionalMessage = "") =>
    toast.error("Error al obtener el tema" + additionalMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyWarning = (message) =>
    toast.warning(message, {
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
    removeOratoryTopic();
    removeOratoryTopic(ORATORY_FEEDBACK_STORAGE_KEY);
  }, []);

  const isCompatible = !isMobile && isSupportedBrowser;

  return (
    <section className="orator-ia-section">
      <Nav />
      <header>
        <h1>Empezar Nuevo Discurso</h1>
        {!isCompatible && (
          <div className="compatibility-warning">
            {isMobile && (
              <div className="mobile-warning">
                <p>Dispositivo móvil detectado</p>
                <p>Esta actividad requiere un ordenador con micrófono para el reconocimiento de voz.</p>
                <p>Por favor, accede desde un ordenador con Chrome, Firefox o Edge.</p>
                <div className="compatibility-note">
                  <small>💡 Nota: Aunque uses "Ver como escritorio", tu dispositivo sigue siendo móvil y no soporta las funciones de micrófono necesarias.</small>
                </div>
              </div>
            )}
            {!isSupportedBrowser && !isMobile && (
              <div className="browser-warning">
                <p>Navegador no compatible</p>
                <p>Tu navegador no soporta las funciones de reconocimiento de voz necesarias.</p>
                <p>Por favor, utiliza uno de estos navegadores recomendados:</p>
                <div className="browser-recommendations">
                  <div className="browser-option">
                    <span className="browser-icon">🟢</span>
                    <span>Google Chrome</span>
                  </div>
                  <div className="browser-option">
                    <span className="browser-icon">🦊</span>
                    <span>Mozilla Firefox</span>
                  </div>
                  <div className="browser-option">
                    <span className="browser-icon">🔷</span>
                    <span>Microsoft Edge</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isCompatible && (
          <div>
            <InputSelection options={ALL_DIFFICULTIES} onSelect={handleSelection} textLabel="Dificultad:" />
          </div>
        )}
      </header>
      <div className="start-orator-ia__button">
        <Button
          loadingState={isLoading}
          onclick={getRandomTopic}
          disabled={!isCompatible ? false : difficulty}
          content={
            isMobile 
              ? "No disponible en móviles" 
              : !isSupportedBrowser 
                ? "Navegador no compatible" 
                : "Empezar discurso"
          }
          typeStyle="main"
        />
      </div>

      {isCompatible && <BoxInfo topic={difficulty} allIdeas={ALL_DIFFICULTIES} />}
      <ToastContainer />
      <JuanDabot />
    </section>
  );
};

export default OratorIA;
