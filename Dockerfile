FROM node:18

WORKDIR /usr/app
COPY package.json .

RUN npm install --force
COPY . .
RUN npm start

EXPOSE 3000