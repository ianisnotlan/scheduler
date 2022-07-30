# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /scheduler

COPY ./requirements.txt /scheduler/requirements.txt

RUN apt-get update \
    && apt-get install -y curl \
    && apt-get install -y build-essential \
    && pip3 install -r /scheduler/requirements.txt

COPY ./src /scheduler/src

WORKDIR /scheduler/src

RUN python3 manage.py collectstatic --noinput \
    && python3 manage.py makemigrations \
    && python3 manage.py migrate

CMD uwsgi --ini uwsgi.ini