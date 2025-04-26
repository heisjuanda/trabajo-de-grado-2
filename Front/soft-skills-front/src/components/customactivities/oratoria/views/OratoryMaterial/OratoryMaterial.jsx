import BoxSelect from "../../../pensamientoCritico/components/BoxSelect/BoxSelect";
import Nav from "../../components/Nav/Nav";
import JuanDabot from "../../components/JuanDabot/JuanDabot";

import { MATERIALS } from "../../constantes/constants";

import "./OratoryMaterial.css";

const OratoryMaterial = () => {
  return (
    <section className="oratory-material-section">
      <Nav />
      <header>
        <h1>Materiales de Aprendizaje</h1>
        <p>
          En esta sección encontrarás materiales de aprendizaje para fortalecer tus habilidades oratorias y practicar tus habilidades.
        </p>
      </header>
      <div className="title-section">
        <h2>Material para practicar</h2>
      </div>
      <div className="content">
        {MATERIALS.map((section) => (
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

export default OratoryMaterial;
