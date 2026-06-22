# Tích hợp API Backend (PCMS) ↔ Frontend (pcms-frontend) — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to execute this plan task-by-task. Group 3-5 tasks per subagent batch.

**Goal:** Kết nối pcms-frontend (Next.js 14, port 3000) với pcms backend (Spring Cloud, API Gateway port 8080) sao cho user có thể login thật vào `/home` dashboard, list Users/Medicines/Customers/Suppliers/Branches/Inventory/Orders/Payments/Prescriptions/Notifications/Reports từ database MySQL thật, không phải mock.

**Architecture:**
- FE giữ nguyên pattern hiện tại (axios client + service modules + feature folders) — đã đúng convention.
- BE giữ nguyên (21 services qua API Gateway với JWT). Sửa **chỉ 3 chỗ** thuộc về integration contract:
  1. `LoginResponse` shape (flat → nested `user` object) — khớp FE `LoginResponse` type
  2. `BaseSecurityConfig` CORS disabled → enable cho dev
  3. Thêm endpoint `GET /api/v1/auth/me` → trả `UserResponse` thay vì `CurrentUserResponse` riêng (sửa optional) để client refresh user
- Cung cấp setup chạy backend local không cần Docker (Java + Maven Wrapper) + verify bằng curl.

**Tech Stack:**
- Backend: Java 17, Spring Boot 3.2+, Spring Cloud 2023+, MySQL 8.0 (qua XAMPP hoặc local), Eureka, Config Server.
- Frontend: Next.js 14 App Router, TypeScript, axios, react-hook-form, zod, Tailwind.
- Integration: REST/JSON, JWT (HS256), bearer token, CORS dev-friendly.

---

## Pre-flight Verification (BẮT BUỘC làm trước Task 1)

**Bối cảnh hiện tại** (đã verify từ codebase):

| Item | State |
|---|---|
| `pcms-frontend/src/lib/api/client.ts` | ✅ Axios + JWT interceptor + refresh logic ready |
| `pcms-frontend/src/lib/api/endpoints.ts` | ✅ 30+ endpoint paths defined |
| `pcms-frontend/src/features/*/services/*Service.ts` | ✅ 12 service modules calling real `apiClient` |
| `pcms-frontend/src/hooks/useApi.ts` | ✅ `useApiList` + `useApiDetail` ready |
| `pcms-frontend/src/app/(dashboard)/*/page.tsx` | ✅ 13 list/detail pages wrap `ListPage` + `apiClient` |
| `pcms-frontend/src/app/(auth)/login/page.tsx` | ✅ Login form calls `useAuth().login()` |
| `pcms/api-gateway/application.yml` | ✅ 17 routes configured, JWT, Eureka, CORS for `:3000` |
| `pcms/api-gateway/ApiGatewayApplication.java` | ✅ CORS allows `localhost:3000` |
| `pcms/user-service/.../AuthController.java` | ⚠️ Login returns flat `userId/email/...` — mismatch FE `LoginResponse` |
| `pcms/pcms-common/.../BaseSecurityConfig.java` | ⚠️ `.cors(disable)` (BUT gateway CORS is the real one — OK) |
| Maven binary | ❌ NOT installed on host |
| Docker daemon | ❌ NOT running |
| MySQL service | ❓ Unknown (XAMPP possible) |

**Critical bugs found (must fix in plan):**

| # | Bug | Evidence | Severity |
|---|---|---|---|
| BUG-I1 | `LoginResponse` shape mismatch (BE flat ↔ FE nested) | `pcms/user-service/dto/response/LoginResponse.java:9-17` vs `pcms-frontend/src/types/auth.ts:15-21` | **CRITICAL** — login hoàn toàn broken |
| BUG-I2 | `AuthUser` FE type thiếu `status` field | `pcms-frontend/src/types/auth.ts:23-29` vs `pcms/user-service/dto/response/UserResponse.java` | **MEDIUM** — UI không biết user ACTIVE/LOCKED |
| BUG-I3 | `Customer` FE type thiếu `status`, `tier` | `pcms-frontend/src/types/customer.ts:7-19` vs `pcms/customer-service/dto/response/CustomerResponse.java` | **MEDIUM** — `/customers/[id]` sẽ crash khi render tier |
| BUG-I4 | BCrypt seed hash không tương ứng `admin123` | `pcms/scripts/seed-admin-user.sql:12` (comment nói admin123, hash có thể sai salt) | **HIGH** — login fails ngay cả khi fix I1 |
| BUG-I5 | Maven + Docker chưa có | `which mvn` empty, `docker ps` empty | **BLOCKER** — không start được backend |
| I6 | `BigDecimal` price có thể serialize thành string | `pcms/catalog-service/dto/response/MedicineResponse.java:11` | **LOW** — chỉ format issue, FE `Medicine.price: number` parse OK nếu Jackson dùng `WRITE_BIGDECIMAL_AS_PLAIN` |

