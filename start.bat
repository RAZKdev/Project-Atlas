@echo off
chcp 65001 >nul
title Project Atlas — 195 Negara, 1 Cerita
color 0B

:: Pindah ke direktori skrip ini berada
cd /d "%~dp0"

cls
echo =======================================================================
echo          PROJECT ATLAS — 195 NEGARA, 1 CERITA
echo          Aplikasi Arsip Perjalanan, Atlas 3D ^& Museum Mini
echo =======================================================================
echo.

:: 1. Cek apakah Node.js sudah terpasang
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan di komputer Anda!
    echo Silakan pasang Node.js terlebih dahulu melalui https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Cek apakah folder node_modules sudah ada
if not exist "node_modules\" (
    echo [INFO] Direktori dependensi belum ditemukan.
    echo [INFO] Menjalankan 'npm install'... Mohon tunggu sebentar...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Terjadi kegagalan saat mengunduh paket dependensi.
        pause
        exit /b 1
    )
    echo.
    echo [BERHASIL] Dependensi selesai dipasang!
    echo.
)

:: 3. Jalankan server lokal Vite dan buka browser secara otomatis
echo [INFO] Memulai server lokal Vite...
echo [INFO] Peramban web akan terbuka otomatis di http://localhost:5173/
echo [INFO] Tekan [Ctrl + C] di jendela ini jika ingin mematikan server.
echo.
echo -----------------------------------------------------------------------

call npm run dev -- --open

echo.
echo [INFO] Server telah dinonaktifkan.
pause
