#!/bin/sh
set -eu

case "${1:-}" in
  staging)
    store=/opt/ip-studio/certbot-staging
    staging=--staging
    ;;
  production)
    store=/opt/ip-studio/certbot
    staging=
    ;;
  *)
    echo 'usage: issue-ip-cert.sh staging|production' >&2
    exit 2
    ;;
esac

mkdir -p "$store"
docker run --rm \
  -v /opt/dify/docker/volumes/certbot/www:/var/www/html \
  -v "$store":/etc/letsencrypt \
  certbot/certbot:latest certonly \
    $staging --non-interactive --agree-tos --register-unsafely-without-email \
    --preferred-profile shortlived \
    --webroot --webroot-path /var/www/html \
    --ip-address 134.175.189.189
