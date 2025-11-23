# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# ----------------------------------------------------------------------
# Stage 1: Builder Stage
# Installs dependencies and compiles the frontend application
# ----------------------------------------------------------------------
FROM node:18.20.2-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
# Compiled static files are now ready at /app/build inside this layer.

# ----------------------------------------------------------------------
# Stage 2: Minimal Base Stage
# This stage is just a tiny image used to run the 'cp' command in docker-compose.yml
# ----------------------------------------------------------------------
FROM alpine
WORKDIR /app