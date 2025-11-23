# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# ----------------------------------------------------------------------
# Stage 1: Builder Stage
# Installs dependencies and compiles the frontend application
# ----------------------------------------------------------------------
# ----------------------------------------------------------------------
# Stage 1: Builder Stage
# Installs dependencies and compiles the frontend application
# ----------------------------------------------------------------------
FROM node:18.20.2-alpine AS builder

WORKDIR /app
# Copy package files first to leverage Docker cache for npm install
COPY package.json package-lock.json ./
RUN npm install
# Copy remaining source code
COPY . .
# Run the build command (creates /app/build)
RUN npm run build
# The compiled static files are now ready at /app/build inside this layer.

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage (NGINX)
# Uses a minimal NGINX base image to serve the static files.
# ----------------------------------------------------------------------
FROM nginx:alpine

# Copy the compiled static files from the 'builder' stage's /app/build folder
# NGINX's default serving path is /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html

# Expose NGINX's default port (80)
EXPOSE 80