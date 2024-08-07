@echo off

echo ***** Chezmoi UI Setup *****

copy "client\.env.example" "client\.env"
copy "server\.env.example" "server\.env"

npm install -g pnpm
pnpm install

pushd "server"
npx prisma migrate dev --schema=./prisma/schema.prisma
popd

echo ***** Done. *****
echo Run 'pnpm start' to start the app.
echo Alternatively, run 'docker-compose up' in the root directory.