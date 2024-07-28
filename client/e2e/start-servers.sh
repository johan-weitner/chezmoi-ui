#!/bin/bash

cd ..
pnpm stop && pnpm start:force &
cd client || exit