# Sprint 3 — RX AI Cross-Sell + Reviews (FE + BE)

> Sprint phức tạp nhất. 2 task có cả FE lẫn BE:
> - T10: 2 endpoint AI từ `ai-engine-service` Python
> - T11: Tạo entity Review + 3 endpoint customer-portal

## Mục tiêu Sprint 3

- ✅ RX Console hoạt động đầy đủ (cross-sell + drug-check AI)
- ✅ Reviews page có data thật (có seed ban đầu)
- ✅ Có thể post review mới từ customer portal

## Tasks

| # | Task | Loại | Effort |
|:--:|---|---|:-:|
| T10 | `/rx/cross-sell` + `/rx/drug-check` (FE + BE Python) | FE + BE | M (45 ph) |
| T11 | `/reviews` endpoints (FE + BE entity + DB) | FE + BE | M (60 ph) |

**Tổng:** ~2 ngày dev (vì BE phức tạp).

---

## T10 — AI cross-sell + drug-check

### Mục tiêu
2 endpoint `RX_CROSS_SELL` và `RX_DRUG_CHECK` trong `endpoints.ts` không có backend. Triển khai Option A: backend stub trả về mock JSON.

### Files thay đổi

#### Backend — thêm 2 endpoint AI

**File 1:** `pcms/ai-engine-service/app/api/v1/cross_sell.py` (mới)

```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class CrossSellRequest(BaseModel):
    medicine_ids: List[str]
    customer_id: str | None = None

class CrossSellResponse(BaseModel):
    suggestions: List[dict]  # {medicineId, name, reason}

@router.post("/rx/cross-sell")
async def cross_sell(req: CrossSellRequest) -> CrossSellResponse:
    # Stub: trả về danh sách rỗng (sẽ thay bằng AI model sau)
    return CrossSellResponse(suggestions=[
        {
            "medicineId": req.medicine_ids[0] if req.medicine_ids else "unknown",
            "name": "Gợi ý AI (stub)",
            "reason": "Tính năng AI cross-sell chưa hoàn thiện — đang ở chế độ stub"
        }
    ] for _ in range(min(3, len(req.medicine_ids))))
```

**File 2:** `pcms/ai-engine-service/app/api/v1/drug_check.py` (mới)

```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class DrugCheckRequest(BaseModel):
    medicine_ids: List[str]

class Interaction(BaseModel):
    pair: List[str]  # 2 medicine id
    severity: str    # "LOW" | "MEDIUM" | "HIGH"
    description: str

class DrugCheckResponse(BaseModel):
    interactions: List[Interaction]
    safe: bool

@router.post("/rx/drug-check")
async def drug_check(req: DrugCheckRequest) -> DrugCheckResponse:
    # Stub: chưa phân tích — luôn trả safe=true
    return DrugCheckResponse(
        interactions=[],
        safe=True,
    )
```

**File 3:** `pcms/ai-engine-service/app/main.py` (đăng ký router)

```python
from app.api.v1.cross_sell import router as cross_sell_router
from app.api.v1.drug_check import router as drug_check_router

app.include_router(cross_sell_router, prefix="/api/v1")
app.include_router(drug_check_router, prefix="/api/v1")
```

**File 4:** `pcms/api-gateway/src/main/resources/application.yml`

Thêm route:
```yaml
- id: ai-engine-rx
  uri: lb://ai-engine-service
  predicates:
    - Path=/api/v1/rx/cross-sell,/api/v1/rx/drug-check
  filters:
    - StripPrefix=2
```

**Lưu ý routing:** `ai-engine-service` đã có sẵn — cần xác minh nó đã register Eureka, nếu chưa thì check `ai-engine-service/src/main/resources/application.yml` đã có `spring.cloud.discovery` chưa.

#### Frontend

**File 5:** `pcms-frontend/src/features/rx-console/services/rxConsoleService.ts` (mở rộng)

```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export async function crossSell(medicineIds: string[], customerId?: string) {
  const res = await apiClient.post(API_ENDPOINTS.RX_CROSS_SELL, {
    medicineIds,
    customerId,
  });
  return res.data;
}

export async function drugCheck(medicineIds: string[]) {
  const res = await apiClient.post(API_ENDPOINTS.RX_DRUG_CHECK, {
    medicineIds,
  });
  return res.data;
}
```

### Acceptance criteria

**Backend:**
- [ ] `POST /api/v1/rx/cross-sell` trả 200 `{suggestions: [...]}`
- [ ] `POST /api/v1/rx/drug-check` trả 200 `{interactions:[], safe:true}`
- [ ] Gateway route config thêm mới
- [ ] Service `ai-engine-service` đăng ký Eureka thành công