**Quyết định integration approach** (xác nhận với user nếu cần — mặc định dùng option này):

- **Auth**: Frontend gọi `POST /api/v1/auth/login` qua Gateway. Gateway route `lb://user-service` tới port 8081. User-service authenticate, issue JWT, trả response.
- **Data fetching**: Frontend axios gọi `http://localhost:8080/api/v1/{path}` (Gateway), Gateway route tới microservice tương ứng.
- **No Next.js BFF proxy** — frontend gọi thẳng gateway. Đơn giản, đã có CORS, không cần thêm layer.
- **Bypass BFF route handlers** hiện có (`src/app/api/shop/catalog`) — dùng cho demo ngoài giờ, không cần cho dashboard.

---

## Task 1: Fix LoginResponse shape (Backend → UserService)

**Objective:** Sửa `LoginResponse` backend trả nested `user` object khớp FE `LoginResponse` type.

**Files:**
- Modify: `pcms/user-service/src/main/java/com/pcms/userservice/dto/response/LoginResponse.java`
- Modify: `pcms/user-service/src/main/java/com/pcms/userservice/service/UserService.java` (constructor của LoginResponse)
- Test: `pcms/user-service/src/test/.../AuthControllerIT.java` (nếu có; nếu không, tạo integration test mới)

**Step 1: Đọc UserService.login() để biết cách build LoginResponse**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
grep -n "new LoginResponse\|LoginResponse(" user-service/src/main/java/com/pcms/userservice/service/UserService.java
```

**Step 2: Sửa `LoginResponse.java` thành nested `user`:**

Thay thế:
```java
public record LoginResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    UUID userId,
    String email,
    String fullName,
    Role role,
    UUID branchId
) {}
```

Bằng:
```java
public record LoginResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    UserInfo user
) {
    public record UserInfo(
        UUID id,
        String email,
        String fullName,
        Role role,
        UUID branchId,
        UserStatus status
    ) {
        public static UserInfo from(User u) {
            return new UserInfo(u.getId(), u.getEmail(), u.getFullName(),
                u.getRole(), u.getBranchId(), u.getStatus());
        }
    }
}
```

(Import `UserStatus`, `User` từ package `com.pcms.userservice.entity` + `enums`.)

**Step 3: Cập nhật tất cả `new LoginResponse(...)` trong UserService**

Tìm các chỗ gọi (login, refresh) — đổi sang `new LoginResponse(token, refresh, "Bearer", expiresIn, LoginResponse.UserInfo.from(user))`.

```bash
grep -rn "new LoginResponse" pcms/user-service/src/main/java/
```

**Step 4: Verify endpoint shape bằng curl (sau khi compile)**

```bash
# 1. Start user-service
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
./mvnw -pl user-service spring-boot:run &
sleep 30
# 2. Test
curl -s -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pcms.vn","password":"admin123"}' | jq .
```

**Expected JSON shape:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid...",
    "email": "admin@pcms.vn",
    "fullName": "System Administrator",
    "role": "ADMIN",
    "branchId": null,
    "status": "ACTIVE"
  }
}
```

**Step 5: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
git add user-service/src/main/java/com/pcms/userservice/dto/response/LoginResponse.java \
        user-service/src/main/java/com/pcms/userservice/service/UserService.java
