CREATE TABLE "answer" (
id integer PRIMARY KEY NOT NULL,
user_email character varying NOT NULL,
activity_id character varying NOT NULL,
question_number integer NOT NULL,
answer_text character varying NOT NULL);

CREATE TABLE "user" (
id integer PRIMARY KEY NOT NULL,
name character varying NOT NULL,
email character varying NOT NULL,
password character varying NOT NULL);

CREATE TABLE "course" (
id character varying PRIMARY KEY NOT NULL,
title character varying NOT NULL,
category_id character varying NOT NULL,
content_id character varying NOT NULL,
description character varying NOT NULL);

CREATE TABLE "achievements" (
id character varying PRIMARY KEY NOT NULL,
courseId character varying NOT NULL,
name character varying NOT NULL,
description character varying NOT NULL,
userId integer NOT NULL);

CREATE TABLE "comments" (
id character varying PRIMARY KEY NOT NULL,
content character varying NOT NULL,
createdAt TIMESTAMP NOT NULL,
courseId character varying NOT NULL,
userId integer NOT NULL);

CREATE TABLE "activity" (
id integer PRIMARY KEY NOT NULL,
activity_id character varying UNIQUE NOT NULL,
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
course_id character varying NOT NULL);

ALTER TABLE "answer" ADD CONSTRAINT answer_activity_id_activity_activity_id FOREIGN KEY (activity_id) REFERENCES activity(activity_id);
ALTER TABLE "achievements" ADD CONSTRAINT achievements_courseId_course_id FOREIGN KEY (courseId) REFERENCES course(id);
ALTER TABLE "achievements" ADD CONSTRAINT achievements_userId_user_id FOREIGN KEY (userId) REFERENCES "user"(id);
ALTER TABLE "comments" ADD CONSTRAINT comments_courseId_course_id FOREIGN KEY (courseId) REFERENCES course(id);
ALTER TABLE "comments" ADD CONSTRAINT comments_userId_user_id FOREIGN KEY (userId) REFERENCES "user"(id);
ALTER TABLE "activity" ADD CONSTRAINT activity_course_id_course_id FOREIGN KEY (course_id) REFERENCES course(id);

INSERT INTO course (
    id,
    title,
    category_id,
    content_id,
    description
) VALUES (
    '3',
    'Organización y Productividad',
    '3',
    '3',
    'Aprenderas tecnicas y estrategias para mejorar tu organización y concentración. Todo para que lo apliques en tus actividades cotidianas.'
);

INSERT INTO course (
    id,
    title,
    category_id,
    content_id,
    description
) VALUES (
    '4',
    'Finanzas Personales',
    '4',
    '4',
    'Aprenderas estrategias y habitos que mejoraran tu estabilidad financiera. Controlando mejor tus compras, gastos, ahorros e ingresos.'
);

INSERT INTO activity (
    id,
    activity_id,
    content_type,
    title,
    objective,
    metodology,
    resources,
    introduction,
    analisis,
    evaluation,
    example,
    question1,
    question2,
    question3,
    question4,
    question5,
    path,
    course_id
) VALUES (
    9,
    '9',
    'comp',
    'Serpiente Eisenhower',
    'Alcanzar el mayor puntaje posible.',
    'Organizacion y concentración.',
    '',
    'Este juego de la serpiente tienes caracteristicas nuevas, es posible que por su nombre ya tengas una idea de como ganar.',
    '',
    'Segun la cantidad de intentos y tu puntaje, se decidira tu calificación.',
    '',
    '',
    '',
    '',
    '',
    '',
    '/activity/SerpienteEisenhower',
    '3'
);

INSERT INTO activity (
    id,
    activity_id,
    content_type,
    title,
    objective,
    metodology,
    resources,
    introduction,
    analisis,
    evaluation,
    example,
    question1,
    question2,
    question3,
    question4,
    question5,
    path,
    course_id
) VALUES (
    12,
    '12',
    'comp',
    'Simulador de Finanzas',
    'Desarrollar planes o estrategias para incrementar tus ahorros o encontrar un balance entre ingresos y egresos.',
    '',
    '',
    'Este simulador te permitira tener un vista diferente sobre tus finanzas. ayudandote a ver la importancia de la toma de deciciones sobre las finanzas personales.',
    '',
    'Basado en el equilibrio de ingresos y egresos. Tambien teniendo en cuenta los ahorros o elecciones.',
    '',
    '',
    '',
    '',
    '',
    '',
    '/activity/SimuladorFinanzas',
    '4'
);