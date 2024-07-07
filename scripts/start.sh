#!/bin/bash
# clear

# If force start, kill processes hogging our ports
if [ "$1" = "-f" ]; then

  export "$(grep BACKEND_SRV_PORT "./server/.env")"
  export "$(grep FRONTEND_SRV_PORT "./client/.env")"

  pid=$(lsof -t -i :$BACKEND_SRV_PORT)
  if [ -n "$pid" ]; then
    echo "Killing process $pid"
    kill $pid
    echo "Killed process $pid using port $BACKEND_SRV_PORT"
    sleep 1
  fi

  pid=$(lsof -t -i :$FRONTEND_SRV_PORT)
  if [ -n "$pid" ]; then
  echo "Killing process $pid"
    kill $pid
    echo "Killed process $pid using port $FRONTEND_SRV_PORT"
    sleep 1
  fi

  if [ -f "/tmp/srvprocess.pid" ]; then
    rm /tmp/srvprocess.pid
  fi
  if [ -f "/tmp/clientprocess.pid" ]; then
    rm /tmp/clientprocess.pid
  fi

fi

cd server
node index.js &
pid=$!
echo $pid > /tmp/srvprocess.pid

cd ../client
pnpm run dev &
pid=$!
echo $pid > /tmp/clientprocess.pid

cd ..


