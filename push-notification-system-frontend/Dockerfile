


FROM node:18.20.2-alpine 

WORKDIR /usr/share/nginx/html
# Install full dependencies required for building (not production-only)
# COPY package.json package-lock.json .
# RUN npm ci --only=production

# Copy source code
COPY build .


# Build-time arg → env for CRA (must be REACT_APP_ prefix)


# # Reduce memory/CPU pressure during build on small servers
# ENV NODE_OPTIONS=--max_old_space_size=1024
# ENV GENERATE_SOURCEMAP=false

# RUN npm run build
# # The compiled static files are now ready at /app/dist

# # ----------------------------------------------------------------------
# # Stage 2: Production/Runtime Stage (Serves the files via NGINX)
# # ----------------------------------------------------------------------
# FROM nginx:alpine

# COPY --from=builder /app/build /usr/share/nginx/html
