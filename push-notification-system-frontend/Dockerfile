# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

FROM node:18.20.2-alpine as builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies required for the build)
RUN npm install

# Copy application source code
COPY . .

# Execute the production build command (creates files in ./build)
RUN npm run build

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage
# Uses a minimal base image, installs 'serve', and serves the static files.
# ----------------------------------------------------------------------
FROM node:18.20.2-alpine

# Install the 'serve' utility globally to act as a lightweight web server
RUN npm install -g serve

# Set the final working directory
WORKDIR /usr/share/nginx/html

# Copy the compiled static files from the 'builder' stage's /app/build folder
# This path must match your npm run build output directory!
COPY --from=builder /app/build .

# Expose the port where the static server will listen
EXPOSE 3000

# The command to serve the static files from the current directory
# The -s flag routes unknown requests to index.html (useful for SPAs)
CMD ["serve", "-s", ".", "-l", "3000"]