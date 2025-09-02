FROM python:3.12.8-bookworm

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

CMD ["/bin/bash", "-c","/app/entrypoint.sh"]