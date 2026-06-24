#!/bin/sh
set -e

# Apache harus mendengarkan port yang diberikan Render (default 80 untuk lokal).
PORT="${PORT:-80}"
echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed -i "s/__PORT__/${PORT}/g" /etc/apache2/sites-available/000-default.conf
grep -q "ServerName" /etc/apache2/apache2.conf || echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Optimasi Laravel untuk produksi (config di-cache dari environment Render).
php artisan package:discover --ansi || true
php artisan config:cache

# Terapkan skema database ke Supabase (idempotent: hanya migrasi yang tertunda).
php artisan migrate --force

# Jalankan Apache sebagai proses utama container.
exec apache2-foreground
