FROM node:18.20.2-alpine

WORKDIR /app

COPY package.json package-lock.json .



RUN npm i 

COPY . .

CMD ["npm","start"]

