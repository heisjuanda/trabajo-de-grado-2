import BoxInfo from "../../components/BoxInfo/BoxInfo";
import BoxSelect from "../../components/BoxSelect/BoxSelect";
import Nav from "../../components/Nav/Nav";
import { ALL_SECTIONS } from "../../constantes/debateIdeas";

import "./Main.css";

const Main = () => {
  return (
    <section className="main-section">
      <Nav />
      <header>
        <h1>Desarrolla Tus Habilidades De Pensamiento Cŕitico</h1>
        <p>
          El pensamiento crítico es la capacidad de analizar objetivamente la
          información y emitir juicios razonados. Implica cuestionar supuestos,
          evaluar pruebas y considerar perspectivas alternativas.
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
    </section>
  );
};

export default Main;
