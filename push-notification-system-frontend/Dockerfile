FROM node:20 AS builder



WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production 

COPY . .



# CRUCIAL: Run the build command

RUN npm run build