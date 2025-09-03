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

CREATE_RESUME_TEST_DATA = [
    (
        TEST_RESUMES[0],
        200
    ),
    (
        TEST_RESUMES[1],
        200
    ),
    (
        TEST_RESUMES[0]["content"],
        422
    ),
]

GET_USER_RESUMES_TEST_DATA = [
    (
        [
            TEST_RESUMES[0],
            TEST_RESUMES[1],
        ],
        2,
        200
    ),
]

UPDATE_RESUME_TEST_DATA = [
    (
        1,
        {
            "title": "Middle Frontend-разработчик",
            "content": "3+ года коммерческого опыта. Разработка SPA на React/TypeScript, Angular. Zustand, React Query, "
                           "Material-UI. Адаптивная верстка, оптимизация производительности. Участие в SCRUM-процессах, "
                           "опыт менторства junior-разработчиков."
        },
        200
    ),
    (
        1,
        {
            "title": "Fullstack-разработчик",
        },
        422
    ),
    (
        1,
        {
            "content": "Опыт работы: 3 года. Разработка высоконагруженных API на Flask. Работа с "
                           "PostgreSQL, Redis, Docker. Участие в полном цикле разработки от проектирования до деплоя. "
                           "Оптимизация производительности, написание тестов (pytest), код-ревью.",
        },
        422
    ),
    (
        2,
        {
            "title": "Fullstack-разработчик",
            "content": "Опыт работы: 4 года. Разработка высоконагруженных API на Flask. Работа с "
                           "PostgreSQL, Redis, Docker. Участие в полном цикле разработки от проектирования до деплоя. "
                           "Оптимизация производительности, написание тестов (pytest), код-ревью."
        },
        404
    )
]


GET_RESUME_DATA = [
    (
        0,
        TEST_RESUMES[0],
        200
    ),
    (
        1,
        TEST_RESUMES[1],
        200
    ),
    (
        2,
        TEST_RESUMES[1],
        404
    ),
]

DELETE_RESUME_DATA = [
    (
        0,
        TEST_RESUMES[0],
        200,
        1
    ),
    (
        2,
        TEST_RESUMES[0],
        404,
        2
    ),
    (
        1,
        TEST_RESUMES[1],
        200,
        1
    ),
]


IMPROVE_RESUME_TEST_DATA = [
    (
        0,
        {
            "content": "Опыт работы: 3 года. Разработка высоконагруженных API на FastAPI и Django. Работа с "
                           "PostgreSQL, Redis, Docker. Участие в полном цикле разработки от проектирования до деплоя. "
                           "Оптимизация производительности, написание тестов (pytest), код-ревью.\n[improved]"
        },
        200
    ),
    (
        1,
        {
            "content": "2+ года коммерческого опыта. Разработка SPA на React/TypeScript. Zustand, React Query, "
                       "Material-UI. Адаптивная верстка, оптимизация производительности. Участие в SCRUM-процессах, "
                       "опыт менторства junior-разработчиков.\n[improved]"
        },
        200
    ),
    (
        2,
        {
            "content": "2+ года коммерческого опыта. Разработка SPA на React/TypeScript. Zustand, React Query, "
                       "Material-UI. Адаптивная верстка, оптимизация производительности. Участие в SCRUM-процессах, "
                       "опыт менторства junior-разработчиков.\n[improved]"
        },
        404
    ),
]

TEST_HISTORIES_INDEXES = [
    0,
    1,
    0
]

TEST_HISTORIES_DATA = [
    {
        "old_content": TEST_RESUMES[0]["content"],
        "new_content": TEST_RESUMES[0]["content"] + "\n[improved]"

    },
    {
        "old_content": TEST_RESUMES[1]["content"],
        "new_content": TEST_RESUMES[1]["content"] + "\n[improved]"
    }
]

GET_RESUME_HISTORY_DATA = [
    (
        0,
        [
            TEST_HISTORIES_DATA[0],
            {
                "old_content": TEST_RESUMES[0]["content"] + "\n[improved]",
                "new_content": TEST_RESUMES[0]["content"] + "\n[improved]\n[improved]"
            },
        ],
        200
    ),
    (
        1,
        [TEST_HISTORIES_DATA[1]],
        200
    ),
    (
        2,
        TEST_HISTORIES_DATA[0],
        404
    )
]

GET_USER_HISTORY_TEST_DATA = [
    (
        [
            TEST_HISTORIES_DATA[0],
            TEST_HISTORIES_DATA[1],
            {
                "old_content": TEST_RESUMES[0]["content"] + "\n[improved]",
                "new_content": TEST_RESUMES[0]["content"] + "\n[improved]\n[improved]"
            },
        ],
        3,
        200
    ),
]

DELETE_RESUME_HISTORY_DATA = [
    (
        0,
        [
            TEST_HISTORIES_DATA[0],
            {
                "old_content": TEST_RESUMES[0]["content"] + "\n[improved]",
                "new_content": TEST_RESUMES[0]["content"] + "\n[improved]\n[improved]"
            },
        ],
        200,
        1
    ),
    (
        2,
        [TEST_HISTORIES_DATA[0]],
        404,
        3
    ),
    (
        1,
        [TEST_HISTORIES_DATA[1]],
        200,
        2
    ),
]
