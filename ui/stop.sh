#!/bin/bash

if [ -f /tmp/clientprocess.pid ]; then
  pid=$(cat /tmp/clientprocess.pid)
  echo "Stopping process with PID: $pid"
  kill $pid
  rm /tmp/clientprocess.pid
  echo "Web server process with PID $pid has been stopped."
else
  echo "Web server PID file not found. Is the process running?"
fi

if [ -f /tmp/srvprocess.pid ]; then
  pid=$(cat /tmp/srvprocess.pid)
  echo "Stopping process with PID: $pid"
  kill $pid
  rm /tmp/srvprocess.pid
  echo "Backend process with PID $pid has been stopped."
else
  echo "Backend PID file not found. Is the process running?"
fi