git commit -m "fix(auth): LoginResponse nested user object to match FE contract (INT-01)"
```

---

## Task 2: Fix CustomerResponse type mismatch (Backend → CustomerService) [SKIP if not blocking login]

**Objective:** Thêm `status` enum + `tier` enum fields đã có sẵn trong response — chỉ cần FE type khớp. Nhưng BE đã trả `status` + `tier` rồi; vấn đề nằm ở FE. Đây thuộc về FE (Task 6).

→ **Move to Task 6 (FE types fix).**

---

## Task 3: Setup backend local runtime (Java + MySQL)

**Objective:** Cho phép chạy `user-service` + gateway + downstream services trên Windows không cần Docker.

**Files:**
- Create: `pcms/mvnw` + `pcms/mvnw.cmd` + `pcms/.mvn/wrapper/` (Maven Wrapper)
- Create: `pcms/scripts/run-local-no-docker.sh`
- Create: `pcms/scripts/setup-mysql-no-docker.md`

**Step 1: Kiểm tra Java 17+**

```bash
java -version
# Nếu < 17 hoặc chưa có: download JDK 17 từ https://adoptium.net/ (Temurin)
# Hoặc qua Scoop: scoop install temurin17
```

**Step 2: Kiểm tra MySQL**

```bash
# Kiểm tra XAMPP / MySQL service
net start | grep -i mysql
# Hoặc nếu XAMPP đang chạy:
ls /c/xampp/mysql/bin/mysql.exe 2>/dev/null && echo "XAMPP found"
```

Nếu chưa có MySQL:
```bash
# Download + start MySQL community:
# https://dev.mysql.com/downloads/mysql/ (chọn Windows MSI)
# Hoặc dùng XAMPP: https://www.apachefriends.org/
```

**Step 3: Tạo databases + user (dùng password mặc định trong application.yml)**

Mở MySQL client, chạy:
```sql
-- Từ pcms/scripts/init-databases.sql — kiểm tra nội dung trước khi chạy
SOURCE C:/Users/ADMIN/Downloads/temp_v12/pcms/scripts/init-databases.sql;
```

(Backend dùng `pcms_user` / `pcms_pass` theo `docker-compose.yml` line 25-26, port `3306`.)

**Step 4: Sửa application.yml của tất cả services từ `localhost:3306` (default) — KHÔNG CẦN SỬA** vì config-server trỏ về `jdbc:mysql://localhost:3306` (mặc định). Kiểm tra nhanh:

```bash
grep -rn "jdbc:mysql" pcms/config-server/src/main/resources/
# Nếu thấy: jdbc:mysql://mysql:3306 → service đang chạy docker host; cần đổi thành localhost khi chạy local
```

Nếu config trong `config-server` dùng `mysql:3306` (docker hostname), cần thêm profile `local` riêng hoặc đổi default. (Xem Task 3.5)

**Step 5: Tạo Maven Wrapper (nếu chưa có)**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
# Cách 1: dùng Maven đã cài (nếu có)
mvn -N wrapper:wrapper
# Cách 2: copy từ project khác đã có wrapper
cp -r ../some-project/.mvn .
cp ../some-project/mvnw .
cp ../some-project/mvnw.cmd .
chmod +x mvnw
./mvnw --version
```

Nếu `mvn` không có, dùng Maven download trực tiếp:
```bash
# Maven Wrapper Bootstrap từ file có sẵn
curl -L -o mvnw.zip https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper-distributions/3.9.9/maven-wrapper-distributions-3.9.9.zip
unzip mvnw.zip
```

**Step 6: Tạo script chạy local**

Tạo file `pcms/scripts/run-local-no-docker.sh`:
```bash
#!/usr/bin/env bash
# Run PCMS backend locally (no Docker)
# Pre-req: Java 17+, MySQL 8.0 đang chạy ở localhost:3306
set -e
cd "$(dirname "$0")/.."

# Set config profile = default (không dùng docker hostname)
export SPRING_PROFILES_ACTIVE=default

# Start config-server trước
./mvnw -pl config-server spring-boot:run &
sleep 20

# Discovery server
./mvnw -pl discovery-server spring-boot:run &
sleep 20

# API Gateway
./mvnw -pl api-gateway spring-boot:run &
sleep 15

# Business services (chạy song song)
for svc in user-service branch-service catalog-service category-service \
  supplier-service inventory-service customer-service order-service \
  payment-service prescription-service notification-service report-service; do
  ./mvnw -pl $svc spring-boot:run &
  sleep 8
done

echo "All services started. Gateway: http://localhost:8080"
wait
```

**Step 7: Verify**

```bash
curl -s http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

