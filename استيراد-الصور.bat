@echo off
chcp 65001 >nul
echo ============================================
echo  استيراد التصاور الى موقع الاستاذ
echo ============================================
echo.
echo 1) حفظ كل تصاور الشات في مجلد واحد (مثلا: Desktop\tsawri)
echo 2) غادي تحل لك نافذة: اختار ذاك المجلد
echo.
pause
powershell -ExecutionPolicy Bypass -File "%~dp0import-photos.ps1"
echo.
pause
