import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Nav from "../../components/Nav/Nav";
import BoxInfo from "../../components/BoxInfo/BoxInfo";

import "./DebateStart.css";

import {
  getFormattedDate,
  getSessionStorageValues,
} from "../../helpers/helpers";
import Chat from "../../components/Chat/Chat";
import Feedback from "../../components/Feedback/Feedback";
import {
  removeSessionStorageValue,
  setSessionStorageValue,
} from "../../helpers/helpers";
import {
  IA_CHAT_RESPONSE_CONTEXT,
  IA_FEEDBACK_RESPONSE,
  IA_TOPIC_QUESTION_INDEX,
} from "../../constantes/debateIdeas";

const DebateStart = () => {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState(0);
  const [userFeedback, setUserFeedback] = useState(null);

  const { user } = useAuth0();

  const history = useNavigate();

  const notifySuccess = () =>
    toast.success("Reporte guardado", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  
  const notifyFailure = () => 
    toast.error('Error al guardar el reporte', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });

  useEffect(() => {
    const rawQuestion = getSessionStorageValues();
    if (!rawQuestion) {
      history("/activity/debate-ia");
    }
    const dataQuestion = JSON.parse(rawQuestion);
    if (!dataQuestion) {
      history("/activity/debate-ia");
    }
    setQuestion(dataQuestion?.question);
    setTopic(dataQuestion?.topic);
  }, []);

  useEffect(() => {
    if (!userFeedback) return;

    const rawFeedback = JSON.stringify(userFeedback);
    setSessionStorageValue(rawFeedback, IA_FEEDBACK_RESPONSE);
    removeSessionStorageValue(IA_TOPIC_QUESTION_INDEX);

    const loadReport = () => {
      const dataToSend = {
        created_at: getFormattedDate(),
        email: user.email,
        chat: getSessionStorageValues(IA_CHAT_RESPONSE_CONTEXT),
        full_report: rawFeedback,
        rating: userFeedback.rating || 0,
      };
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/debate-topics/reports`,
          dataToSend
        )
        .then(() => {
          notifySuccess();
        })
        .catch((error) => {
          console.error("Error al guardar el reporte:", error);
          notifyFailure()
        })
        .finally(() => {
          removeSessionStorageValue(IA_CHAT_RESPONSE_CONTEXT);
        });
    };

    loadReport();
  }, [userFeedback]);

  return (
    <section className="debate-ia-container">
      <Nav />
      <BoxInfo
        dropdown={true}
        topic={topic}
        isFullScreen={true}
        question={question}
      />
      {userFeedback ? (
        <Feedback data={userFeedback} />
      ) : (
        <Chat setFeedback={setUserFeedback} />
      )}
      <ToastContainer />
    </section>
  );
};

export default DebateStart;
