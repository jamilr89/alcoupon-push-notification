# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# Stage 1: Build frontend
# FROM node:18.20.2-alpine AS builder

# WORKDIR /app

# ARG API_URL
# ARG FRONTEND_URL

# # Install dependencies
# COPY package.json package-lock.json ./
# RUN npm ci --only=production

# # Copy source and build
# COPY . .
# RUN REACT_APP_API_URL=$API_URL \
# REACT_APP_FRONTEND_URL=$FRONTEND_URL \
# npm run build

# # Stage 2 — nginx serving static files
# FROM nginx:stable-alpine AS runtime

# # Remove default conf and copy our config
# RUN rm /etc/nginx/conf.d/default.conf
# COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

# # Copy the built static files from builder
# COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


FROM node:18.20.2-alpine AS builder

WORKDIR /app
# Install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Copy source code and build
COPY . .

# CRITICAL FIX: Set build-time environment variables before running the build.
# EXAMPLE: Injecting the API URL into the React/Vue/Angular build process.
# This variable must be prefixed correctly (e.g., REACT_APP_, VUE_APP_) 
# to be recognized by the frontend framework.
# Note: Since the backend is accessible at /api/ (via the reverse proxy), 
# the API URL during build should usually be empty or just '/'.
ARG API_URL=http://api:4000/
ENV REACT_APP_API_URL=${API_URL}

RUN npm run build
# The compiled static files are now ready at /app/dist

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage (Serves the files via NGINX)
# ----------------------------------------------------------------------
FROM nginx:alpine

# CRITICAL STEP: Copy the built files from the 'builder' stage 
# into the NGINX default serving directory.
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 as the internal application port
EXPOSE 80

