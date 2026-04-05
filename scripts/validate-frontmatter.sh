#!/usr/bin/env bash
# Validates required frontmatter fields in blog post markdown files.
# Called by Claude Code PostToolUse hook after editing content files.
#
# Usage: bash scripts/validate-frontmatter.sh <file>

FILE="$1"

if [[ ! -f "$FILE" ]]; then
  echo "ERROR: File not found: $FILE"
  exit 1
fi

# Extract frontmatter (between first two --- lines)
FRONTMATTER=$(sed -n '/^---$/,/^---$/p' "$FILE" | sed '1d;$d')

if [[ -z "$FRONTMATTER" ]]; then
  echo "ERROR: No frontmatter found in $FILE"
  echo "Blog posts require --- delimited frontmatter with: title, pubDatetime, description, tags"
  exit 1
fi

ERRORS=()

# Helper: check if a field exists in frontmatter
has_field() {
  echo "$FRONTMATTER" | grep -qE "^$1:" 2>/dev/null
  return $?
}

# Helper: get field value
get_field() {
  echo "$FRONTMATTER" | grep -E "^$1:" | sed "s/^$1:[[:space:]]*//" | sed "s/^['\"]//;s/['\"]$//"
}

# Check required fields exist
for FIELD in title pubDatetime description; do
  if ! has_field "$FIELD"; then
    ERRORS+=("Missing required field: $FIELD")
  fi
done

# Check title is not empty (only if field exists)
if has_field "title"; then
  TITLE_VAL=$(get_field "title")
  if [[ -z "$TITLE_VAL" ]]; then
    ERRORS+=("Field 'title' must not be empty")
  fi
fi

# Check description is not empty (only if field exists)
if has_field "description"; then
  DESC_VAL=$(get_field "description")
  if [[ -z "$DESC_VAL" ]]; then
    ERRORS+=("Field 'description' must not be empty")
  fi
fi

# Check pubDatetime looks like a date (only if field exists)
if has_field "pubDatetime"; then
  PUB_VAL=$(get_field "pubDatetime")
  if [[ -n "$PUB_VAL" ]] && ! echo "$PUB_VAL" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}'; then
    ERRORS+=("Field 'pubDatetime' must be a valid date (YYYY-MM-DD format)")
  fi
fi

if [[ ${#ERRORS[@]} -gt 0 ]]; then
  echo "Frontmatter validation failed for: $FILE"
  for ERR in "${ERRORS[@]}"; do
    echo "  - $ERR"
  done
  exit 1
fi

echo "Frontmatter OK: $FILE"
exit 0
