#!/usr/bin/env bash
# Builds MONGODB_URI — paste hostname EXACTLY from Atlas Connect → Drivers.
set -euo pipefail

ATLAS_USER="${ATLAS_USER:-jamesprabu18_db_user}"
DB_NAME="${DB_NAME:-smart-leads}"

echo "=== MongoDB Atlas connection helper ==="
echo ""
echo "In Atlas: Database → Connect → Drivers → copy the connection string."
echo "Copy ONLY the hostname (between @ and /), e.g. cluster0.xxxxx.mongodb.net"
echo ""
read -rp "Paste cluster hostname from Atlas: " ATLAS_HOST
ATLAS_HOST="${ATLAS_HOST#mongodb+srv://}"
ATLAS_HOST="${ATLAS_HOST%%/*}"
ATLAS_HOST="${ATLAS_HOST##*@}"

if [[ -z "${ATLAS_HOST}" ]] || [[ "$ATLAS_HOST" != *mongodb.net* ]]; then
  echo "Error: hostname must look like cluster0.xxxxx.mongodb.net" >&2
  exit 1
fi

echo ""
echo "Atlas user: ${ATLAS_USER}"
echo "Cluster:    ${ATLAS_HOST}"
echo ""
read -rsp "Paste your Atlas database password: " PASS
echo ""

if [[ -z "${PASS}" ]]; then
  echo "Error: password cannot be empty." >&2
  exit 1
fi

ENC_PASS=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${PASS}")

URI="mongodb+srv://${ATLAS_USER}:${ENC_PASS}@${ATLAS_HOST}/${DB_NAME}?retryWrites=true&w=majority"

echo ""
echo "=== MONGODB_URI (copy this into Render) ==="
echo "${URI}"
echo "=========================================="

if command -v pbcopy >/dev/null 2>&1; then
  printf '%s' "${URI}" | pbcopy
  echo "(Copied to clipboard)"
fi
