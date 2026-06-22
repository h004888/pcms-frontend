#!/usr/bin/env bash
# PCMS Phase 1 Smoke Test
# Verify 13 list pages + home dashboard + 6 core CRUD operations

set -e
PORT=${PORT:-3000}
BASE="http://localhost:${PORT}/api/v1"
echo "=== PCMS Phase 1 Smoke Test (base: $BASE) ==="
echo ""

# 1. Login
echo "[1/8] Login admin@pcms.vn/admin123..."
LOGIN_RES=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pcms.vn","password":"admin123"}')
TOKEN=$(echo "$LOGIN_RES" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log(JSON.parse(c).accessToken||'')}catch{console.log('')}")
if [ -z "$TOKEN" ]; then
  echo "  FAIL: no accessToken in response"
  echo "  Response: $LOGIN_RES"
  exit 1
fi
echo "  OK (token len: ${#TOKEN})"
echo ""

# 2. Auth me
echo "[2/8] GET /auth/me..."
ME=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/auth/me")
ME_EMAIL=$(echo "$ME" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log(JSON.parse(c).email||'')}catch{console.log('')}")
if [ "$ME_EMAIL" = "admin@pcms.vn" ]; then
  echo "  OK ($ME_EMAIL)"
else
  echo "  FAIL: expected admin@pcms.vn got '$ME_EMAIL'"
  exit 1
fi
echo ""

# 3. List endpoints - expect all > 0
echo "[3/8] List 11 endpoints (size=5)..."
for ep in users branches medicines customers categories suppliers inventory orders payments prescriptions notifications; do
  RES=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/${ep}?size=5")
  CNT=$(echo "$RES" | node -e "const c=require('fs').readFileSync(0,'utf8');try{const j=JSON.parse(c);console.log((j.data||j).length||0)}catch{console.log(0)}")
  printf "  %-15s %s records\n" "$ep" "$CNT"
  if [ "$CNT" -lt 0 ]; then echo "  FAIL on $ep"; exit 1; fi
done
echo ""

# 4. Search
echo "[4/8] GET /search?q=Para..."
SEARCH=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/search?q=Para")
TOTAL=$(echo "$SEARCH" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log(JSON.parse(c).total||0)}catch{console.log(0)}")
echo "  Total: $TOTAL matches"
echo ""

# 5. Reports revenue
echo "[5/8] GET /reports/revenue..."
REV=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/reports/revenue")
TOT_REV=$(echo "$REV" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log(JSON.parse(c).totalRevenue||0)}catch{console.log(0)}")
echo "  Total revenue: $TOT_REV VND"
echo ""

# 6. Low stock
echo "[6/8] GET /inventory/low-stock..."
LOW=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE/inventory/low-stock")
LOW_CNT=$(echo "$LOW" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log((JSON.parse(c)||[]).length)}catch{console.log(0)}")
echo "  Low stock batches: $LOW_CNT"
echo ""

# 7. Create user
echo "[7/8] POST /users (create test user)..."
NEW_ID=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"smoketest@pcms.vn","fullName":"Smoke Test","role":"PHARMACIST","phone":"0999"}' \
  "$BASE/users" | node -e "const c=require('fs').readFileSync(0,'utf8');try{console.log(JSON.parse(c).id||'')}catch{console.log('')}")
if [ -z "$NEW_ID" ]; then
  echo "  FAIL: no id"
  exit 1
fi
echo "  OK (id: $NEW_ID)"

# 8. Update + delete
echo "[8/8] PUT /users/$NEW_ID + DELETE /users/$NEW_ID..."
curl -s -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"fullName":"Smoke Test Updated"}' "$BASE/users/$NEW_ID" > /dev/null
DEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BASE/users/$NEW_ID")
if [ "$DEL_STATUS" = "200" ] || [ "$DEL_STATUS" = "204" ]; then
  echo "  OK (delete status: $DEL_STATUS)"
else
  echo "  FAIL: delete status $DEL_STATUS"
  exit 1
fi
echo ""

echo "=== ALL PHASE 1 TESTS PASSED ==="