**Step 8: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
git add scripts/run-local-no-docker.sh mvnw mvnw.cmd .mvn/
git commit -m "build: add Maven Wrapper + local no-docker run script (INT-02)"
```

---

## Task 4: Verify & regenerate BCrypt seed hash

**Objective:** Đảm bảo `admin@pcms.vn` / `admin123` thực sự login được.

**Files:**
- Modify: `pcms/scripts/seed-admin-user.sql`
- Create: `pcms/scripts/generate-bcrypt-hash.java` (one-off tool)

**Step 1: Verify hash hiện tại**

Tạo file nhỏ để test:
```java
// TestHash.java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class TestHash {
  public static void main(String[] a) {
    BCryptPasswordEncoder e = new BCryptPasswordEncoder(10);
    String hash = "$2a$10$YxNztL.9cWZ2JniaTdY8TOYTZVhaY96FfQj3S4YWSmymuDv/PiCMS";
    System.out.println("admin123 matches: " + e.matches("admin123", hash));
    System.out.println("admin@123 matches: " + e.matches("admin@123", hash));
  }
}
```

Run:
```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
# Compile against user-service dependencies
./mvnw -pl user-service exec:java -Dexec.mainClass="TestHash" -Dexec.classpathScope=compile
```

**Step 2: Nếu hash sai (rất có thể) — regenerate bằng user-service đang chạy**

Cách 1: dùng `BCryptPasswordEncoder` qua một endpoint tạm (qua Swagger UI nếu có). Cách 2: chạy Java snippet:

```java
// GenerateHash.java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class GenerateHash {
  public static void main(String[] a) {
    BCryptPasswordEncoder e = new BCryptPasswordEncoder(10);
    System.out.println("admin123 -> " + e.encode("admin123"));
    System.out.println("pharma123 -> " + e.encode("pharma123"));
  }
}
```

**Step 3: Cập nhật `seed-admin-user.sql`** với hash mới + cả `pharmacist01@pcms.vn` / `pharma123`.

**Step 4: Apply vào DB local**

```bash
mysql -u pcms_user -ppcms_pass pcms_user < pcms/scripts/seed-admin-user.sql
```

**Step 5: Verify login bằng curl**

```bash
curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pcms.vn","password":"admin123"}' | jq .accessToken
# Expected: "eyJ..."
```

**Step 6: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
git add scripts/seed-admin-user.sql
git commit -m "fix(auth): regenerate BCrypt hash for seed admin/pharmacist (INT-04)"
```

---

## Task 5: CORS cho direct service calls (optional, for swagger-only access)

**Skip task này** vì gateway CORS đã có cho `:3000`. Direct service-to-service từ browser không cần thiết (gateway là entry point duy nhất).

→ **Mark cancelled.**

---

## Task 6: Fix FE types khớp BE response (LoginResponse + Customer + AuthUser)

**Objective:** Cập nhật FE types để khớp shape BE trả về.

**Files:**
- Modify: `pcms-frontend/src/types/auth.ts`
- Modify: `pcms-frontend/src/types/customer.ts`
- Modify: `pcms-frontend/src/types/user.ts` (thêm status đã có, verify các field khác)

**Step 1: Sửa `pcms-frontend/src/types/auth.ts`**

Verify shape `LoginResponse` đã khớp với Task 1 (nested `user`). AuthUser cần thêm `status`:
```typescript
import type { UUID, ISODate, UserStatus } from './common';
import type { Role } from './auth';

export type Role = 'ADMIN' | 'CEO' | 'BRANCH_MANAGER' | 'PHARMACIST' | 'CUSTOMER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: UUID;
  email: string;
  fullName: string;
  role: Role;
  branchId: UUID | null;
  status: UserStatus;  // NEW — thêm để check ACTIVE/LOCKED
}
```

(Chú ý: `Role` đã được export ở line 8 — không cần import lại.)

**Step 2: Sửa `pcms-frontend/src/types/customer.ts`**

Thêm `status`, `tier`:
```typescript
import type { UUID, ISODate, Gender } from './common';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Customer {
  id: UUID;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  status: CustomerStatus;  // NEW
  points: number;
  tier: LoyaltyTier;       // NEW
  createdAt: ISODate;
  updatedAt: ISODate;
}
```

**Step 3: Verify `User` type ở `pcms-frontend/src/types/user.ts`**

`UserResponse` BE có: `id, email, fullName, phone, role, branchId, status, lastLoginAt, createdAt, updatedAt`.
FE `User` đã có hết. ✅ Không cần sửa.

