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
RUN REACT_APP_API_URL=$API_URL \
RUN REACT_APP_FRONTEND_URL=$FRONTEND_URL \

RUN npm run build

# Stage 2 — nginx serving static files
FROM nginx:stable-alpine AS runtime

# Remove default conf and copy our config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from builder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

