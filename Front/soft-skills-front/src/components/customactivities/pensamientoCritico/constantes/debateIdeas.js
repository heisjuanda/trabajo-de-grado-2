import art from "../assets/art.png";
import bribery from "../assets/bribery.png";
import education from "../assets/education.png";
import enviorment from "../assets/enviorment.png";
import ethics from "../assets/ethics.png";
import gender from "../assets/gender.png";
import headBrain from "../assets/head-with-brain.png";
import health from "../assets/health.png";
import historical from "../assets/historical.png";
import justice from "../assets/justice.png";
import morale from "../assets/morale.png";
import philosophy from "../assets/philosophy.png";
import prayingMan from "../assets/praying-man.png";
import sport from "../assets/sport.png";
import strike from "../assets/strike.png";
import talk from "../assets/talk.png";
import tech from "../assets/tech.png";
import testTube from "../assets/test-tube.png";
import forum from '../../../../resources/icons/forum.png'
import educationIcon from '../../../../resources/icons/education.png'
import puzzle from '../../../../resources/icons/puzzle.png'


export const ALL_IDEAS = [
  {
    value: 0,
    option: "Ética/Moral",
    icon: ethics,
    description:
      "Explora principios sobre lo correcto e incorrecto, dilemas éticos y la toma de decisiones morales en diferentes contextos.",
  },
  {
    value: 1,
    option: "Tecnología/Futuro",
    icon: tech,
    description:
      "Debates sobre el impacto de la innovación tecnológica, inteligencia artificial y predicciones sobre el futuro de la humanidad.",
  },
  {
    value: 2,
    option: "Medio Ambiente/Sostenibilidad",
    icon: enviorment,
    description:
      "Discute temas como el cambio climático, energías renovables y prácticas sostenibles para preservar el planeta.",
  },
  {
    value: 3,
    option: "Política/Sociedad",
    icon: morale,
    description:
      "Analiza políticas gubernamentales, sistemas de poder, derechos civiles y su impacto en las sociedades modernas.",
  },
  {
    value: 4,
    option: "Educación",
    icon: education,
    description:
      "Debates sobre métodos de enseñanza, acceso a la educación y el futuro de los sistemas educativos.",
  },
  {
    value: 5,
    option: "Salud",
    icon: health,
    description:
      "Incluye temas como la salud mental, la medicina moderna, pandemias y avances en el bienestar humano.",
  },
  {
    value: 6,
    option: "Economía",
    icon: bribery,
    description:
      "Explora conceptos económicos, teorías de mercado, desigualdad financiera y el comercio global.",
  },
  {
    value: 7,
    option: "Derechos Humanos",
    icon: strike,
    description:
      "Discute la protección, promoción y desafíos de los derechos fundamentales en diferentes partes del mundo.",
  },
  {
    value: 8,
    option: "Ciencia/Filosofía",
    icon: testTube,
    description:
      "Debates sobre descubrimientos científicos, teorías filosóficas y su influencia en la percepción de la realidad.",
  },
  {
    value: 9,
    option: "Cultura/Arte",
    icon: art,
    description:
      "Explora el impacto de la cultura, el arte, las expresiones creativas y su papel en la sociedad.",
  },
  {
    value: 10,
    option: "Religión",
    icon: prayingMan,
    description:
      "Análisis de creencias religiosas, espiritualidad, su influencia cultural e histórica.",
  },
  {
    value: 11,
    option: "Deporte",
    icon: sport,
    description:
      "Debates sobre el impacto social de los deportes, ética deportiva y el rol de las competencias internacionales.",
  },
  {
    value: 12,
    option: "Medios de Comunicación",
    icon: talk,
    description:
      "Discute la influencia de los medios, las noticias falsas, la censura y el poder mediático.",
  },
  {
    value: 13,
    option: "Historia",
    icon: historical,
    description:
      "Explora eventos históricos, sus interpretaciones y cómo moldean el presente.",
  },
  {
    value: 14,
    option: "Psicología/Sociedad",
    icon: headBrain,
    description:
      "Analiza el comportamiento humano, la salud mental y las interacciones sociales.",
  },
  {
    value: 15,
    option: "Legislación/Justicia",
    icon: justice,
    description:
      "Debates sobre leyes, sistemas judiciales, equidad y acceso a la justicia.",
  },
  {
    value: 16,
    option: "Género/Sexualidad",
    icon: gender,
    description:
      "Explora temas de identidad de género, diversidad sexual, equidad y derechos relacionados.",
  },
  {
    value: 17,
    option: "Filosofía/Existencialismo",
    icon: philosophy,
    description:
      "Discute las preguntas más profundas de la existencia, el propósito de la vida y las teorías existenciales.",
  },
];

export const ALL_SECTIONS = [
  {
    description: "Participe en debates que invitan a la reflexión con nuestro Al sobre temas controvertidos. Desafía tusy refuerza tus argumentos.",
    icon: forum,
    type: "INTERACTIVO",
    title: "Debate IA",
    link: "/activity/debate-ia/start",
    buttonText: "Empezar Debate",
  },
  {
    description: "Vídeos de expertos sobre: Sesgos cognitivos, falacias lógicas y técnicas eficaces de resolución de problemas.",
    icon: educationIcon,
    type: "EDUCACIÓN",
    title: "Pensamiento Crítico Vídeos",
    link: "https://youtube.com/playlist?list=PLIOoQ_S_XkkER5m5VKZ1lWqCKqyl8STYk&si=276dx4IIVOJKXjzj",
    buttonText: "Ver Ahora",
  },
  {
    description: "Desafíate a ti mismo con rompecabezas interactivos juegos de lógica y rompecabezas diseñados para agudizar su pensamiento analítico.",
    icon: puzzle,
    type: "PRÁCTICA",
    title: "Juegos Mentales y Puzzles",
    link: "https://www.juegos-mentales.com/",
    buttonText: "Jugar Juegos",
  },
]

export const IA_TOPIC_QUESTION_INDEX = "question";
export const IA_CHAT_RESPONSE_CONTEXT = "context-chat";
export const IA_FEEDBACK_RESPONSE = "feedback"
