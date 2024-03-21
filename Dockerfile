FROM python:3.8

WORKDIR /usr/src/app

COPY app/ .

RUN pip install Flask flask-socketio flask-cors
RUN apt-get update && apt-get install -y g++ gcc
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

EXPOSE 5000

CMD ["python", "app.py"]