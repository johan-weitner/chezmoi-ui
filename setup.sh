#!/bin/bash

echo "***** Chezmoi UI Setup *****"

cp client/.env.example client/.env
cp server/.env.example server/.env

pnpm installDeps

# pnpm i -g turbo

echo "***** Done. *****"
echo "Run 'start.sh' (or start.ps1 on Windows) to start the app."
echo "Alternatively, run 'docker-compose up' in the root directory."