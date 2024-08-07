#!/usr/bin/env pwsh

Write-Output "***** Chezmoi UI Setup *****"

Copy-Item -Path "client/.env.example" -Destination "client/.env"
Copy-Item -Path "server/.env.example" -Destination "server/.env"

npm install -g pnpm
pnpm install

Push-Location "server"
pnpx prisma migrate dev --schema=./prisma/schema.prisma
Pop-Location

Write-Output "***** Done. *****"
Write-Output "Run 'pnpm start' to start the app."
Write-Output "Alternatively, run 'docker-compose up' in the root directory."