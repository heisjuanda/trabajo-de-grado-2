import { useEffect, useState } from "react";

import Nav from "../components/Nav/Nav";
import BoxInfo from "../components/BoxInfo/BoxInfo";

import "./DebateStart.css";

import { getSessionStorageValues } from "../helpers/helpers";
import Chat from "../components/Chat/Chat";
import Feedback from "../components/Feedback/Feedback";
import { removeSessionStorageValue } from "../helpers/helpers";
import { IA_CHAT_RESPONSE_CONTEXT, IA_TOPIC_QUESTION_INDEX } from "../constantes/debateIdeas";

const DebateStart = () => {
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState(0);
  const [userFeedback, setUserFeedback] = useState(null);

  useEffect(() => {
    const rawQuestion = getSessionStorageValues();
    if (!rawQuestion) return;
    const dataQuestion = JSON.parse(rawQuestion);
    setQuestion(dataQuestion.question);
    setTopic(dataQuestion.topic);
  }, []);

  useEffect(() => {
    if (!userFeedback) return;

    removeSessionStorageValue(IA_CHAT_RESPONSE_CONTEXT);
    removeSessionStorageValue(IA_TOPIC_QUESTION_INDEX);

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
    </section>
  );
};

export default DebateStart;
