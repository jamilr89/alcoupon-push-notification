# FROM node:20 AS builder



# WORKDIR /app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .



# RUN npm run build

FROM node:18.20.2-alpine as builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies required for the build)
RUN npm install

# Copy application source code
COPY . .

# Execute the production build command. 
# ASSUMPTION: This command generates static files into a '/app/dist' folder.
RUN npm run build

# ----------------------------------------------------------------------
# Stage 2: Production/Runtime Stage
# Uses a minimal base image and only serves the static, compiled files.
# This results in a very small final image.
# ----------------------------------------------------------------------
FROM node:18.20.2-alpine

# Set the final working directory
WORKDIR /app

# Copy the compiled static files from the 'builder' stage
# Adjust 'dist' if your build output folder is different (e.g., 'build')
COPY --from=builder /app/build ./build  

# Expose the port where the static server will listen
EXPOSE 3000

# The command to serve the static files. 
# ASSUMPTION: We'll use a simple static server package, or the start script
# should be configured to serve the contents of the 'dist' folder.
# We'll use a placeholder CMD here; typically, you'd use a lightweight web server (like NGINX).
# If your package.json 'start' serves the static files:
CMD ["npm", "start"]
