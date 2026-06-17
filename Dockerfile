# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
RUN apk add --no-cache curl \
  && addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nodejs:nodejs /app/.next/static ./.next/static
USER nodejs
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
