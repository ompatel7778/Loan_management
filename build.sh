#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== [1/3] Installing Python Dependencies ==="
pip install --upgrade pip
pip install -r requirements.txt

echo "=== [2/3] Installing Frontend Node Dependencies ==="
cd frontend
npm install

echo "=== [3/3] Building Production Vite Bundle ==="
npm run build
cd ..

echo "=== Build Completed Successfully! ==="
