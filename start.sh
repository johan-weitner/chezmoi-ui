#!/bin/bash

cd server
node index.js &
pid=$!
echo $pid > /tmp/srvprocess.pid

echo "Started UI backend with PID: $pid"

cd ../client
pnpm run dev &
pid=$!
echo $pid > /tmp/clientprocess.pid

echo "Started UI webserver with PID: $pid"

cd ..