**Frontend:**
- [ ] `rxConsoleService.crossSell()` hoạt động từ RX Console
- [ ] `rxConsoleService.drugCheck()` hoạt động khi Pharmacist check tương tác
- [ ] Loading + error state hợp lý

### Postman update

Thêm 2 endpoint mới vào folder `12 - report-service` hoặc tạo folder mới `14 - ai-engine`:

```
"RX - Cross-sell", POST, /rx/cross-sell
"RX - Drug-check", POST, /rx/drug-check
```

### Rủi ro
| Mức | Mức | Mô tả | Giảm thiểu |
|:-:|:-:|---|---|
| 🔴 Cao | BE Python | ai-engine-service có thể là Java (Spring) chứ không phải Python FastAPI. Cần verify trước. | Check `ai-engine-service/pom.xml` hoặc `requirements.txt`. Nếu Java → viết `@RestController` thay vì Python. |
| 🟡 TB | Gateway | Nếu `ai-engine-service` KHÔNG tồn tại → bỏ luôn 2 const FE. | Verify trong Eureka registry. Option B: xóa const FE. |

---

## T11 — Reviews (FE + BE)

### Mục tiêu
Trang `/reviews` và form `/reviews/new/[productSlug]` đang dùng mock. Tạo entity Review + 3 endpoint backend.

### Files thay đổi

#### Backend — entity + 3 endpoint

**File 1:** Schema migration `pcms/customer-portal-service/src/main/resources/db/migration/V002__create_review.sql` (Flyway) hoặc append vào `scripts/init-databases.sql`

```sql
CREATE TABLE IF NOT EXISTS review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_customer_medicine (customer_id, medicine_id)
);
CREATE INDEX idx_review_medicine ON review(medicine_id);
CREATE INDEX idx_review_customer ON review(customer_id);

INSERT INTO review (customer_id, medicine_id, rating, comment) VALUES
  (1, 1, 5, 'Thuốc tốt, hiệu quả rõ rệt.'),
  (1, 2, 4, 'Hơi đắng nhưng chịu được.'),
  (2, 1, 3, 'Tạm ổn, sẽ dùng tiếp.');
```

**File 2:** Entity `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/entity/Review.java` (mới)

```java
@Entity @Table(name = "review")
public class Review {
    @Id @GeneratedValue(strategy = IDENTITY) private Long id;
    private Long customerId;
    private Long medicineId;
    private Integer rating; // 1..5
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // getters/setters
}
```

**File 3:** Repository

```java
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Review> findByMedicineIdOrderByCreatedAtDesc(Long medicineId);
    Optional<Review> findByCustomerIdAndMedicineId(Long customerId, Long medicineId);
}
```

**File 4:** DTO `pcms/customer-portal-service/src/main/java/com/pcms/customerportal/dto/ReviewRequest.java`

```java
public record ReviewRequest(
    @NotNull Long medicineId,
    @Min(1) @Max(5) Integer rating,
    String comment
) {}
```

**File 5:** DTO `ReviewResponse.java`

```java
public record ReviewResponse(
    Long id,
    Long customerId,
    Long medicineId,
    Integer rating,
    String comment,
    LocalDateTime createdAt
) {}
```

**File 6:** Service `ReviewService.java`

```java
@Service
public class ReviewService {
    public ReviewResponse create(ReviewRequest req, UUID currentUserId) {
        Long customerId = resolveCustomerId(currentUserId);
        var existing = repo.findByCustomerIdAndMedicineId(customerId, req.medicineId());
        if (existing.isPresent()) {
            // Update (1 review / customer / medicine)
            Review r = existing.get();
            r.setRating(req.rating());
            r.setComment(req.comment());
            return mapper.toDto(repo.save(r));
        }
        Review r = mapper.toEntity(req, customerId);
        return mapper.toDto(repo.save(r));
    }

    public List<ReviewResponse> getByMedicine(Long medicineId) { ... }
    public List<ReviewResponse> getMine(UUID currentUserId) {
        Long customerId = resolveCustomerId(currentUserId);
        return repo.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
            .map(mapper::toDto).toList();
    }
}
```

**File 7:** Controller `ReviewsController.java`

```java
@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    @GetMapping
    public List<ReviewResponse> listByMedicine(@RequestParam Long medicineId) {
        return reviewService.getByMedicine(medicineId);
    }
    @GetMapping("/me")
    public List<ReviewResponse> myReviews(@RequestHeader("X-User-Id") UUID currentUserId) {
        return reviewService.getMine(currentUserId);
    }
    @PostMapping
    public ReviewResponse create(@Valid @RequestBody ReviewRequest req,
                                  @RequestHeader("X-User-Id") UUID currentUserId) {
        return reviewService.create(req, currentUserId);
    }
}
```

