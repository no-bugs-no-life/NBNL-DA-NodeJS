@echo off
echo Đang tiến hành build giao diện (Frontend)...
call pnpm build
if %ERRORLEVEL% neq 0 (
    echo Xảy ra lỗi trong quá trình build!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Đang khởi động server (Frontend)...
call pnpm start
pause
