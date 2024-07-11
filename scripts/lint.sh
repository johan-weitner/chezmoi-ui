if [ "$1" = "-f" ]; then
  cd server &&
  pnpm run lint:fix &&
  cd ../client &&
  pnpm run lint:fix &&
  cd ..
else
  cd server &&
  pnpm run lint &&
  cd ../client &&
  pnpm run lint &&
  cd ..
fi
