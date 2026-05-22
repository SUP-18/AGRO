#!/usr/bin/env bash
# Build script for Render deployment
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Seed the database with default admin/farmer accounts and crop metadata
python migrations/init_db.py

