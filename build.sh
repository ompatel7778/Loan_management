#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== [1/3] Installing Python Backend Dependencies ==="
pip install -r requirements.txt

echo "=== [2/3] Installing Node Frontend Dependencies ==="
cd frontend
npm install

echo "=== [3/3] Building Production Vite Frontend Asset Bundle ==="
npm run build
cd ..

echo "=== Build Complete! Ready for Gunicorn Deployment ==="