**Step 4: Verify Medicine type ở `pcms-frontend/src/types/medicine.ts`**

`MedicineResponse` BE có: `id, sku, name, categoryId, supplierId, price (BigDecimal), unit, prescriptionRequired, imageUrl, status, createdAt, updatedAt`.
FE `Medicine` có: cùng fields + `price: number`. Cần verify Jackson serialize BigDecimal thành number hay string. (Mặc định Spring Boot: serialize thành number nếu dùng `WRITE_BIGDECIMAL_AS_PLAIN=false`; thường là number. Có thể phải thêm config.)

→ Nếu cần, thêm vào `pcms-frontend/next.config.js`:
```javascript
// KHÔNG CẦN sửa vì BE serialize đúng (number). Verify bằng curl:
curl -s http://localhost:8080/api/v1/medicines?size=1 | jq '.data[0].price | type'
// Expected: "number"
```

**Step 5: Verify `LocalDateTime` format**

```bash
curl -s http://localhost:8080/api/v1/users?size=1 | jq '.data[0].createdAt'
# Expected: "2026-06-22T11:00:00" or "2026-06-22T11:00:00.000+00:00"
```

Nếu format khác ISO 8601, cần thêm Jackson config:
```yaml
# application.yml mỗi service
spring:
  jackson:
    serialization:
      write-dates-as-timestamps: false
    time-zone: Asia/Ho_Chi_Minh
```

