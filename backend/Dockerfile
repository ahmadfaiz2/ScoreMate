# Image produksi backend Laravel ScoreMate (Docker — untuk EasyPanel/VPS).
# PHP 8.4 + Apache, terhubung ke Supabase (PostgreSQL).
FROM php:8.4-apache

# 1) Paket sistem + ekstensi PHP. Supabase = PostgreSQL → wajib pdo_pgsql.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev unzip git \
    && docker-php-ext-install pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# 2) Composer (disalin dari image resmi).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 3) Salin kode aplikasi (file rahasia dikecualikan lewat .dockerignore).
COPY . .

# 4) Install dependency PHP (mode produksi, tanpa script artisan saat build).
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && chown -R www-data:www-data storage bootstrap/cache

# 5) Arahkan docroot Apache ke folder public/.
COPY docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# 6) Entrypoint: set port, optimasi config, migrate, lalu jalankan Apache.
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
