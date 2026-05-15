#!/usr/bin/env bash
# init-pb-v2.sh - Initialize PocketBase collections via CLI (no HTTP API needed)
# Uses docker exec approach for PocketBase CLI commands
# Handles collection creation via JS migrations, superuser via CLI upsert

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
PB_CONTAINER="${PB_CONTAINER:-pocketbase-fk88xolvxfxq5jziugw4qcu5}"
PB_URL="${POCKETBASE_URL:-http://localhost:8090}"
ADMIN_EMAIL="${POCKETBASE_ADMIN_EMAIL:-admin@katemi.cl}"
ADMIN_PASS="${POCKETBASE_ADMIN_PASSWORD:-changeme}"
SEED_FILE="${SEED_FILE:-./seed-data.json}"
PB_CLI="/app/pocketbase"
PB_DATA_DIR="/app/pb_data"
MIGRATIONS_DIR="/app/pb_data/pb_migrations"

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

log() { echo -e "${BLUE}[PB Init]${RESET} $1"; }
ok()  { echo -e "${GREEN}✓${RESET} $1"; }
warn(){ echo -e "${YELLOW}⚠${RESET} $1"; }
err() { echo -e "${RED}✗${RESET} $1"; }

# ── Helpers ────────────────────────────────────────────────────────────────────
docker_exec() {
  docker exec "$PB_CONTAINER" sh -c "$1"
}

pb_auth() {
  log "Authenticating via CLI..."
  # Use CLI to upsert superuser (idempotent)
  docker_exec "$PB_CLI superuser upsert $ADMIN_EMAIL $ADMIN_PASS" 2>&1
  ok "Superuser configured via CLI"
}

# Run a JS migration inside the container
run_migration() {
  local name="$1"
  local js_code="$2"
  
  # Create migration file
  local ts=$(date +%s)
  local filename="${ts}_${name}.js"
  
  docker_exec "mkdir -p $MIGRATIONS_DIR && echo '$js_code' > $MIGRATIONS_DIR/$filename"
  
  # Run migrations
  local out
  out=$(docker_exec "$PB_CLI migrate up --dir $PB_DATA_DIR 2>&1")
  echo "$out"
  
  # Remove migration file after running (to keep clean)
  docker_exec "rm -f $MIGRATIONS_DIR/$filename"
}