**Step 6: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add src/types/auth.ts src/types/customer.ts
git commit -m "fix(types): align with backend response shapes (INT-06)"
```

---

## Task 7: Update AuthContext to handle nested user response (FE)

**Objective:** Đảm bảo `auth-context.tsx` lưu đúng `user` nested object.

**Files:**
- Modify: `pcms-frontend/src/lib/auth/auth.ts` (line 16-22: đã đúng vì `response.data` trả `LoginResponse` nested → OK)
- Verify: `pcms-frontend/src/lib/auth/auth-context.tsx` (line 42-48: gán `response.user` → OK nếu response nested)

**Step 1: Đọc lại 2 file**

```bash
cat /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend/src/lib/auth/auth.ts
cat /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend/src/lib/auth/auth-context.tsx
```

**Step 2: Verify logic**

`auth.ts:15-23`:
```typescript
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
  const { accessToken, refreshToken, user } = response.data;  // ← destructure user
  saveTokens(accessToken, refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return response.data;
}
```

Nếu backend trả `{ ..., user: { id, email, ... } }` thì `user` destructure = nested object. ✅ OK.

`auth-context.tsx:40-49`:
```typescript
const login = async (credentials: LoginRequest) => {
  const response = await authLogin(credentials);
  setState({
    user: response.user,  // ← gán nested user vào state.user
    ...
  });
};
```

✅ OK.

**Step 3: Add try-catch + token expiry refresh (defensive)**

Sửa `auth.ts` để handle refresh token khi 401:
```typescript
// Thêm vào client.ts (đã có sẵn interceptor):
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh });
          saveTokens(res.data.accessToken, res.data.refreshToken);
          if (error.config?.headers) {
            error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          }
          return apiClient.request(error.config);
        } catch {
          clearTokens();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

**Step 4: Manual test**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
npm run dev
# Open http://localhost:3000/login
# Login admin@pcms.vn / admin123
# Verify: redirect to /home, no error
```

**Step 5: Commit**

```bash
git add src/lib/auth/auth.ts src/lib/api/client.ts
git commit -m "feat(auth): add refresh token interceptor (INT-07)"
```

---

## Task 8: Verify Dashboard home loads real data

**Objective:** `/home` (HomeView) gọi `fetchDashboardSummary()` — 6 endpoints song song — phải trả dữ liệu thật.

**Files:**
- Verify: `pcms-frontend/src/features/home/services/dashboardService.ts` (đã đúng)
- Test: manual trong browser

**Step 1: Start frontend + backend**

```bash
# Terminal 1: backend
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
./scripts/run-local-no-docker.sh

# Terminal 2: frontend
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
npm run dev
```

**Step 2: Verify 6 endpoints từ curl**

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pcms.vn","password":"admin123"}' | jq -r .accessToken)

# 6 endpoints dashboard cần
for ep in users branches medicines customers orders inventory/low-stock; do
  echo "=== $ep ==="
  curl -s -H "Authorization: Bearer $TOKEN" \
    "http://localhost:8080/api/v1/${ep}?size=1" | jq '.total // (.data | length) // .'
done
```

**Step 3: Mở browser `http://localhost:3000/home`**

- Phải thấy: 4 stat cards (Users, Branches, Medicines, Customers) với số > 0 nếu DB có data
- Recent orders list (có thể trống nếu chưa tạo order)
- Low stock items (có thể trống)
- Không có error trong console

**Step 4: Fix nếu 1 endpoint fail**

Nếu `/api/v1/inventory/low-stock` trả 404:
- Check gateway route — đã có ở line 65-70 của `application.yml`. ✅
- Check inventory-service controller có endpoint đó không.

**Step 5: Commit (chỉ khi có fix)**

Nếu không cần fix, skip commit. Nếu có:
```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add .
git commit -m "fix(dashboard): handle edge cases in summary fetch (INT-08)"
```

---

## Task 9: Verify Users list page renders real data

**Objective:** `/(dashboard)/users` list + form CRUD hoạt động với DB thật.

**Files:**
- Verify: `pcms-frontend/src/app/(dashboard)/users/page.tsx`
- Verify: `pcms-frontend/src/features/users/`

**Step 1: Mở `http://localhost:3000/users` sau khi login**

- Phải thấy table với users từ DB (admin, pharmacist, ...)
- Click "Thêm" → form modal
- Test create user mới
- Test reset password
- Test deactivate (DELETE)

**Step 2: Fix column mismatches nếu có**

Nếu `role` hiển thị sai label:
- `ROLE_LABELS` ở `pcms-frontend/src/lib/utils/constants.ts` — check có đủ `ADMIN, CEO, BRANCH_MANAGER, PHARMACIST, CUSTOMER` không.

**Step 3: Test pagination**

URL params `?page=0&size=20` phải navigate qua các page.

**Step 4: Commit (nếu có fix)**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add src/features/users/ src/lib/utils/constants.ts
git commit -m "fix(users): align labels + handle missing fields (INT-09)"
```

---

## Task 10: Verify Customers, Medicines, Suppliers, Branches, Inventory pages

**Objective:** 5 pages list còn lại render + CRUD thật.

**Steps:** Lặp lại pattern Task 9 cho mỗi page:
- `/(dashboard)/customers` (UC08)
- `/(dashboard)/medicines` (UC04)
- `/(dashboard)/suppliers` (UC11)
- `/(dashboard)/branches` (UC03)
- `/(dashboard)/inventory` (UC05)

Mỗi page:
1. Mở URL trong browser
2. Verify table có data
3. Test form CRUD
4. Fix column/form mismatch
5. Commit per page

**Commit mẫu:**
```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add src/features/customers/
git commit -m "fix(customers): add status + tier columns (INT-10-customers)"
```

---

## Task 11: Verify Orders, Payments, Prescriptions, Notifications, Reports pages

**Objective:** 5 transactional pages với data thật.

**Steps:** Giống Task 10, áp dụng cho:
- `/(dashboard)/orders` (UC06) — thường list orders theo status
- `/(dashboard)/payments` (UC07)
- `/(dashboard)/prescriptions` (UC12) — check UC12 có quyền
- `/(dashboard)/notifications` (UC13)
- `/(dashboard)/reports` (UC09) — có thể cần call `/api/v1/reports/revenue`, `/api/v1/reports/inventory`

**Lưu ý đặc biệt:**
- `orders` cần query `?status=PAID&size=5` cho dashboard home
- `prescriptions` cần quyền PHARMACIST hoặc BRANCH_MANAGER
- `reports` cần quyền ADMIN/CEO/BRANCH_MANAGER

---

## Task 12: Add API error toasts globally

**Objective:** Mọi 4xx/5xx error từ backend hiện toast cho user.

**Files:**
- Modify: `pcms-frontend/src/lib/api/client.ts`
- Modify: `pcms-frontend/src/app/layout.tsx` (Toaster đã có trong DashboardLayout, đủ)

**Step 1: Sửa response interceptor để show toast**

```typescript
// client.ts
import toast from 'react-hot-toast';

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = getErrorMessage(error);
    // 401 đã handle ở Task 7
    if (error.response?.status !== 401 && typeof window !== 'undefined') {
      // Không show toast cho network errors khi offline
      if (error.response) {
        toast.error(message, { duration: 4000 });
      }
    }
    return Promise.reject(error);
  }
);
```

**Step 2: Verify**

Login fail → thấy toast lỗi.
Tạo user invalid → thấy toast validation error.

**Step 3: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add src/lib/api/client.ts
git commit -m "feat(api): show error toasts globally (INT-12)"
```

