@echo off
:: TripPulse AI — Dev Server Launcher
:: This script bypasses the & character issue in the folder name
:: by using the local node_modules/.bin/vite directly

echo Starting TripPulse AI Dev Server...
node_modules\.bin\vite
