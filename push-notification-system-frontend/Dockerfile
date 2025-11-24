# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# Stage 1: Build frontend
FROM node:18.20.2-alpine AS builder

WORKDIR /app

ARG API_URL
ARG FRONTEND_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build