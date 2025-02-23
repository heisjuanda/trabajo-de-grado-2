import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Nav from "./components/Nav/Nav";
import InputSelection from "./components/InputSelection/InputSelection";
import Button from "./components/Button/Button";

import { ALL_IDEAS } from "./constantes/debateIdeas";

import "./DebateIA.css";
import {
  removeSessionStorageValue,
  setSessionStorageValue,
} from "./helpers/helpers";
import BoxInfo from "./components/BoxInfo/BoxInfo";

const DebateIA = () => {
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        console.error("Error al obtejer los temas:", error);
        removeSessionStorageValue();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="debate-ia-section">
      <Nav />
      <header>
        <h1>Empezar Nuevo Debate</h1>
        <div>
          <InputSelection options={ALL_IDEAS} onSelect={handleSelection} />
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
    </section>
  );
};

export default DebateIA;
