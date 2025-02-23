import { useEffect, useState, useRef } from "react";
import axios from "axios";

import sendBlue from "../../assets/send-blue.png";
import sendWhite from "../../assets/send-white.png";

import {
  setSessionStorageValue,
  getSessionStorageValues,
  removeSessionStorageValue,
  parseDynamicFeedback,
} from "../../helpers/helpers";

import Loader from "../Loader/Loader";
import Message from "./Message/Message";

import { IA_CHAT_RESPONSE_CONTEXT } from "../../constantes/debateIdeas";

import "./Chat.css";

const Chat = ({ setFeedback }) => {
  const [imageButton, setImageButton] = useState(sendBlue);
  const [isLoading, setIsLoading] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [round, setRound] = useState(0);

  const containerRef = useRef(null);

  const sendUserResponse = () => {
    if (!userResponse.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userResponse }]);
    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: "ia", text: "" }]);

    const rawQuestionTopic = getSessionStorageValues();
    const questionTopic = JSON.parse(rawQuestionTopic);
    const rawDebateContext = getSessionStorageValues(IA_CHAT_RESPONSE_CONTEXT);
    const debateContext = JSON.parse(rawDebateContext);

    const dataToSend = {
      contexto: questionTopic.question,
      debate_completo: debateContext?.debate_completo ?? "",
      ronda: round,
      respuesta_usuario: userResponse,
    };

    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/debate-topics/procesar-ronda`,
        dataToSend
      )
      .then((response) => {
        const aiMessage = response.data.ia_respuesta;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            text: aiMessage,
          };
          return updatedMessages;
        });

        setRound((prev) => prev + 1);

        setSessionStorageValue(
          JSON.stringify(response.data),
          IA_CHAT_RESPONSE_CONTEXT
        );
      })
      .catch((error) => {
        console.error("Error al obtener la respuesta de la IA:", error);
        removeSessionStorageValue(IA_CHAT_RESPONSE_CONTEXT);
      })
      .finally(() => {
        setIsLoading(false);
        setUserResponse("");
      });
  };

  const onEnter = () => {
    setImageButton(sendWhite);
  };

  const onLeave = () => {
    setImageButton(sendBlue);
  };

  const onKey = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendUserResponse();
    }
  };

  const onChange = (event) => {
    setUserResponse(event.target.value);
  };

  useEffect(() => {
    if (!round || round < 9) return;

    const rawContext = getSessionStorageValues(IA_CHAT_RESPONSE_CONTEXT);
    const context = JSON.parse(rawContext);
    const dataToSend = {
      contexto: context.debate_completo,
    };
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/debate-topics/dar-feedback`,
        dataToSend
      )
      .then((response) => {
        const aiMessage = response.data.feedback;
        const parsedFeedback = parseDynamicFeedback(aiMessage);
        setFeedback(parsedFeedback);
      })
      .catch((error) => {
        console.error("Error al obtener la respuesta de la IA:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="chat-ia-user__response" ref={containerRef}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg.text}
            isUser={msg.sender === "user"}
          />
        ))}
      </div>
      <div className="chat-ia-user">
        <label htmlFor="user-response">Envar Mensaje</label>
        <div className="chat-input">
          <textarea
            minLength="10"
            required
            title="user response"
            id="user-response"
            placeholder="Tu Opinión Aquí..."
            onKeyDown={onKey}
            onChange={onChange}
            value={userResponse}
            disabled={isLoading}
          />
          <button
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onClick={sendUserResponse}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <img alt="Send" src={imageButton} width="25px" height="25px" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
