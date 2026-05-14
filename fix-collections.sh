#!/usr/bin/env bash
set -euo pipefail

PB_URL="http://localhost:8090"
ADMIN_EMAIL="admin@precon.cl"
ADMIN_PASS="changeme"

log()  { echo -e "\033[0;34m[PB]\033[0m $1"; }
ok()   { echo -e "\033[0;32m✓\033[0m $1"; }
warn() { echo -e "\033[1;33m⚠\033[0m $1"; }

# Auth
get_token() {
  curl -s -X POST "${PB_URL}/api/collections/_superusers/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin).get("token",""))'
}

# Create collection with schema
create_coll() {
  local name="$1" schema="$2" token="$3"
  local resp=$(curl -s -X POST "${PB_URL}/api/collections" \
    -H "Content-Type: application/json" \
    -H "Authorization: ${token}" \
    -d "{\"name\":\"${name}\",\"type\":\"base\",\"schema\":${schema}}")
  if echo "$resp" | grep -q '"id"'; then
    echo -e "  \033[0;32m✓\033[0m $name"
  elif echo "$resp" | grep -q 'already exists'; then
    echo -e "  \033[1;33m⚠\033[0m $name (exists)"
  else
    echo -e "  \033[0;31m✗\033[0m $name: $(echo "$resp" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("message",""))')"
  fi
}

TOKEN=$(get_token)
if [[ -z "$TOKEN" ]]; then
  echo "Auth failed"; exit 1
fi
log "Authenticated"

# Delete existing custom collections
for c in services projects clients contacts pages siteConfig stats; do
  curl -s -X DELETE "${PB_URL}/api/collections/${c}" -H "Authorization: ${TOKEN}" 2>/dev/null || true
done
sleep 1

# Create with full schema
create_coll "services" '[{"name":"slug","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"title","type":"text","required":true,"options":{"max":200}},{"name":"shortDescription","type":"text","required":true,"options":{"max":500}},{"name":"fullDescription","type":"text","required":true,"options":{"textarea":true}},{"name":"features","type":"json"},{"name":"image","type":"file","options":{"maxSelect":1}},{"name":"icon","type":"text","options":{"max":100}},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

create_coll "projects" '[{"name":"slug","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"clientName","type":"text","required":true,"options":{"max":200}},{"name":"title","type":"text","required":true,"options":{"max":200}},{"name":"location","type":"text","options":{"max":200}},{"name":"description","type":"text","required":true,"options":{"textarea":true}},{"name":"servicesProvided","type":"json"},{"name":"images","type":"file","options":{"maxSelect":10}},{"name":"category","type":"select","options":{"maxSelect":1,"values":["transmission","distribution","photovoltaic","industrial","residential"]}},{"name":"year","type":"number"},{"name":"isFeatured","type":"bool"},{"name":"isActive","type":"bool"}]' "$TOKEN"

create_coll "clients" '[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"logo","type":"file","options":{"maxSelect":1}},{"name":"website","type":"text","options":{"max":300}},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

create_coll "contacts" '[{"name":"firstName","type":"text","required":true,"options":{"max":100}},{"name":"lastName","type":"text","required":true,"options":{"max":100}},{"name":"phone","type":"text","required":true,"options":{"max":50}},{"name":"company","type":"text","options":{"max":200}},{"name":"email","type":"email","required":true},{"name":"subject","type":"text","required":true,"options":{"max":300}},{"name":"message","type":"text","required":true,"options":{"textarea":true}},{"name":"status","type":"select","options":{"maxSelect":1,"values":["new","read","replied","archived"]}}]' "$TOKEN"

create_coll "pages" '[{"name":"slug","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"title","type":"text","required":true,"options":{"max":200}},{"name":"content","type":"json"},{"name":"metaTitle","type":"text","options":{"max":200}},{"name":"metaDescription","type":"text","options":{"max":500}},{"name":"isActive","type":"bool"}]' "$TOKEN"

create_coll "siteConfig" '[{"name":"key","type":"text","required":true,"unique":true,"options":{"max":100}},{"name":"value","type":"text","required":true},{"name":"group","type":"select","options":{"maxSelect":1,"values":["general","contact","social","seo"]}}]' "$TOKEN"

create_coll "stats" '[{"name":"label","type":"text","required":true,"options":{"max":100}},{"name":"value","type":"text","required":true,"options":{"max":100}},{"name":"prefix","type":"text","options":{"max":20}},{"name":"suffix","type":"text","options":{"max":20}},{"name":"order","type":"number"},{"name":"isActive","type":"bool"}]' "$TOKEN"

ok "All collections created"