@echo off
echo ===================================
echo [FRONTEND] Building application...
echo ===================================
call pnpm build

echo.
echo ===================================
echo [FRONTEND] Starting server...
echo ===================================
call pnpm start