---

## Task 13: Update .env.local.example + docs

**Objective:** Document cách cấu hình + chạy.

**Files:**
- Create: `pcms-frontend/.env.local.example`
- Create: `pcms-frontend/docs/INTEGRATION.md`

**Step 1: Tạo .env.local.example**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

(Copy từ `.env.local` hiện tại, public vars only.)

**Step 2: Tạo `docs/INTEGRATION.md`**

Nội dung:
- Yêu cầu: Java 17+, MySQL 8.0 ở localhost:3306, Node 18+
- Bước 1: Chạy backend (`./scripts/run-local-no-docker.sh`)
- Bước 2: Tạo DB + seed (mysql < scripts/init-databases.sql && mysql < scripts/seed-admin-user.sql)
- Bước 3: Chạy frontend (`npm run dev`)
- Bước 4: Login admin@pcms.vn / admin123
- Troubleshooting: CORS, JWT, BigDecimal, time zone

**Step 3: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add .env.local.example docs/INTEGRATION.md
git commit -m "docs: add integration setup guide (INT-13)"
```

---

## Task 14: Final end-to-end smoke test (scene-by-scene)

**Objective:** Verify toàn bộ flow từ login → list → create → update → delete không lỗi.

**Step 1: Script test tự động (curl)**

Tạo `pcms/scripts/smoke-test-integration.sh`:
```bash
#!/usr/bin/env bash
set -e
API="http://localhost:8080/api/v1"

echo "=== 1. Login ==="
TOKEN=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pcms.vn","password":"admin123"}' | jq -r .accessToken)
[ -z "$TOKEN" ] && { echo "LOGIN FAILED"; exit 1; }
echo "OK"

echo "=== 2. List Users ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/users?size=5" | jq '.data | length'

echo "=== 3. List Medicines ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/medicines?size=5" | jq '.data | length'

echo "=== 4. List Customers ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/customers?size=5" | jq '.data | length'

echo "=== 5. List Orders ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/orders?size=5" | jq '.data | length'

echo "=== 6. Dashboard (low-stock) ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/inventory/low-stock" | jq 'length'

echo "=== 7. Auth Me ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/auth/me" | jq '.email'

echo "=== 8. Reports Revenue ==="
curl -s -H "Authorization: Bearer $TOKEN" "$API/reports/revenue" | jq '.'

echo "=== ALL PASSED ==="
```

**Step 2: Run**

```bash
chmod +x pcms/scripts/smoke-test-integration.sh
./pcms/scripts/smoke-test-integration.sh
```

**Step 3: Fix any failures** (lặp lại task tương ứng)

**Step 4: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms
git add scripts/smoke-test-integration.sh
git commit -m "test(integration): add end-to-end smoke test (INT-14)"
```

---

## Task 15: Document known issues & future work

**Files:**
- Create: `docs/KNOWN-ISSUES.md`

**Step 1: Liệt kê tất cả fixes đã làm + open questions**

Ví dụ:
- ✅ Login response shape — fixed
- ✅ CORS — already enabled
- ⚠️ Refresh token flow — basic only, no rotation tracking
- ⚠️ BigDecimal price — depends on Jackson config
- 🔴 PWA service worker caches `/api/*` with NetworkFirst — may serve stale data when offline
- 🔴 Customer portal (B2C) routes use `localhost:3000` slugs but service runs on `8093` — need separate config

**Step 2: Commit**

```bash
cd /c/Users/ADMIN/Downloads/temp_v12/pcms-frontend
git add docs/KNOWN-ISSUES.md
git commit -m "docs: list integration known issues (INT-15)"
```

---

## Risks & Open Questions