# Create all 7 collections via inline JS migration
create_collections() {
  log "Creating collections via CLI migrations..."
  
  local js='up: async () => {
    // 1. SERVICES
    try { await this.createCollection({
      name: "services",
      type: "base",
      schema: [
        { name: "slug",          type: "text",     required: true,  unique: true },
        { name: "title",         type: "text",     required: true },
        { name: "shortDescription", type: "text",  required: true },
        { name: "fullDescription", type: "text",   required: true, options: { textarea: true } },
        { name: "features",      type: "json" },
        { name: "image",         type: "file", options: { maxSelect: 1 } },
        { name: "icon",          type: "text", default: "Settings" },
        { name: "order",         type: "number" },
        { name: "isActive",      type: "bool" }
      ],
      listRule:   "@request.auth.id != \"\"",
      viewRule:   "@request.auth.id != \"\"",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created services collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("services collection already exists"); else throw e; }

    // 2. PROJECTS
    try { await this.createCollection({
      name: "projects",
      type: "base",
      schema: [
        { name: "slug",             type: "text",   required: true, unique: true },
        { name: "clientName",        type: "text",   required: true },
        { name: "title",            type: "text",   required: true },
        { name: "location",         type: "text" },
        { name: "description",      type: "text",   required: true, options: { textarea: true } },
        { name: "servicesProvided", type: "json" },
        { name: "images",           type: "file", options: { maxSelect: 10 } },
        { name: "category",         type: "select", options: { maxSelect: 1, values: ["transmission","distribution","photovoltaic","industrial","residential"] } },
        { name: "year",             type: "number" },
        { name: "isFeatured",       type: "bool" },
        { name: "isActive",         type: "bool" }
      ],
      listRule:   "",
      viewRule:   "",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created projects collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("projects collection already exists"); else throw e; }

    // 3. CLIENTS
    try { await this.createCollection({
      name: "clients",
      type: "base",
      schema: [
        { name: "name",    type: "text",   required: true },
        { name: "logo",   type: "file",   options: { maxSelect: 1 } },
        { name: "website", type: "text" },
        { name: "order",   type: "number" },
        { name: "isActive", type: "bool" }
      ],
      listRule:   "",
      viewRule:   "",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created clients collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("clients collection already exists"); else throw e; }

    // 4. CONTACTS
    try { await this.createCollection({
      name: "contacts",
      type: "base",
      schema: [
        { name: "firstName", type: "text",   required: true },
        { name: "lastName",  type: "text",   required: true },
        { name: "phone",     type: "text",   required: true },
        { name: "company",   type: "text" },
        { name: "email",     type: "email",  required: true },
        { name: "subject",   type: "text",   required: true },
        { name: "message",   type: "text",   required: true, options: { textarea: true } },
        { name: "status",    type: "select", options: { maxSelect: 1, values: ["new","read","replied","archived"] } }
      ],
      listRule:   "@request.auth.id != \"\"",
      viewRule:   "@request.auth.id != \"\"",
      createRule: "",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created contacts collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("contacts collection already exists"); else throw e; }

    // 5. PAGES
    try { await this.createCollection({
      name: "pages",
      type: "base",
      schema: [
        { name: "slug",            type: "text",   required: true, unique: true },
        { name: "title",           type: "text",   required: true },
        { name: "content",         type: "json" },
        { name: "metaTitle",       type: "text" },
        { name: "metaDescription", type: "text" },
        { name: "isActive",        type: "bool" }
      ],
      listRule:   "",
      viewRule:   "",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created pages collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("pages collection already exists"); else throw e; }

    // 6. SITECONFIG
    try { await this.createCollection({
      name: "siteConfig",
      type: "base",
      schema: [
        { name: "key",   type: "text",   required: true, unique: true },
        { name: "value", type: "text",   required: true },
        { name: "group", type: "select", options: { maxSelect: 1, values: ["general","contact","social","seo"] } }
      ],
      listRule:   "",
      viewRule:   "",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created siteConfig collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("siteConfig collection already exists"); else throw e; }

    // 7. STATS
    try { await this.createCollection({
      name: "stats",
      type: "base",
      schema: [
        { name: "label",   type: "text",   required: true },
        { name: "value",   type: "text",   required: true },
        { name: "prefix",  type: "text" },
        { name: "suffix",  type: "text" },
        { name: "order",   type: "number" },
        { name: "isActive", type: "bool" }
      ],
      listRule:   "",
      viewRule:   "",
      createRule: "@request.auth.id != \"\"",
      updateRule: "@request.auth.id != \"\"",
      deleteRule: "@request.auth.id != \"\""
    }); console.log("Created stats collection"); } catch(e) { if(e.message?.includes("already exists")) console.log("stats collection already exists"); else throw e; }
  }'

  # Create migration file and run
  local ts=$(date +%s)
  local filename="${ts}_create_collections.js"
  
  # Escape the JS for shell
  local escaped_js=$(echo "$js" | sed "s/'/'\\\\''/g")
  
  docker exec "$PB_CONTAINER" sh -c "mkdir -p $MIGRATIONS_DIR && cat > $MIGRATIONS_DIR/$filename << 'MIGRATION_EOF'
$js
MIGRATION_EOF"
  
  log "Running collections migration..."
  local out
  if out=$(docker exec "$PB_CONTAINER" sh -c "$PB_CLI migrate up --dir $PB_DATA_DIR 2>&1"); then
    echo "$out" | grep -E "Created|already exists|error|Error" || echo "Migration completed"
    ok "Collections migration complete"
  else
    echo "$out"
    err "Collections migration failed"
  fi
  
  # Clean up migration file
  docker exec "$PB_CONTAINER" sh -c "rm -f $MIGRATIONS_DIR/$filename" 2>/dev/null || true
}

# Insert seed data via PocketBase REST API (with discovered auth endpoint)
insert_seed_data() {
  if [[ ! -f "${SEED_FILE}" ]]; then
    warn "Seed file not found: ${SEED_FILE}, skipping seed data"
    return 0
  fi
  
  log "Discovering working auth endpoint..."
  
  # Try to find working auth endpoint
  local token=""
  local auth_endpoints=(
    "/api/admins/auth-with-password"
    "/api/superusers/auth-with-password"
    "/api/auth/admins"
    "/api/auth/superusers"
  )
  
  for ep in "${auth_endpoints[@]}"; do
    local resp
    resp=$(curl -s -X POST "${PB_URL}${ep}" \
      -H "Content-Type: application/json" \
      -d "{\"identity\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}" 2>/dev/null)
    token=$(echo "$resp" | grep -o '"token":"[^"]*"' | cut -d'"' -f4 | head -1)
    if [[ -n "$token" ]]; then
      log "Auth endpoint found: $ep"
      break
    fi
  done
  
  if [[ -z "$token" ]]; then
    err "Could not authenticate via any HTTP endpoint. Skipping seed data."
    warn "Collections created - use admin UI to insert seed data manually"
    return 1
  fi
  
  ok "Authenticated successfully"
  
  # Check if collections exist
  log "Verifying collections..."
  local cols_resp
  cols_resp=$(curl -s "${PB_URL}/api/collections" \
    -H "Authorization: ${token}" 2>/dev/null)
  echo "$cols_resp" | grep -q "services" && ok "Collections verified" || warn "Could not verify collections"
  
  log "Inserting seed data..."
  
  # Helper to insert records
  insert_record() {
    local coll="$1"
    local data="$2"
    local resp
    resp=$(curl -s -X POST "${PB_URL}/api/collections/${coll}/records" \
      -H "Content-Type: application/json" \
      -H "Authorization: ${token}" \
      -d "$data" 2>/dev/null)
    local id=$(echo "$resp" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [[ -n "$id" ]]; then
      echo -e "  ${GREEN}✓${RESET} Inserted into $coll"
    else
      local msg=$(echo "$resp" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)
      echo -e "  ${YELLOW}⚠${RESET} $coll: ${msg:-unknown error}"
    fi
  }
  
  # Services
  echo -e "${CYAN}  → services${RESET}"
  jq -c '.services[]' "${SEED_FILE}" 2>/dev/null | while read -r rec; do
    insert_record "services" "$rec" || true
  done
  
  # Projects
  echo -e "${CYAN}  → projects${RESET}"
  jq -c '.projects[]' "${SEED_FILE}" 2>/dev/null | while read -r rec; do
    insert_record "projects" "$rec" || true
  done
  
  # Clients
  echo -e "${CYAN}  → clients${RESET}"
  jq -c '.clients[]' "${SEED_FILE}" 2>/dev/null | while read -r rec; do
    insert_record "clients" "$rec" || true
  done
  
  # Stats
  echo -e "${CYAN}  → stats${RESET}"
  jq -c '.stats[]' "${SEED_FILE}" 2>/dev/null | while read -r rec; do
    insert_record "stats" "$rec" || true
  done
  
  # SiteConfig
  echo -e "${CYAN}  → siteConfig${RESET}"
  jq -c '.siteConfig[]' "${SEED_FILE}" 2>/dev/null | while read -r rec; do
    insert_record "siteConfig" "$rec" || true
  done
  
  echo
  ok "Seed data insertion complete"
}

# ── Main ────────────────────────────────────────────────────────────────────────
main() {
  echo
  log "Initializing PocketBase v2 (CLI-based)"
  echo "  Container : $PB_CONTAINER"
  echo "  URL       : $PB_URL"
  echo "  Admin     : $ADMIN_EMAIL"
  echo
  
  # 1. Ensure superuser exists via CLI
  pb_auth
  
  # 2. Create collections via migration
  create_collections
  
  # 3. Insert seed data via HTTP API (if auth works)
  insert_seed_data
  
  echo
  ok "PocketBase initialization complete!"
  echo
  echo "  Admin UI  : ${PB_URL}/_/"
  echo "  API       : ${PB_URL}/api/"
  echo "  Default   : admin@katemi.cl / changeme"
  echo "  ⚠  Remember to change the admin password!"
}

main "$@"