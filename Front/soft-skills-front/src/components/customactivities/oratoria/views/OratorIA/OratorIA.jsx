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
  const history = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkIfMobile();
  }, []);

  const handleSelection = (value) => {
    setDifficulty(value);
  };

  const getRandomTopic = () => {
    if (!difficulty) return;
    
    // Si es un dispositivo móvil, mostrar advertencia y no continuar
    if (isMobile) {
      notifyWarning("Esta actividad no es compatible con dispositivos móviles. Por favor, utiliza un ordenador.");
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

  return (
    <section className="orator-ia-section">
      <Nav />
      <header>
        <h1>Empezar Nuevo Discurso</h1>
        {isMobile ? (
          <div className="mobile-warning">
            <p>Esta actividad no es compatible con dispositivos móviles.</p>
            <p>Por favor, utiliza un ordenador con Chrome, Firefox o Edge para realizar esta actividad.</p>
          </div>
        ) : (
          <div>
            <InputSelection options={ALL_DIFFICULTIES} onSelect={handleSelection} textLabel="Dificultad:" />
          </div>
        )}
      </header>
      <div className="start-orator-ia__button">
        <Button
          loadingState={isLoading}
          onclick={getRandomTopic}
          disabled={difficulty || isMobile}
          content={isMobile ? "No disponible en móviles" : "Empezar discurso"}
          typeStyle="main"
        />
      </div>

      <BoxInfo topic={difficulty} allIdeas={ALL_DIFFICULTIES} />
      <ToastContainer />
      <JuanDabot />
    </section>
  );
};

export default OratorIA;
