# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# copy entire monorepo so build context includes all apps/packages
COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY code ./code
COPY coding ./coding
COPY collaborate ./collaborate

# install dependencies at root (if any) and then build frontend
# note: the root package.json is just the vite config; actual Next app
# lives in apps/frontend.

WORKDIR /app/apps/frontend
RUN npm ci
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# copy only what's needed for runtime
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/package*.json ./apps/frontend/
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

# expose the port Next.js listens on
EXPOSE 3000

# use the frontend's start script
WORKDIR /app/apps/frontend
CMD ["npm", "run", "start"]
