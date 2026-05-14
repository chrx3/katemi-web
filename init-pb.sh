#!/usr/bin/env bash
# init-pb.sh - Initialize PocketBase collections and seed data via Admin API
# Usage: ./init-pb.sh [--dry-run]
#
# Required env vars:
#   POCKETBASE_URL   - e.g. http://localhost:8090 or http://pb.preicon.cl
#   POCKETBASE_ADMIN_EMAIL
#   POCKETBASE_ADMIN_PASSWORD

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PB_URL="${POCKETBASE_URL:-http://localhost:8090}"
ADMIN_EMAIL="${POCKETBASE_ADMIN_EMAIL:-admin@precon.cl}"
ADMIN_PASS="${POCKETBASE_ADMIN_PASSWORD:-changeme}"
SEED_FILE="${SEED_FILE:-./seed-data.json}"
DRY_RUN=false

[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log() { echo -e "${BLUE}[PB Init]${RESET} $1"; }
ok()  { echo -e "${GREEN}✓${RESET} $1"; }
warn(){ echo -e "${YELLOW}⚠${RESET} $1"; }
err() { echo -e "${RED}✗${RESET} $1"; }

# ── Helpers ────────────────────────────────────────────────────────────────────
jq_req() { command -v jq >/dev/null 2>&1 || { err "jq is required but not installed"; exit 1; }; }
wait_for_pb() {
  local max_attempts=30 delay=2
  log "Waiting for PocketBase to be ready at ${PB_URL}..."
  for i in $(seq 1 $max_attempts); do
    if curl -sf "${PB_URL}/api/health" > /dev/null 2>&1; then
      ok "PocketBase is ready"
      return 0
    fi
    echo -n "."
    sleep $delay
  done
  err "PocketBase did not become ready in time"
  exit 1
}

# Authenticate and store token in PB_TOKEN
pb_auth() {
  log "Authenticating as admin ${ADMIN_EMAIL}..."
  local resp
  resp=$(curl -s -X POST "${PB_URL}/api/admins/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}")
  PB_TOKEN=$(echo "$resp" | jq -r '.token // empty')
  if [[ -z "${PB_TOKEN}" || "${PB_TOKEN}" == "null" || "${PB_TOKEN}" == "empty" ]]; then
    err "Admin auth failed. Response: $resp"
    exit 1
  fi
  ok "Authenticated successfully"
}

# Create a collection if it doesn't already exist
# Args: collection_json name
pb_create_collection() {
  local coll_json="$1"
  local name=$(echo "$coll_json" | jq -r '.name')
  local coll_id

  # Check if collection already exists
  coll_id=$(curl -s -N "${PB_URL}/api/collections" \
    -H "Authorization: ${PB_TOKEN}" | jq -r ".items[] | select(.name==\"${name}\") | .id // empty")

  if [[ -n "${coll_id}" && "${coll_id}" != "null" && "${coll_id}" != "empty" ]]; then
    warn "Collection '${name}' already exists (id: ${coll_id}), skipping creation"
    return 0
  fi

  if $DRY_RUN; then
    echo -e "${YELLOW}[DRY-RUN]${RESET} Would create collection: ${name}"
    return 0
  fi

  local resp
  resp=$(curl -s -X POST "${PB_URL}/api/collections" \
    -H "Content-Type: application/json" \
    -H "Authorization: ${PB_TOKEN}" \
    -d "$coll_json")
  local new_id
  new_id=$(echo "$resp" | jq -r '.id // empty')
  if [[ -n "${new_id}" && "${new_id}" != "null" && "${new_id}" != "empty" ]]; then
    ok "Created collection '${name}' (id: ${new_id})"
  else
    # PocketBase returns error JSON on failure
    local err_msg
    err_msg=$(echo "$resp" | jq -r '.message // .data // .')
    err "Failed to create collection '${name}': ${err_msg}"
    return 1
  fi
}

# Insert a record into a collection
# Args: collection_name record_json
pb_insert() {
  local coll_name="$1"
  local rec_json="$2"
  local rec_id

  if $DRY_RUN; then
    echo -e "${YELLOW}[DRY-RUN]${RESET} Would insert into '${coll_name}': $(echo "$rec_json" | jq -r '.slug // .key // .name // .label // .firstName // empty')"
    return 0
  fi

  local resp
  resp=$(curl -s -X POST "${PB_URL}/api/collections/${coll_name}/records" \
    -H "Content-Type: application/json" \
    -H "Authorization: ${PB_TOKEN}" \
    -d "$rec_json")
  rec_id=$(echo "$resp" | jq -r '.id // empty')
  if [[ -n "${rec_id}" && "${rec_id}" != "null" && "${rec_id}" != "empty" ]]; then
    ok "Inserted record into '${coll_name}' (id: ${rec_id})"
  else
    local err_msg
    err_msg=$(echo "$resp" | jq -r '.message // .data // .')
    warn "Could not insert into '${coll_name}': ${err_msg}"
    return 1
  fi
}

# ── Collection Schemas ─────────────────────────────────────────────────────────

# 1. SERVICES
COLL_SERVICES='{
  "name": "services",
  "type": "base",
  "schema": [
    {"name": "slug",         "type": "text",     "required": true,  "unique": true,  "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "title",        "type": "text",     "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "shortDescription", "type": "text", "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "fullDescription", "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "", "textarea": true }},
    {"name": "features",     "type": "json",     "required": false, "unique": false, "options": { "maxSize": 2000000 }},
    {"name": "image",        "type": "file",     "required": false, "unique": false, "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpg","image/jpeg","image/png","image/webp","image/svg+xml"], "thumbs": [], "fingerprint": true }},
    {"name": "icon",         "type": "text",     "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }, "default": "Settings"},
    {"name": "order",        "type": "number",   "required": false, "unique": false, "options": { "min": null, "max": null, "noDecimal": false }},
    {"name": "isActive",     "type": "bool",     "required": false, "unique": false }
  ],
  "listRule":   "@request.auth.id != \"\"",
  "viewRule":   "@request.auth.id != \"\"",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 2. PROJECTS
