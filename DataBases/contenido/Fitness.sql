INSERT INTO course (
    id,
    title,
    category_id,
    content_id,
    description
) VALUES (
    '5',
    'Fitness',
    '5',
    '5',
    'Un curso sobre las estrategias y hábitos fundamentales para mejorar tu condición física y bienestar general.'
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
    14,
    '14',
    'comp',
    'Ejercicio para espalda',
    'Ejercer movimientos de la espalda para mejorar la estabilidad de la misma.',
    '',
    'Este minijuego te permitira ejercitar el movimiento de tu espalda, es importante que hagas los movimientos lentas y evitando lesionarte',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '/activity/FitnessEspalda',
    '5'
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
    15,
    '15',
    'comp',
    'Ejercicio para muñeca',
    'Desarrollar movimientos de la muñeca para mejorar la fuerza y flexibilidad de la misma.',
    '',
    '',
    'Este minijuego te permitira ejercitar el movimiento de tu muñeca, es importante que lo hagas con cuidado y sin forzar.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '/activity/FitnessMuñeca',
    '5'
);