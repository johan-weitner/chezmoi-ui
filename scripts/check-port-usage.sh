#!/bin/bash
export "$(grep BACKEND_SRV_PORT "./server/.env")"
export "$(grep FRONTEND_SRV_PORT "./client/.env")"

echo "Checking backend server port ($BACKEND_SRV_PORT)..."
lsof -i :"$BACKEND_SRV_PORT"
echo ""

echo "Checking frontend server port ($FRONTEND_SRV_PORT)..."
lsof -i :"$FRONTEND_SRV_PORT"
echo ""