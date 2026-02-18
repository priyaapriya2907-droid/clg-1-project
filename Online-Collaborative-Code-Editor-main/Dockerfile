# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY code ./code
COPY coding ./coding
COPY collaborate ./collaborate

RUN npm ci
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages

EXPOSE 5173

CMD ["npm", "run", "dev"]
