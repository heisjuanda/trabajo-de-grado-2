import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import InputSelection from "../../../pensamientoCritico/components/InputSelection/InputSelection";
import Button from "../../../pensamientoCritico/components/Button/Button";
import JuanDabot from "../../components/JuanDabot/JuanDabot";

import { ALL_DIFFICULTIES } from "../../constantes/constants";

import BoxInfo from "../../../pensamientoCritico/components/BoxInfo/BoxInfo";
import Nav from "../../components/Nav/Nav";
import OratoryResult from "../../components/OratoryResult/OratoryResult";

import "./OratorIA.css";
import { parseDynamicFeedback } from "../../../pensamientoCritico/helpers/helpers";
import { saveOratoryTopic } from "../../helpers/helpers";

const OratorIA = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [oratoryTopic, setOratoryTopic] = useState(null);
  const history = useNavigate();

  const handleSelection = (value) => {
    setDifficulty(value);
  };

  const getRandomTopic = () => {
    if (!difficulty) return;
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/oratory-topics/${difficulty}`)
      .then((response) => {
        // const debateInfo = {
        //   question: response.data.question,
        //   questionID: response.data.id,
        //   topic: response.data.topic,
        // };
        // setSessionStorageValue(JSON.stringify(debateInfo));
        // history("/activity/debate-ia/topic-start");
        const parsedFeedback = parseDynamicFeedback(response.data.topic)
        saveOratoryTopic(response.data.topic)
        console.log(parsedFeedback)
        setOratoryTopic(parsedFeedback)
      })
      .catch((error) => {
        console.error("Error al obtejer los temas:", error);
        notifyFailure()
        // removeSessionStorageValue();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const notifyFailure = () =>
    toast.error("Error al obtener el tema", {
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
    <section className="orator-ia-section">
      <Nav />
      <header>
        <h1>Empezar Nuevo Discurso</h1>
        <div>
          <InputSelection options={ALL_DIFFICULTIES} onSelect={handleSelection} textLabel="Dificultad:" />
        </div>
      </header>
      <div className="start-orator-ia__button">
        <Button
          loadingState={isLoading}
          onclick={getRandomTopic}
          disabled={difficulty}
          content="Empezar discurso"
          typeStyle="main"
        />
      </div>

      <BoxInfo difficulty={difficulty} allIdeas={ALL_DIFFICULTIES} />
      <ToastContainer />
      {oratoryTopic && <OratoryResult result={oratoryTopic} />}
      <JuanDabot />
    </section>
  );
};

export default OratorIA;
