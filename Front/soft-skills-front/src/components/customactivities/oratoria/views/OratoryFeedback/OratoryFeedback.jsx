import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Section from "../../components/Section/Section";
import Nav from "../../components/Nav/Nav";

import { ORATORY_FEEDBACK_STORAGE_KEY } from "../../constantes/constants";

import { getOratoryTopic, removeOratoryTopic } from "../../helpers/helpers";

import "./OratoryFeedback.css";

const OratoryFeedback = () => {
  const [feedback, setFeedback] = useState(null);

  const history = useNavigate();

  useEffect(() => {
    const feedback = getOratoryTopic(ORATORY_FEEDBACK_STORAGE_KEY);
    if (!feedback) {
      history("/activity/oratoria/start");
    }
    setFeedback(feedback);

    return () => {
      removeOratoryTopic()
    }
  }, []);

  if (!feedback) return <div>No hay feedback</div>;

  return (
    <section className="oratory-feedback-section">
      <Nav />
      <div className="oratory-feedback">
        <h1>Feedback de tu Discurso</h1>
        <Section title="Resumen" content={feedback.resumen} />
        <Section title="Sentimiento" content={feedback.sentimiento} />
        <Section title="Temas clave" content={feedback.temas_clave} />
      </div>
    </section>
  );
};

export default OratoryFeedback;
