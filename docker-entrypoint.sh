#!/bin/sh
# Старт контейнера: миграции, сид, приложение.
# Каждый шаг идемпотентен, поэтому контейнер можно перезапускать сколько угодно.
set -e

echo "Applying database migrations..."
./node_modules/.bin/prisma migrate deploy

echo "Seeding database..."
node dist/prisma/seed/seed.js

echo "Starting application..."
exec node dist/src/main.js
