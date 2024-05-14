FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

COPY next.config.mjs .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.js .
COPY .env .
COPY prisma ./prisma
COPY docker/dev/ecosystem.config.js .

RUN npm install pm2 -g

ENV NEXT_TELEMETRY_DISABLED 1
