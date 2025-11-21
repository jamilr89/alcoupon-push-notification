FROM node:20 AS builder



WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .



RUN npm run build