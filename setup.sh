#!/bin/bash

echo "***** Chezmoi UI Setup *****"

cp client/.env.example client/.env
cp server/.env.example server/.env

npm i -g pnpm
pnpm installDeps

cd server/ && pnpx prisma migrate dev --schema=./prisma/schema.prisma && cd ..

echo "***** Done. *****"
echo "Run 'pnpm start' to start the app."
echo "Alternatively, run 'docker-compose up' in the root directory."
