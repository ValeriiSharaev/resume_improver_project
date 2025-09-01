# Менеджер задач

Backend приложение на FastAPI для менеджмента задач

## Установка

```bash
git clone https://gitlab.com/orrond/task_manager.git
cd task_manager
```

## Использование

Пример запуска программы:

### Docker-Compose: 

запустить докер и ввести в терминале команду:

```bash
docker compose up
```

### Напрямую: 
поменять данные в .env и .test.env для подключения к postgresql, применить миграции и запустить проект
```bash
cd task_manager
pip install -r requirements.txt
alembic upgrade head
pytest # для запуска тестов
python main.py
```

## TO-DO
1. ~~Добавить lifespan~~
2. ~~Написать интеграционные тесты~~
3. Переделать тесты с pytest на gauge
4. Устроиться на работу
