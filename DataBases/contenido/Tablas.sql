CREATE TABLE public.activity (
    activity_id VARCHAR NOT NULL,
    course_id VARCHAR NOT NULL,
    content_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    objective VARCHAR NOT NULL,
    metodology VARCHAR NOT NULL,
    resources VARCHAR NOT NULL,
    introduction VARCHAR NOT NULL,
    analisis VARCHAR NOT NULL,
    evaluation VARCHAR NOT NULL,
    example VARCHAR NOT NULL,
    question1 VARCHAR NOT NULL,
    question2 VARCHAR NOT NULL,
    question3 VARCHAR NOT NULL,
    question4 VARCHAR NOT NULL,
    question5 VARCHAR NOT NULL,
    path VARCHAR NOT NULL,
    id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.answer (
    user_email VARCHAR NOT NULL,
    activity_id VARCHAR NOT NULL,
    question_number INTEGER NOT NULL,
    answer_text VARCHAR NOT NULL,
    id INTEGER NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT answer_user_email_activity_id_question_number_key UNIQUE (user_email, activity_id, question_number)
);

CREATE TABLE public.comment (
    content VARCHAR NOT NULL,
    created_at VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    course_id VARCHAR NOT NULL,
    id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public.course (
    content_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    category_id VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE public."user" (
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    id INTEGER NOT NULL,
    PRIMARY KEY (id)
);


/*EJECUTAR LUEGO DE LA OTRA SI NO PUEDE QUE SE BUGUEE*/

CREATE SEQUENCE public.user_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


