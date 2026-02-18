#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   DATABASE_URL="postgresql://..." ./scripts/sqlite_to_postgres.sh [path/to/db.sqlite] [out_dir]
# If DATABASE_URL not set, script will error.

DB_FILE=${1:-server/db.sqlite}
OUT_DIR=${2:-/tmp/prodesk-sqlite-export-$(date +%s)}

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL must be set (Neon/Postgres connection string)"
  echo "Example: export DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'"
  exit 1
fi

command -v sqlite3 >/dev/null 2>&1 || { echo "sqlite3 not found"; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "psql not found"; exit 1; }

echo "Exporting from SQLite: $DB_FILE -> $OUT_DIR"
mkdir -p "$OUT_DIR"

# Get table list (one per line)
tables=$(sqlite3 "$DB_FILE" ".tables" | tr ' ' '\n' | sed '/^$/d')

echo "Found tables:"
echo "$tables"

for t in $tables; do
  echo "- Exporting table: $t"
  sqlite3 -header -csv "$DB_FILE" "SELECT * FROM \"$t\";" > "$OUT_DIR/$t.csv"
done

echo "All tables exported to $OUT_DIR"

echo "Importing into Postgres: $DATABASE_URL"

for csv in "$OUT_DIR"/*.csv; do
  table=$(basename "$csv" .csv)
  echo "- Importing $table from $csv"
  # Read header line and use it as column list for \\copy to avoid ordering issues
  header=$(head -n1 "$csv" | sed 's/"//g')
  if [ -z "$header" ]; then
    echo "  (empty file, skipping)"
    continue
  fi
  # Use psql \copy with explicit columns
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "\copy \"$table\" ($header) FROM '$csv' CSV HEADER;"
done

echo "Import complete. Verify counts with: psql '$DATABASE_URL' -c 'SELECT COUNT(*) FROM divers;'"
