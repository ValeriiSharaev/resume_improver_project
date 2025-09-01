# Менеджер задач

Backend приложение на FastAPI для менеджмента задач

## Установка

```bash
git git remote add origin https://gitlab.com/orrond/resume_improver.git
cd resume_improver
```

## Использование

### Пример запуска программы:

Указать в .env и .test.env файлах DB_HOST=localhost и выполнить команды:

```bash
pip install -r requirements.txt
pytest 
python main.py
```
Swagger приложения будет доступен по адресу http://localhost:8000/docs#/

Можно также запустить приложение через docker compose. Для этого надо указать в .env и .test.env файлах DB_HOST=pg, запустить Docker Desktop и выполнить команды: 

```bash
docker compose pull
docker compose up
```
Swagger приложения будет доступен по адресу http://localhost:8000/docs#/  
Также можно зайти в pgadmin по адресу http://localhost:5050/

## TO-DO
Устроиться на работу
