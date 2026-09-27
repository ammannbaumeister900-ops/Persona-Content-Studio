#!/bin/sh
set -eu

docker run --rm \
  -v /opt/dify/docker/volumes/certbot/www:/var/www/html \
  -v /opt/ip-studio/certbot:/etc/letsencrypt \
  certbot/certbot:latest renew --quiet --no-random-sleep-on-renew

docker compose --project-directory /opt/ip-studio -f /opt/ip-studio/compose.yaml \
  exec -T proxy nginx -s reload
