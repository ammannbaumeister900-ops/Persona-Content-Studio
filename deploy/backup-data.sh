#!/bin/sh
set -eu

docker run --rm --network none --user 1000:1000 \
  -v /opt/ip-studio/data:/data:ro \
  -v /opt/ip-studio/backups:/backups \
  -v /opt/ip-studio/deploy/backup-data.mjs:/backup-data.mjs:ro \
  node:24-bookworm-slim node /backup-data.mjs