COLL_PROJECTS='{
  "name": "projects",
  "type": "base",
  "schema": [
    {"name": "slug",             "type": "text",   "required": true,  "unique": true,  "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "clientName",       "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "title",            "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "location",         "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "description",      "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "", "textarea": true }},
    {"name": "servicesProvided", "type": "json",   "required": false, "unique": false, "options": { "maxSize": 2000000 }},
    {"name": "images",           "type": "file",   "required": false, "unique": false, "options": { "maxSelect": 10, "maxSize": 5242880, "mimeTypes": ["image/jpg","image/jpeg","image/png","image/webp"], "thumbs": ["100x100","400x400"], "fingerprint": true }},
    {"name": "category",         "type": "select", "required": false, "unique": false, "options": { "maxSelect": 1, "values": ["transmission","distribution","photovoltaic","industrial","residential"] }},
    {"name": "year",             "type": "number", "required": false, "unique": false, "options": { "min": null, "max": null, "noDecimal": false }},
    {"name": "isFeatured",       "type": "bool",   "required": false, "unique": false },
    {"name": "isActive",         "type": "bool",   "required": false, "unique": false }
  ],
  "listRule":   "",
  "viewRule":   "",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 3. CLIENTS
COLL_CLIENTS='{
  "name": "clients",
  "type": "base",
  "schema": [
    {"name": "name",    "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "logo",   "type": "file",   "required": false, "unique": false, "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpg","image/jpeg","image/png","image/webp","image/svg+xml"], "thumbs": [], "fingerprint": true }},
    {"name": "website", "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "order",   "type": "number", "required": false, "unique": false, "options": { "min": null, "max": null, "noDecimal": false }},
    {"name": "isActive","type": "bool",   "required": false, "unique": false }
  ],
  "listRule":   "",
  "viewRule":   "",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 4. CONTACTS
COLL_CONTACTS='{
  "name": "contacts",
  "type": "base",
  "schema": [
    {"name": "firstName","type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "lastName", "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "phone",    "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "company",  "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "email",    "type": "email",  "required": true,  "unique": false, "options": { "exceptDomains": [], "onlyDomains": [] }},
    {"name": "subject",  "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "message",  "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "", "textarea": true }},
    {"name": "status",   "type": "select", "required": false, "unique": false, "options": { "maxSelect": 1, "values": ["new","read","replied","archived"] }}
  ],
  "listRule":   "@request.auth.id != \"\"",
  "viewRule":   "@request.auth.id != \"\"",
  "createRule": "",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 5. PAGES
COLL_PAGES='{
  "name": "pages",
  "type": "base",
  "schema": [
    {"name": "slug",           "type": "text",   "required": true,  "unique": true,  "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "title",          "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "content",        "type": "json",   "required": false, "unique": false, "options": { "maxSize": 2000000 }},
    {"name": "metaTitle",      "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "metaDescription","type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "isActive",       "type": "bool",   "required": false, "unique": false }
  ],
  "listRule":   "",
  "viewRule":   "",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 6. SITECONFIG
COLL_SITECONFIG='{
  "name": "siteConfig",
  "type": "base",
  "schema": [
    {"name": "key",   "type": "text",   "required": true,  "unique": true,  "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "value", "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "group", "type": "select", "required": false, "unique": false, "options": { "maxSelect": 1, "values": ["general","contact","social","seo"] }}
  ],
  "listRule":   "",
  "viewRule":   "",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# 7. STATS
COLL_STATS='{
  "name": "stats",
  "type": "base",
  "schema": [
    {"name": "label",   "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "value",   "type": "text",   "required": true,  "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "prefix",  "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "suffix",  "type": "text",   "required": false, "unique": false, "options": { "min": null, "max": null, "pattern": "" }},
    {"name": "order",   "type": "number", "required": false, "unique": false, "options": { "min": null, "max": null, "noDecimal": false }},
    {"name": "isActive","type": "bool",   "required": false, "unique": false }
  ],
  "listRule":   "",
  "viewRule":   "",
  "createRule": "@request.auth.id != \"\"",
  "updateRule": "@request.auth.id != \"\"",
  "deleteRule": "@request.auth.id != \"\""
}'

# ── Main ────────────────────────────────────────────────────────────────────────
main() {
  jq_req
  wait_for_pb
  pb_auth

  echo
  log "Creating collections..."
  pb_create_collection "$COLL_SERVICES"
  pb_create_collection "$COLL_PROJECTS"
  pb_create_collection "$COLL_CLIENTS"
  pb_create_collection "$COLL_CONTACTS"
  pb_create_collection "$COLL_PAGES"
  pb_create_collection "$COLL_SITECONFIG"
  pb_create_collection "$COLL_STATS"

  if [[ ! -f "${SEED_FILE}" ]]; then
    warn "Seed file not found: ${SEED_FILE}, skipping seed data"
    return 0
  fi

  echo
  log "Inserting seed data from ${SEED_FILE}..."

  # Services
  echo -e "${CYAN}  → services${RESET}"
  jq -c '.services[]' "${SEED_FILE}" | while read -r rec; do
    pb_insert "services" "$rec" || true
  done

  # Projects
  echo -e "${CYAN}  → projects${RESET}"
  jq -c '.projects[]' "${SEED_FILE}" | while read -r rec; do
    pb_insert "projects" "$rec" || true
  done

  # Clients
  echo -e "${CYAN}  → clients${RESET}"
  jq -c '.clients[]' "${SEED_FILE}" | while read -r rec; do
    pb_insert "clients" "$rec" || true
  done

  # Stats
  echo -e "${CYAN}  → stats${RESET}"
  jq -c '.stats[]' "${SEED_FILE}" | while read -r rec; do
    pb_insert "stats" "$rec" || true
  done

  # SiteConfig
  echo -e "${CYAN}  → siteConfig${RESET}"
  jq -c '.siteConfig[]' "${SEED_FILE}" | while read -r rec; do
    pb_insert "siteConfig" "$rec" || true
  done

  echo
  ok "PocketBase initialization complete!"
  echo
  echo "  Admin UI  : ${PB_URL}/_/"
  echo "  API       : ${PB_URL}/api/"
  echo "  Default   : admin@precon.cl / changeme"
  echo "  ⚠  Remember to change the admin password!"
}

main "$@"