TEST_REGISTRATION_DATA = {
    "email": "test_email@test.com",
    "password": "test_password"
}

TEST_LOGIN_DATA = {
    "username": "test_email@test.com",
    "password": "test_password"
}


TEST_RESUMES = [
    {
        "title": "Backend-разработчик",
        "content": "Опыт работы: 3 года. Разработка высоконагруженных API на FastAPI и Django. Работа с "
                       "PostgreSQL, Redis, Docker. Участие в полном цикле разработки от проектирования до деплоя. "
                       "Оптимизация производительности, написание тестов (pytest), код-ревью."
    },
    {
        "title": "Frontend-разработчик",
        "content": "2+ года коммерческого опыта. Разработка SPA на React/TypeScript. Zustand, React Query, "
                       "Material-UI. Адаптивная верстка, оптимизация производительности. Участие в SCRUM-процессах, "
                       "опыт менторства junior-разработчиков."
    },
]


CREATE_RESUME_TEST_DATA = TEST_RESUMES[0]


UPDATE_RESUME_TEST_DATA = {
    "title": "Middle Frontend-разработчик",
    "content": "3+ года коммерческого опыта. Разработка SPA на React/TypeScript, Angular. Zustand, React Query, "
                   "Material-UI. Адаптивная верстка, оптимизация производительности. Участие в SCRUM-процессах, "
                   "опыт менторства junior-разработчиков."
}

IMPROVE_RESUME_TEST_DATA = {
    "title": "Backend-разработчик",
    "content": "Опыт работы: 3 года. Разработка высоконагруженных API на FastAPI и Django. Работа с "
                       "PostgreSQL, Redis, Docker. Участие в полном цикле разработки от проектирования до деплоя. "
                       "Оптимизация производительности, написание тестов (pytest), код-ревью.\n[improved]"
}

