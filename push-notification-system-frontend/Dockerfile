FROM node:20 AS builder



WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .



# CRUCIAL: Run the build command

RUN npm run build