FROM node:18.20.2-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm i --clean

COPY . .

CMD ["npm","start"]

