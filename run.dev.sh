#!/usr/bin/env bash
set -e
( cd backend && cp -n .env.example .env || true && npm run dev ) &
( cd frontend && cp -n .env.example .env || true && npm run dev ) &
wait
