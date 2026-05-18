#!/usr/bin/env bash
# Builds MONGODB_URI from your Atlas password (Atlas UI is copy-only — edit here instead).
set -euo pipefail

ATLAS_USER="${ATLAS_USER:-jamesprabu18_db_user}"
ATLAS_HOST="${ATLAS_HOST:-cluster0.zupyh1s.mongodb.net}"
DB_NAME="${DB_NAME:-smart-leads}"

echo "Atlas user: ${ATLAS_USER}"
echo "Cluster:    ${ATLAS_HOST}"
echo ""
read -rsp "Paste your Atlas database password: " PASS
echo ""

if [[ -z "${PASS}" ]]; then
  echo "Error: password cannot be empty." >&2
  exit 1
fi

# URL-encode password (handles @ # etc.)
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
