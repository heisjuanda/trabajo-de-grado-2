--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7
-- Dumped by pg_dump version 15.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity (
    activity_id character varying NOT NULL,
    course_id character varying NOT NULL,
    content_type character varying NOT NULL,
    title character varying NOT NULL,
    objective character varying NOT NULL,
    metodology character varying NOT NULL,
    resources character varying NOT NULL,
    introduction character varying NOT NULL,
    analisis character varying NOT NULL,
    evaluation character varying NOT NULL,
    example character varying NOT NULL,
    question1 character varying NOT NULL,
    question2 character varying NOT NULL,
    question3 character varying NOT NULL,
    question4 character varying NOT NULL,
    question5 character varying NOT NULL,
    path character varying NOT NULL,
    id integer NOT NULL
);


--
-- Name: answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answer (
    user_email character varying NOT NULL,
    activity_id character varying NOT NULL,
    question_number integer NOT NULL,
    answer_text character varying NOT NULL,
    id integer NOT NULL
);


--
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment (
    content character varying NOT NULL,
    created_at character varying NOT NULL,
    user_id character varying NOT NULL,
    course_id character varying NOT NULL,
    id integer NOT NULL
);


--
-- Name: course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course (
    content_id character varying NOT NULL,
    title character varying NOT NULL,
    category_id character varying NOT NULL,
    description character varying NOT NULL,
    id integer NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    id integer NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity (activity_id, course_id, content_type, title, objective, metodology, resources, introduction, analisis, evaluation, example, question1, question2, question3, question4, question5, path, id) FROM stdin;
1	1	text	Sinergia en el equipo	Desarrollar las habilidades de análisis, toma de decisiones, comunicación y trabajo en equipo para lograr la sinergia y el éxito del equipo.	Estudio de casos y elección estratégica	Descripción de la situación conflictiva del equipo hipotético, presentación de diferentes escenarios con sus posibles consecuencias, y plantilla para evaluar las opciones y tomar una decisión estratégica.	Se presenta al participante o equipo la situación conflictiva del equipo hipotético, describiendo los personajes, sus roles, el problema central y las tensiones existentes.\nSe explica el objetivo de la actividad: analizar las opciones disponibles, evaluar sus consecuencias y elegir la estrategia más adecuada para lograr la sinergia y el éxito del equipo.	El participante o equipo debe analizar en detalle la situación conflictiva, identificando las causas del problema, las necesidades y motivaciones de los personajes, y los posibles obstáculos para la colaboración.\nSe alienta al participante o equipo a reflexionar sobre las razones de su elección estratégica, las habilidades y valores que se requieren para el éxito del equipo, y las lecciones aprendidas de la actividad.\nSi la actividad se realiza en grupo, se fomenta el debate y la argumentación para defender las diferentes perspectivas y llegar a un consenso sobre la mejor estrategia	Se presentan al participante o equipo diferentes escenarios que representan posibles soluciones al problema, cada escenario describe las acciones que se deben tomar, las reacciones probables de los personajes y las consecuencias a corto y largo plazo. \nEl participante o equipo debe evaluar cuidadosamente cada escenario, considerando las ventajas y desventajas de cada opción, las posibles consecuencias y su impacto en la sinergia del equipo.\nSe debe utilizar la plantilla proporcionada para analizar las opciones de forma sistemática, ponderando los diferentes factores y seleccionando la estrategia más adecuada.	<div>\n                    <h3>Equipo de desarrollo de software</h3>\n                    Personajes\n                    <ul>\n                      <li>\n                        <strong>Ana:</strong> Programadora experimentada, muy\n                        técnica y orientada a los resultados.\n                      </li>\n                      <li>\n                        <strong>Bruno:</strong> Diseñador gráfico creativo, con\n                        poca experiencia en desarrollo de software.\n                      </li>\n                      <li>\n                        <strong>Camila:</strong> Ingeniera de software junior,\n                        entusiasta y dispuesta a aprender.\n                      </li>\n                      <li>\n                        <strong>Daniel:</strong> Tester meticuloso, muy crítico\n                        con el trabajo de los demás.\n                      </li>\n                    </ul>\n                    Situación conflictiva\n                    <p>\n                      El equipo se encuentra trabajando en un proyecto\n                      importante, pero hay mucha tensión entre sus miembros:\n                    </p>\n                    <ul>\n                      <li>\n                        Ana y Bruno no se ponen de acuerdo sobre el diseño de la\n                        interfaz del usuario.\n                      </li>\n                      <li>\n                        Camila se siente excluida por Ana y Bruno, quienes no\n                        valoran sus ideas.\n                      </li>\n                      <li>\n                        Daniel critica constantemente el trabajo de Ana, lo que\n                        genera un ambiente hostil.\n                      </li>\n                    </ul>\n                    <div\n                      style={{\n                        height: "auto",\n                        width: "auto",\n                        textAlign: "left",\n                        border: "1px solid black",\n                        borderRadius: "5px",\n                      }}\n                    >\n                      <table>\n                        <tr>\n                          <th>Factor</th>\n                          <td>Escenario 1</td>\n                          <td>Escenario 2</td>\n                          <td>Escenario 3</td>\n                          <td>Escenario 4</td>\n                        </tr>\n                        <tr>\n                          <th>Eficiencia</th>\n                          <td>Alta</td>\n                          <td>Media</td>\n                          <td>Alta</td>\n                          <td>Media</td>\n                        </tr>\n                        <tr>\n                          <th>Calidad del producto</th>\n                          <td>Media</td>\n                          <td>Alta</td>\n                          <td>Alta</td>\n                          <td>Alta</td>\n                        </tr>\n                        <tr>\n                          <th>Satisfacción del equipo</th>\n                          <td>Baja</td>\n                          <td>Alta</td>\n                          <td>Media</td>\n                          <td>Alta</td>\n                        </tr>\n                        <tr>\n                          <th>Costo</th>\n                          <td>Bajo</td>\n                          <td>Bajo</td>\n                          <td>Medio</td>\n                          <td>Alto</td>\n                        </tr>\n                        <tr>\n                          <th>Tiempo</th>\n                          <td>Rápido</td>\n                          <td>Medio</td>\n                          <td>Medio</td>\n                          <td>Medio</td>\n                        </tr>\n                      </table>\n                    </div>\n                  </div>	¿Qué factores fueron los más importantes para tomar la decisión?	¿Qué habilidades y valores son esenciales para la sinergia del equipo?	¿Qué lecciones aprendieron de la actividad?				1
2	1	text	Análisis de un escenario de trabajo en equipo en el mundo real	Desarrollar las habilidades de análisis, pensamiento crítico, comunicación y trabajo en equipo para identificar problemas y soluciones potenciales en un escenario real.	Estudio de caso y análisis grupal	Descripción detallada del escenario de trabajo en equipo en el mundo real, guía de preguntas para el análisis del caso y pizarra o rotafolio para tomar notas y marcadores o bolígrafos.\n	Se presenta al equipo el escenario de trabajo en equipo en el mundo real, describiendo el contexto, los personajes, sus roles, el problema central y las tensiones existentes.\nSe explica el objetivo de la actividad: analizar el caso en profundidad, identificar los problemas y las posibles soluciones, y desarrollar un plan de acción para mejorar la situación.\n	El equipo lee y analiza cuidadosamente la descripción del escenario, respondiendo las preguntas de la guía y tomando notas relevantes.\nEl equipo identifica los problemas principales que afectan al trabajo en equipo en el escenario, utilizando la información recopilada.\nSe pueden clasificar los problemas por categorías, como comunicación, liderazgo, motivación, organización o toma de decisiones.	Para cada problema identificado, el equipo propone soluciones potenciales, considerando las necesidades y recursos disponibles.\nSe pueden utilizar técnicas de creatividad para generar ideas innovadoras y soluciones prácticas.\nEl equipo evalúa las soluciones propuestas, considerando su viabilidad, impacto potencial y posibles riesgos.\nSe seleccionan las soluciones más adecuadas para el contexto del escenario y se define un plan de acción para implementarlas.\n	<div>\n        <h3>Un equipo de marketing:</h3>\n        <p>El equipo está compuesto por 5 personas con diferentes habilidades y personalidades:</p>\n        <ul>\n            <li>Mariana: Gerente de marketing, con experiencia en liderazgo y estrategia.</li>\n            <li>Juan: Diseñador gráfico creativo, con poca experiencia en marketing digital.</li>\n            <li>Camila: Redactora de contenido, entusiasta y dispuesta a aprender.</li>\n            <li>Daniel: Analista de datos, meticuloso y orientado a los resultados.</li>\n            <li>Sofía: Community manager, extrovertida y con gran capacidad de interacción.</li>\n        </ul>\n        <p>El equipo tiene como objetivo lanzar una nueva campaña de marketing para un producto innovador.</p>\n        <p>Sin embargo, hay algunos problemas que afectan al trabajo en equipo:</p>\n        <ol>\n            <li>Falta de comunicación clara: Los miembros del equipo no comparten información de manera efectiva, lo que genera confusiones y retrasos.</li>\n            <li>Diferencias de opinión: Hay desacuerdos sobre la estrategia de marketing y el diseño de la campaña.</li>\n            <li>Falta de liderazgo: Mariana no está delegando tareas de manera efectiva, lo que genera desmotivación en el equipo.</li>\n        </ol>\n    </div>	¿Cuáles son los objetivos del equipo de marketing?	¿Cuáles son los roles y responsabilidades de cada miembro del equipo?	¿Qué problemas están afectando al trabajo en equipo y cuales son sus causas?	¿Qué soluciones se pueden proponer para mejorar la situación?	¿Qué recursos se necesitan para implementar las soluciones y cómo se puede evaluar el éxito de las soluciones?		2
3	2	text	Analizando el Liderazgo en Videos Inspiradores	Identificar y reflexionar sobre las cualidades de liderazgo observadas en videos de personas destacadas.	Selección, visualización y estudio de escenarios	Lista de videos		Los estudiantes deben ver los videos preferiblemente de manera individual, mientras lo hacen, deben prestar atención a las acciones, palabras y comportamientos del líder.	Después de ver cada video, los estudiantes deben anotar las cualidades de liderazgo que observaron.		¿Cómo se comunica el líder con su equipo o audiencia?	¿Qué valores o principios defiende?	¿Cómo maneja situaciones difíciles o conflictos?	¿Cómo inspira y motiva a los demás?	¿Qué aprendieron de ese líder y qué cualidades les gustaría desarrollar en sí mismos?		3
4	2	text	Analizando la Falta de Liderazgo	Identificar las cualidades que no hacen a una persona un buen líder, basándose en un video de alguien que no evidencia liderazgo efectivo.	Selección, visualización y estudio de escenarios	Lista de videos		Busca un video en el que la persona no demuestre habilidades de liderazgo o muestre comportamientos contraproducentes. (Debe dejar los links en las respuestas)\nPuede ser una entrevista, una presentación o cualquier otro contexto en el que se pueda evaluar el liderazgo.\n	Después de ver el video, los estudiantes deben anotar las cualidades que observaron y que no contribuyen a un buen liderazgo.		¿Cómo se comunica la persona con su equipo o audiencia?	¿Qué valores o principios parece ignorar?	¿Cómo maneja situaciones difíciles o conflictos de manera ineficiente?	¿Qué lecciones pueden extraer para su propio desarrollo de liderazgo?			4
5	2	text	Liderazgo y asignación de responsabilidades	Desarrollar la capacidad de un líder para evaluar las habilidades de su equipo, asignar responsabilidades de forma efectiva y tomar decisiones estratégicas para lograr los objetivos en un tiempo limitado.	Simulación individual y toma de decisiones	Descripción del contexto de la tarea y los objetivos del equipo, perfiles de los integrantes del equipo, incluyendo sus habilidades, experiencia y preferencias, lista de responsabilidades a asignar, plantilla para la evaluación de las opciones.		Lee cuidadosamente la descripción del contexto de la tarea y los objetivos del equipo.\nAnaliza los perfiles de los integrantes del equipo, identificando sus habilidades, experiencia y preferencias.\nRevisa la lista de responsabilidades a asignar y comprende las características de cada una.\n	Asume el rol de líder del equipo, toma decisiones estratégicas sobre la asignación de responsabilidades a cada integrante del equipo, considera las habilidades, experiencia y preferencias de cada miembro al asignar las responsabilidades, utiliza la plantilla para evaluar las opciones y tomar decisiones informadas, y justifica tus decisiones y explica cómo cada asignación contribuye al logro de los objetivos del equipo.\n		¿Qué factores fueron los más importantes para la asignación de responsabilidades?	¿Qué aprendiste sobre tu capacidad de liderazgo y toma de decisiones?	¿Cómo puedes mejorar tu capacidad para delegar y asignar responsabilidades de forma efectiva?				5
6	1	comp	Mapa mental colaborativo	Colaborar en un mapa mental público sobre un tema a elección relacionado al curso, utilizando una herramienta online como draw.io 	Los estudiantes deben ingeniearselas para desarrollar su tema, añadiendo subtemas, ideas y ejemplos al diagrama público, respetando y colaborando con los demás compañeros que ya han aportado al mapa.\n\nAl final, las pequeñas partes del diagrama se combinan entre sus categorías para crear un mapa mental completo.\n	Se proporciona acceso al diagrama público del curso para que el estudiante pueda añadir sus ideas y tomar evidencias de sus modificaciones para así incluirlas en el entregable de la actividad.	A continuación se presenta el diagrama público en el cual podrás incluir los aportes que tengas del tema o subtema elegido. \n\nPara poder acceder al menú de edición debes autenticarte con tu cuenta de Google.		El estudiante debe colaborar en el diagrama público proporcionado, añadiendo un subtema o ayudando a desarrollar otros. Se evalua la calidad de los aportes, desde lo argumentativo e investigativo, hasta el estilo y distribución.							/activity/mentalmap	6
7	1	comp	Debate virtual: Defiende tu postura	A partir de un tema controversial a elección el estudiante deberá defender una postura que tome respecto a diferentes perspectivas que pueda tener, no importa si es bueno o malo a interpretación, lo importante es generar los argumentos sólidos para poder debatir del tema con un compañero.	Estudio de casos, análisis general, elección de postura.	Se proporcionarán temas y posturas de ejemplo para que el estudiante tenga una referencia de como elegir su tema, argumentar y debatir.			 <div>\n <span>A continuación se presenta la estructura esperada de la información usada para debatir:</span>\n    <h5>Introducción:</h5>\n    <ul>\n        <li>Comienza presentando tu postura de manera clara y concisa.</li>\n        <li>Indica brevemente cuáles serán tus principales argumentos en apoyo a esa postura.</li>\n    </ul>\n\n    <h5>Desarrollo:</h5>\n    <ul>\n        <li>Presenta cada argumento individualmente, enfocándote en un aspecto específico del tema en discusión.</li>\n        <li>Proporciona evidencia, datos o ejemplos concretos para respaldar cada argumento.</li>\n        <li>Utiliza un lenguaje persuasivo y convincente para hacer que tus puntos de vista sean claros y comprensibles.</li>\n        <li>Si es necesario, refuta posibles argumentos en contra de tu postura.</li>\n    </ul>\n\n    <h5>Conclusión:</h5>\n    <ul>\n        <li>Recapitula brevemente tus argumentos principales.</li>\n        <li>Reafirma tu postura y por qué crees que es la más sólida o válida.</li>\n        <li>Termina con una declaración contundente que refuerce tu posición en el debate.</li>\n    </ul>\n\n</div>	<div>\n    <h4>Tema: El impacto de las redes sociales en la salud mental</h4>\n\n    <h5>Postura 1: Las redes sociales tienen un impacto negativo en la salud mental.</h5>\n\n    <ul>\n    <li>Las redes sociales pueden provocar un aumento de la ansiedad, la depresión y la soledad debido a la comparación social y los estándares de belleza irreales.</li>\n    <li>La exposición constante a noticias y eventos negativos puede contribuir al estrés y la ansiedad.</li>\n    <li>El ciberacoso y el hostigamiento en línea pueden tener un impacto devastador en el bienestar mental.</li>\n    </ul>\n\n    <h5>Postura 2: Las redes sociales pueden tener un impacto positivo en la salud mental.</h5>\n\n    <ul>\n    <li>Las redes sociales pueden proporcionar un sentido de conexión y pertenencia, especialmente para aquellos que pueden sentirse aislados o solos.</li>\n    <li>Pueden ser una plataforma para la autoexpresión, la creatividad y la búsqueda de grupos de apoyo para diversos problemas.</li>\n    <li>Las redes sociales se pueden utilizar para promover la conciencia y los recursos de salud mental.</li>\n    </ul>\n</div>						/activity/debate	7
8	1	comp	Sinergia Climática: Fortaleciendo Equipos a través del Aprendizaje Jigsaw	Fomentar el trabajo en equipo y la colaboración interdisciplinaria para una comprensión integral del cambio climático, utilizando la técnica de aprendizaje Jigsaw.	Distribución de contenidos, investigación, análisis, contexto global, metodología JigSaw	Descripción detallada del escenario enfocada en el cambio climático, herramientas de investigación, comunicación y colaboración en línea.	El cambio climático es un desafío global que requiere una respuesta colectiva. \nEsta actividad busca no solo educar sobre el tema, sino también mejorar las habilidades de trabajo en equipo de los participantes.	Se examinará cómo el cambio climático afecta diversos aspectos de nuestro mundo y la importancia de la colaboración para abordar estos retos desde multiples perspectivas.	Los equipos evaluarán diferentes escenarios de cambio climático y discutirán cómo la cooperación puede mejorar los resultados.	Un equipo multidisciplinario colabora en una propuesta para una campaña de concienciación sobre el reciclaje y la reducción de residuos.						/activity/jigsaw	8
\.


--
-- Data for Name: answer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.answer (user_email, activity_id, question_number, answer_text, id) FROM stdin;
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comment (content, created_at, user_id, course_id, id) FROM stdin;
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course (content_id, title, category_id, description, id) FROM stdin;
1	Trabajo en equipo	1	En este curso aprenderás a comunicarte con tus compañeros, establecer roles, delegar tareas, tomar decisiones, manejar conflictos, motivar e inspirar al equipo, celebrar los éxitos y aprender de los errores. Dirigido a personas que buscan mejorar sus habilidades de trabajo en equipo, profesionales que quieren ascender en su carrera, emprendedores que quieren hacer crecer su negocio y estudiantes que quieren tener éxito en sus estudios.	1
2	Liderazgo	2	Desarrolla habilidades efectivas de liderazgo para potenciar tu influencia, motivar equipos y alcanzar el éxito en cualquier entorno. Aprende estrategias prácticas y técnicas probadas para liderar con claridad, inspirar confianza y promover un cambio positivo en tu organización y comunidad.	2
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (name, email, password, id) FROM stdin;
\.


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: answer answer_user_email_activity_id_question_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_user_email_activity_id_question_number_key UNIQUE (user_email, activity_id, question_number);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_advance(text, pg_lsn); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_advance(text, pg_lsn) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_create(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_create(text) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_drop(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_drop(text) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_oid(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_oid(text) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_progress(text, boolean); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_progress(text, boolean) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_session_is_setup(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_is_setup() TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_session_progress(boolean); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_progress(boolean) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_session_reset(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_reset() TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_session_setup(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_setup(text) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_xact_reset(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_reset() TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone) TO cloudsqlsuperuser;


--
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

