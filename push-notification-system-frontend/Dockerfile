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
# Copy package files first to leverage Docker cache for npm install
COPY package.json package-lock.json ./
RUN npm install
# Copy remaining source code
COPY . .
# Run the build command
RUN npm run build
# The compiled static files are now ready at /app/dist (or /app/build) inside this layer.

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage (NGINX)
# Uses a minimal NGINX base image to serve the static files.
# ----------------------------------------------------------------------
FROM nginx:alpine

# CRITICAL FIX: Changed the source folder to /app/dist 
# This copies the compiled static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80