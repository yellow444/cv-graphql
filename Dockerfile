# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
# OpenSSL нужен движку миграций Prisma
RUN apk add --no-cache openssl
WORKDIR /app

# Зависимости отдельным слоем: он пересобирается, только когда меняются package-lock.json или схема.
# postinstall генерирует Prisma Client, поэтому схема копируется до npm ci.
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build && npm prune --omit=dev

# Итоговый образ: только собранный код, prod-зависимости и миграции, запуск не от root.
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package.json /app/prisma.config.ts ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma/migrations ./prisma/migrations
COPY --from=build --chown=node:node /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=node:node docker-entrypoint.sh ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
