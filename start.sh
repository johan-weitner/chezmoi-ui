#!/bin/bash
# clear
cd server
node index.js &
pid=$!
echo $pid > /tmp/srvprocess.pid

cd ../client
pnpm run dev &
pid=$!
echo $pid > /tmp/clientprocess.pid

cd ..