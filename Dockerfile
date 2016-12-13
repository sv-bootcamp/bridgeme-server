FROM node:argon
MAINTAINER Bridgeme <yoda.mentor.lab@gmail.com>

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

CMD [ "npm", "start" ]
