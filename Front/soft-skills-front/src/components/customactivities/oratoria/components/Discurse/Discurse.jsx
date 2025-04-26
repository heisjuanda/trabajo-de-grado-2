import { useEffect, useRef } from "react";

import VoiceRecorderButton from "../MicrophoneBton/MicrophoneBton";

import { TIME_OUT_QUESTION } from "../../constantes/constants";

import "./Discurse.css";

const Discurse = ({ topic, handleRecord, isRecording, stopRecording, speakText }) => {
  const isEasy = parseInt(topic?.difficulty) === 0;
  const isMedium = parseInt(topic?.difficulty) === 1;
  const isHard = parseInt(topic?.difficulty) === 2;

  const questionTimeoutRef = useRef(null);


  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      handleRecord();
    }
  };

  const handleSpeak = () => {
    if (!isRecording) return;
    const text = "Disculpa, tenguna una pregunta para ti" + topic.preguntaIntermedia;
    speakText(text);
  };

  useEffect(() => {
    if (isRecording && topic.difficulty === "2") {
      questionTimeoutRef.current = setTimeout(() => {
        handleSpeak();
      }, TIME_OUT_QUESTION);
    }
  
    return () => {
      if (questionTimeoutRef.current) {
        clearTimeout(questionTimeoutRef.current);
        questionTimeoutRef.current = null;
      }
    };
  }, [isRecording]);

  return (
    <div className="oratory-container__discurse">
      {isEasy && (
        <div className="topic-container easy-container">
          <div>
            <h3 className="section-title">🎤 Discurso</h3>
            <p className="discurso-text">{topic.guion}</p>
          </div>

          <div>
            <h3 className="section-title tips-title">
              💡 Palabras clave (Tips)
            </h3>
            <ul className="tips-list">
              {topic.frasesClave.map((frase) => (
                <li key={frase} className="tip-item">
                  {frase}
                </li>
              ))}
            </ul>
            <div className="start-discurse__button">
              <VoiceRecorderButton
                onClick={handleClick}
                isRecording={isRecording}
              />
            </div>
          </div>
        </div>
      )}
      {(isMedium || isHard) && (
        <div className="topic-container medium-container">
          <div>
            <h3>🧠 Idea principal</h3>
            <p>{topic.ideaCentral}</p>
            <div className="start-discurse__button">
              <VoiceRecorderButton
                onClick={handleClick}
                isRecording={isRecording}
              />
            </div>
          </div>
          <div>
            <div>
              <h3>💡 Palabras clave (Tips)</h3>
              <ul className="tips-list">
                {topic.frasesClave.map((frase) => (
                  <li key={frase} className="tip-item">
                    {frase}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>🛠️ Ayudas</h3>
              <ul className="tips-list">
                {topic.ayudas.map((ayuda) => (
                  <li key={ayuda} className="tip-item">
                    {ayuda}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discurse;
