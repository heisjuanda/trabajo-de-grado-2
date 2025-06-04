import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Nav from "./components/Nav/Nav";
import InputSelection from "./components/InputSelection/InputSelection";
import Button from "./components/Button/Button";
import JuanDabot from "../oratoria/components/JuanDabot/JuanDabot";

import { ALL_IDEAS, IA_FEEDBACK_RESPONSE, IA_CHAT_RESPONSE_CONTEXT, IA_TOPIC_QUESTION_INDEX } from "./constantes/debateIdeas";

import "./DebateIA.css";
import {
  removeSessionStorageValue,
  setSessionStorageValue,
} from "./helpers/helpers";
import BoxInfo from "./components/BoxInfo/BoxInfo";

const DebateIA = () => {
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    removeSessionStorageValue(IA_CHAT_RESPONSE_CONTEXT);
    removeSessionStorageValue(IA_FEEDBACK_RESPONSE);
    removeSessionStorageValue(IA_TOPIC_QUESTION_INDEX);
  }, []);

  const history = useNavigate();

  const handleSelection = (value) => {
    setTopic(value);
  };

  const getRandomTopic = () => {
    if (!topic) return;
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/debate-topics/${topic}`)
      .then((response) => {
        const debateInfo = {
          question: response.data.question,
          questionID: response.data.id,
          topic: topic,
        };
        setSessionStorageValue(JSON.stringify(debateInfo));
        history("/activity/debate-ia/topic-start");
      })
      .catch((error) => {
        notifyFailure(`Error al obtener el tema: Intenta nuevamente`);
        console.error(error);
        removeSessionStorageValue();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const notifyFailure = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <section className="debate-ia-section">
      <Nav />
      <header>
        <h1>Empezar Nuevo Debate</h1>
        <div>
          <InputSelection options={ALL_IDEAS} onSelect={handleSelection} textLabel="Tema de debate:" />
        </div>
      </header>
      <div className="start-debate__button">
        <Button
          loadingState={isLoading}
          onclick={getRandomTopic}
          disabled={topic}
          content="Generar debate"
          typeStyle="main"
        />
      </div>

      <BoxInfo topic={topic} />
      <ToastContainer />
      <JuanDabot />
    </section>
  );
};

export default DebateIA;
