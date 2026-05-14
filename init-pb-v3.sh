#!/usr/bin/env bash
# init-pb-v3.sh - Initialize PocketBase collections via working HTTP API
set -euo pipefail

PB_CONTAINER="${PB_CONTAINER:-pocketbase-fk88xolvxfxq5jziugw4qcu5}"
PB_URL="${POCKETBASE_URL:-http://localhost:8090}"
ADMIN_EMAIL="${POCKETBASE_ADMIN_EMAIL:-admin@precon.cl}"
ADMIN_PASS="${POCKETBASE_ADMIN_PASSWORD:-changeme}"
SEED_FILE="${SEED_FILE:-./seed-data.json}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log()  { echo -e "${BLUE}[PB Init]${RESET} $1"; }
ok()   { echo -e "${GREEN}✓${RESET} $1"; }
warn() { echo -e "${YELLOW}⚠${RESET} $1"; }
err()  { echo -e "${RED}✗${RESET} $1"; }

# Authenticate and get token
get_token() {
  local resp
  resp=$(curl -s -X POST "${PB_URL}/api/collections/_superusers/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" 2>/dev/null)
  local token=$(echo "$resp" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("token",""))' 2>/dev/null)
  if [[ -z "$token" ]]; then
    err "Failed to authenticate"
    return 1
  fi
  echo "$token"
}

# Create a single collection
create_collection() {
  local name="$1"
  local schema="$2"
  local token="$3"
  local resp
  
  resp=$(curl -s -X POST "${PB_URL}/api/collections" \
    -H "Content-Type: application/json" \
    -H "Authorization: ${token}" \
    -d "{\"name\":\"${name}\",\"type\":\"base\",\"schema\":${schema}}" 2>/dev/null)
  
  if echo "$resp" | grep -q '"id"'; then
    echo -e "  ${GREEN}✓${RESET} Created: $name"
  elif echo "$resp" | grep -q 'already exists'; then
    echo -e "  ${YELLOW}⚠${RESET} Already exists: $name"
  else
    echo -e "  ${RED}✗${RESET} Failed: $name"
  fi
}

# Insert seed record
insert_record() {
  local coll="$1"
  local data="$2"
  local token="$3"
  local resp
  resp=$(curl -s -X POST "${PB_URL}/api/collections/${coll}/records" \
    -H "Content-Type: application/json" \
    -H "Authorization: ${token}" \
    -d "$data" 2>/dev/null)
  local id=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  if [[ -n "$id" ]]; then
    return 0
  else
    return 1
  fi
}

main() {
  echo
  log "PocketBase v3 Initialization"
  echo "  Container : $PB_CONTAINER"
  echo "  URL       : ${PB_URL}"
  echo "  Admin     : ${ADMIN_EMAIL}"
  echo

  # 1. Authenticate
  log "Authenticating..."
  TOKEN=$(get_token)
  if [[ -z "$TOKEN" ]]; then
    err "Authentication failed"
    exit 1
  fi
  ok "Authenticated (${TOKEN:0:20}...)"

  # 2. Create collections
  log "Creating collections..."
  
  create_collection "services" '[{"name":"slug","type":"text","required":true,"unique":true},{"name":"title","type":"text","required":true},{"name":"shortDescription","type":"text","required":true},{"name":"fullDescription","type":"text","required":true,"options":{"textarea":true}},{"name":"features","type":"json"},{"name":"image","type":"file","options":{"maxSelect":1}},{"name":"icon","type":"text","default":"Settings"},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

  create_collection "projects" '[{"name":"slug","type":"text","required":true,"unique":true},{"name":"clientName","type":"text","required":true},{"name":"title","type":"text","required":true},{"name":"location","type":"text"},{"name":"description","type":"text","required":true,"options":{"textarea":true}},{"name":"servicesProvided","type":"json"},{"name":"images","type":"file","options":{"maxSelect":10}},{"name":"category","type":"select","options":{"maxSelect":1,"values":["transmission","distribution","photovoltaic","industrial","residential"]}},{"name":"year","type":"number"},{"name":"isFeatured","type":"bool"},{"name":"isActive","type":"bool"}]' "$TOKEN"

  create_collection "clients" '[{"name":"name","type":"text","required":true},{"name":"logo","type":"file","options":{"maxSelect":1}},{"name":"website","type":"text"},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

  create_collection "contacts" '[{"name":"firstName","type":"text","required":true},{"name":"lastName","type":"text","required":true},{"name":"phone","type":"text","required":true},{"name":"company","type":"text"},{"name":"email","type":"email","required":true},{"name":"subject","type":"text","required":true},{"name":"message","type":"text","required":true,"options":{"textarea":true}},{"name":"status","type":"select","options":{"maxSelect":1,"values":["new","read","replied","archived"]}}]' "$TOKEN"

  create_collection "pages" '[{"name":"slug","type":"text","required":true,"unique":true},{"name":"title","type":"text","required":true},{"name":"content","type":"json"},{"name":"metaTitle","type":"text"},{"name":"metaDescription","type":"text"},{"name":"isActive","type":"bool"}]' "$TOKEN"

  create_collection "siteConfig" '[{"name":"key","type":"text","required":true,"unique":true},{"name":"value","type":"text","required":true},{"name":"group","type":"select","options":{"maxSelect":1,"values":["general","contact","social","seo"]}}]' "$TOKEN"

  create_collection "stats" '[{"name":"label","type":"text","required":true},{"name":"value","type":"text","required":true},{"name":"prefix","type":"text"},{"name":"suffix","type":"text"},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

  echo

  # 3. Insert seed data
  if [[ ! -f "${SEED_FILE}" ]]; then
    warn "Seed file not found: ${SEED_FILE}"
    return 0
  fi

  log "Inserting seed data..."

  local total=0
  local ok_count=0

  for coll in services projects clients contacts pages siteConfig stats; do
    local count=0
    local records
    records=$(jq -c ".${coll}[]" "${SEED_FILE}" 2>/dev/null) || continue
    echo -e "${CYAN}  → ${coll}${RESET}"
    while IFS= read -r rec; do
      if insert_record "$coll" "$rec" "$TOKEN" 2>/dev/null; then
        ok_count=$((ok_count+1))
        count=$((count+1))
      fi
      total=$((total+1))
    done <<< "$records"
    if [[ $count -gt 0 ]]; then
      echo -e "    ${GREEN}✓${RESET} $count inserted"
    fi
  done

  echo
  ok "Seed complete: $ok_count / $total records inserted"
  echo
  echo "  Admin UI  : ${PB_URL}/_/"
  echo "  API       : ${PB_URL}/api/"
  echo "  Default   : admin@precon.cl / changeme"
  echo "  ⚠  Remember to change the admin password!"
  echo
}

main "$@"