#### Frontend

**File 8:** `pcms-frontend/src/lib/api/endpoints.ts`

```typescript
REVIEWS: '/reviews',
REVIEWS_BY_MEDICINE: (medicineId: string) => `/reviews?medicineId=${medicineId}`,
MY_REVIEWS: '/reviews/me',
```

**File 9:** `pcms-frontend/src/features/reviews/services/reviewService.ts` (mới)

```typescript
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Review } from '../types';

export async function getReviewsByMedicine(medicineId: string): Promise<Review[]> {
  const res = await apiClient.get<Review[]>(API_ENDPOINTS.REVIEWS_BY_MEDICINE(medicineId));
  return res.data;
}

export async function getMyReviews(token: string): Promise<Review[]> {
  const res = await apiClient.get<Review[]>(API_ENDPOINTS.MY_REVIEWS, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.data;
}

export async function createReview(rating: number, comment: string, medicineId: string, token: string): Promise<Review> {
  const res = await apiClient.post<Review>(API_ENDPOINTS.REVIEWS,
    { rating, comment, medicineId },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return res.data;
}
```

**File 10:** `pcms-frontend/src/app/(customer)/reviews/page.tsx` (refactor)

```typescript
import { getMyReviews } from '@/features/reviews';

export default async function ReviewsPage() {
  const userToken = cookies().get('pcms_access_token')?.value;
  let reviews: Review[] = [];
  try {
    reviews = await getMyReviews(userToken);
  } catch {}
  return <ReviewList reviews={reviews} />;
}
```

**File 11:** `pcms-frontend/src/app/(customer)/reviews/new/[productSlug]/page.tsx` (form)

Convert từ Client để truyền `medicineId` (từ slug lookup).

### Acceptance criteria

**Backend:**
- [ ] Migration SQL thành công
- [ ] 3 rows seed data hiển thị khi query
- [ ] `GET /api/v1/reviews?medicineId=1` trả 200 + array
- [ ] `GET /api/v1/reviews/me` trả 200 (cần header `X-User-Id` hoặc JWT)
- [ ] `POST /api/v1/reviews` với body + header trả 200 + record mới
- [ ] Unique constraint (customer_id, medicine_id) — post 2 lần → update, không insert duplicate

**Frontend:**
- [ ] Trang `/reviews` hiển thị review list từ API
- [ ] Form `/reviews/new/[productSlug]` submit → redirect về `/reviews`
- [ ] Error state nếu API fail

**Postman:**
- [ ] 3 endpoint mới được add vào collection

### Rủi ro
| Mức | Mô tả | Giảm thiểu |
|:-:|---|---|
| 🔴 Cao | DB schema thay đổi cần test kỹ. | Test migration trên bản local trước. Nếu fail → rollback SQL + fix. |
| 🟡 TB | Repository có thể cần thêm `@EntityGraph` nếu query N+1. | Acceptable cho Sprint 3 — optimize sau. |
| 🟡 TB | Cần `customerId` resolution (auth header → customer.id). | Tận dụng `CustomerIdHeaderFilter` có sẵn trong `pcms-common`. |
| 🟢 Thấp | Medicine ID hiện tại là Long (internal), frontend dùng UUID. Cần mapping. | Verify trong table mapping — kiểu dữ liệu `medicineId` UUID vs Long. |

---

## Verification — Sprint 3

### Smoke test

| Test | Đường dẫn | Expected |
|---|---|---|
| Cross-sell API | `POST /api/v1/rx/cross-sell` | 200 |
| Drug-check API | `POST /api/v1/rx/drug-check` | 200 + safe=true |
| Reviews list (medicine) | `GET /api/v1/reviews?medicineId=1` | 200 + 2-3 records seed |
| Reviews of mine | `GET /api/v1/reviews/me` | 200 |
| Create review | `POST /api/v1/reviews` | 200 + record mới |

### Trang FE
- [ ] `/reviews` → hiển thị 2-3 review từ seed
- [ ] `/reviews/new/<slug>` → submit form → success
- [ ] `/rx-console` (Pharmacist dashboard) có nút "Check AI Cross-Sell" → gọi API

---

## Self-check
| Tiêu chí | OK? |
|---|---|
| Đủ: T10 + T11, BE + FE + DB migration | ✓ |
| Đúng: bám sát `INTEGRATION_PLAN.md` | ✓ |
| Không thừa: chỉ entities endpoints & files cần thiết | ✓ |
| Giả định: ai-engine-service là Python FastAPI (verify trước), customerId resolution qua `pcms-common` filter có sẵn | ✓ |
