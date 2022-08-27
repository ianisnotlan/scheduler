# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /scheduler

COPY ./requirements.txt /scheduler/requirements.txt

RUN apt-get update \
    && apt-get install -y curl \
    && apt-get install -y build-essential \
    && apt install -y libmariadb-dev-compat libmariadb-dev \
    && pip3 install -r /scheduler/requirements.txt

COPY ./src /scheduler/src

WORKDIR /scheduler/src

RUN python3 manage.py collectstatic --noinput --settings=src.prod

CMD uwsgi --ini uwsgi.ini