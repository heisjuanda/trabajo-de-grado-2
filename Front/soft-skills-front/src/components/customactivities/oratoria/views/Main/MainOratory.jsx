import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BoxSelect from "../../../pensamientoCritico/components/BoxSelect/BoxSelect";
import Nav from "../../components/Nav/Nav";
import JuanDabot from "../../components/JuanDabot/JuanDabot";

import { removeOratoryTopic } from "../../helpers/helpers";

import {
  ALL_SECTIONS,
  ORATORY_FEEDBACK_STORAGE_KEY,
} from "../../constantes/constants";

import "./Main.css";

const MainOratory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    removeOratoryTopic();
    removeOratoryTopic(ORATORY_FEEDBACK_STORAGE_KEY);

  }, []);

  return (
    <section className="main-section">
      <Nav />
      <header>
        <h1>Desarrolla Tus Habilidades De Oratoria</h1>
        <p>
          La oratoria es la capacidad de expresar ideas y argumentos de manera
          clara y persuasiva. Implica utilizar técnicas de lenguaje, tono y
          estructura para transmitir mensajes efectivos.
        </p>
      </header>
      <div className="title-section">
        <h2>Herramientas de Aprendizaje Interactivo</h2>
      </div>
      <div className="content">
        {ALL_SECTIONS.map((section) => (
          <BoxSelect
            description={section.description}
            icon={section.icon}
            title={section.title}
            type={section.type}
            key={section.title}
            buttonText={section.buttonText}
            link={section.link}
          />
        ))}
      </div>
      <JuanDabot />
    </section>
  );
};

export default MainOratory;