| # | Risk | Mitigation |
|---|---|---|
| R1 | Maven Wrapper không có sẵn, Maven chưa install | Task 3 Step 5 có nhiều fallback (copy từ project khác, download trực tiếp) |
| R2 | MySQL 8.0 cần local install (XAMPP hoặc native) | Task 3 Step 2 verify trước; nếu không có, cài XAMPP (~5 phút) |
| R3 | Config-server dùng docker hostname `mysql:3306` khi chạy docker profile | Task 3 Step 4 kiểm tra; nếu sai, tạo `application-local.yml` riêng cho mỗi service |
| R4 | BCrypt hash seed có thể không tương ứng `admin123` (rất cao) | Task 4 có verify + regenerate flow |
| R5 | Backend services 1-13 compile chậm lần đầu (~10-15 phút tổng) | Run song song (script đã có background `&`) |
| R6 | Có thể có services chưa build (target/classes thiếu cho 1 số service) | `./mvnw clean install -DskipTests` trước |
| R7 | AuthContext có thể không handle `user.status=LOCKED` từ login response | Task 6 thêm `status` vào AuthUser; thêm check ở Task 7 nếu cần |
| R8 | 30+ endpoints types chưa cover hết (e.g. `/api/v1/reports/*`) | Lặp Task 10-11 cho từng page; commit per page |
| R9 | `LocalDateTime` timezone có thể lệch nếu BE không config TZ | Task 6 Step 5 verify + add Jackson config nếu cần |
| R10 | Next.js PWA service worker cache `/api/*` có thể serve stale data | Task 12/15 đã note known issue; cache control qua `Cache-Control: no-store` ở BE responses |

---

## Verification Checklist (final)

- [ ] Backend services compile + start không lỗi
- [ ] `curl /api/v1/auth/login` trả nested `user` object
- [ ] `curl /api/v1/users` trả `data[]` array
- [ ] `curl /api/v1/medicines` trả price as number
- [ ] Frontend `npm run dev` mở `http://localhost:3000`
- [ ] Login form submit → redirect `/home` không error
- [ ] `/home` dashboard hiển thị stats
- [ ] `/users` list có data
- [ ] `/customers` list có data
- [ ] `/medicines` list có data
- [ ] Tất cả 13 dashboard pages (`/users`, `/medicines`, `/customers`, `/branches`, `/categories`, `/suppliers`, `/inventory`, `/orders`, `/payments`, `/prescriptions`, `/notifications`, `/reports`, `/search`) render được
- [ ] Form CRUD (create/update/delete) hoạt động trên 1 page
- [ ] Error toast hiện khi 4xx/5xx
- [ ] 401 auto redirect to /login
- [ ] Token persists qua page refresh

---

## Files Likely To Change (tổng hợp)

**Backend (pcms):**
- `user-service/src/main/java/com/pcms/userservice/dto/response/LoginResponse.java` (Task 1)
- `user-service/src/main/java/com/pcms/userservice/service/UserService.java` (Task 1)
- `scripts/seed-admin-user.sql` (Task 4)
- `scripts/run-local-no-docker.sh` (Task 3) — new
- `scripts/smoke-test-integration.sh` (Task 14) — new
- `mvnw` + `mvnw.cmd` + `.mvn/` (Task 3) — new

**Frontend (pcms-frontend):**
- `src/types/auth.ts` (Task 6)
- `src/types/customer.ts` (Task 6)
- `src/lib/api/client.ts` (Task 7 + 12)
- `src/lib/auth/auth.ts` (verify Task 7)
- `.env.local.example` (Task 13) — new
- `docs/INTEGRATION.md` (Task 13) — new
- `docs/KNOWN-ISSUES.md` (Task 15) — new
- Có thể: 1-3 fixes ở `src/features/*/components/*Form.tsx` nếu validation không khớp BE

**Estimated total: 12-15 file changes, 6-8 commits, 14 tasks.**

---

## Subagent Dispatch Plan (recommended batching)

| Batch | Tasks | Subagent count |
|---|---|---|
| 1 | Task 1, 3, 4 (BE fixes + setup) | 1 |
| 2 | Task 6, 7, 12 (FE types + auth + toasts) | 1 |
| 3 | Task 8, 9 (verify dashboard + users) | 1 |
| 4 | Task 10 (verify 5 list pages) | 1 |
| 5 | Task 11 (verify 5 transactional pages) | 1 |
| 6 | Task 13, 14, 15 (docs + smoke test) | 1 |

6 batches × 2-3 tasks = ~14 tasks done in 6 dispatch rounds.

---

**End of plan.**
