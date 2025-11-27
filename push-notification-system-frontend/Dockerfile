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
# Install full dependencies required for building (not production-only)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build-time arg → env for CRA (must be REACT_APP_ prefix)
ARG API_URL=http://api:4000/
ENV REACT_APP_API_URL=${API_URL}

# Reduce memory/CPU pressure during build on small servers
ENV NODE_OPTIONS=--max_old_space_size=1024
ENV GENERATE_SOURCEMAP=false

RUN npm run build
# The compiled static files are now ready at /app/dist

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage (Serves the files via NGINX)
# ----------------------------------------------------------------------
FROM nginx:alpine

# remove default and copy custom nginx conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

