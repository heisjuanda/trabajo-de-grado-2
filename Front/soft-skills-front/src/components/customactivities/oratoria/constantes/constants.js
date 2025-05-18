import easy from "../../../../resources/icons/easy.png"
import advanced from "../../../../resources/icons/advanced.png"
import expert from "../../../../resources/icons/expert.png"
import microphone from "../../../../resources/icons/microphone.png"
import talk from "../../../../resources/icons/talk.png"
import video from "../../../../resources/icons/video.png"
import book from "../../../../resources/icons/book.png"
import game from "../../../../resources/icons/game.png"

export const ALL_DIFFICULTIES = [
    {
        value: 0,
        option: "Fácil",
        icon: easy,
        description:
          "Dirigido a quienes dan sus primeros pasos en oratoria. Se enfoca en estructura básica, claridad y control del nerviosismo.",
    },
    {
        value: 1,
        option: "Intermedio",
        icon: advanced,
        description:
          "Dirigido a quienes tienen experiencia en oratoria. Se enfoca en técnicas de enfoque, conexión con el público y fluidez.",
    },
    {
        value: 2,
        option: "Avanzado",
        icon: expert,
        description:
          "Desafía a oradores experimentados con temas abstractos, obstáculos imprevistos y alta adaptabilidad.",
    },
]

export const ORATORY_TOPIC_STORAGE_KEY = "oratoryTopic"
export const ORATORY_FEEDBACK_STORAGE_KEY = "oratoryFeedback"

export const ALL_SECTIONS = [
  {
    description: "Mejora tu expresión oral con discursos generados automáticamente según tu nivel. Practica estructura, tono y claridad.",
    icon: microphone,
    type: "INTERACTIVO",
    title: "Retos de Discurso",
    link: "/activity/oratoria/start",
    buttonText: "Comenzar Reto",
  },
  {
    description: "Accede a vídeos sobre técnicas de oratoria, control del miedo escénico y habilidades para hablar en público con impacto.",
    icon: video,
    type: "EDUCACIÓN",
    title: "Vídeos de Oratoria",
    link: "https://www.youtube.com/watch?v=dhQHPjmk0-k&list=PLIOoQ_S_XkkGK5QsmCII_yXFqvza7u62l",
    buttonText: "Ver Ahora",
  },
  {
    description: "Ejercicios breves de vocalización, improvisación y lenguaje corporal para fortalecer tu presencia escénica y fluidez.",
    icon: talk,
    type: "INTERACTIVO",
    title: "Ejercicios de Oratoria",
    link: "/activity/oratoria-ejercicios",
    buttonText: "Prácticar",
  },
]

export const MATERIALS = [
  {
    title: "Story Dice",
    description: "Juego de dados para desarrollar habilidades de oratoria.",
    icon: game,
    type: "JUEGOS",
    buttonText: "Jugar",
    link: "https://davebirss.com/storydice/index.html",
  },
  {
    title: "Materiales de Aprendizaje",
    description: "En esta sección encontrarás materiales de aprendizaje para fortalecer tus habilidades oratorias.",
    icon: book,
    type: "MATERIAL",
    buttonText: "Ver",
    link: "https://www.toastmasters.org/Resources",
  },
]

export const TIME_OUT_QUESTION = 45000;
export const TIME_OUT_DISCURSE = [
  90000,
  120000,
  150000,
];