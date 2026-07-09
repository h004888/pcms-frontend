# Frontend PCMS Structure

Tai lieu nay mapping frontend package voi backend microservice trong `pcms`.

## Core packages

```text
src/
  app/
    layouts/
    providers/
    routes/
    store/
  assets/
    fonts/
    icons/
    images/
    styles/
  config/
    env/
    permissions/
    routes/
    services/
  core/
    api/
    auth/
    constants/
    errors/
    hooks/
    http/
    storage/
    utils/
  shared/
    components/
    forms/
    hooks/
    layouts/
    modals/
    table/
    ui/
    utils/
  modules/
```

## Backend service mapping

| Backend module | Frontend module |
| --- | --- |
| `user-service` | `src/modules/user-service` |
| `branch-service` | `src/modules/branch-service` |
| `catalog-service` | `src/modules/catalog-service` |
| `category-service` | `src/modules/category-service` |
| `supplier-service` | `src/modules/supplier-service` |
| `inventory-service` | `src/modules/inventory-service` |
| `customer-service` | `src/modules/customer-service` |
| `order-service` | `src/modules/order-service` |
| `payment-service` | `src/modules/payment-service` |
| `prescription-service` | `src/modules/prescription-service` |
| `notification-service` | `src/modules/notification-service` |
| `report-service` | `src/modules/report-service` |
| `customer-portal-service` | `src/modules/customer-portal-service` |
| `pharmacist-workbench-service` | `src/modules/pharmacist-workbench-service` |
| `health-tools-service` | `src/modules/health-tools-service` |
| `ecom-ops-service` | `src/modules/ecom-ops-service` |

## Structure trong moi service module

```text
src/modules/<service-name>/
  api/
  components/
  hooks/
  pages/
  routes/
  schemas/
  services/
  store/
```

## Backend infrastructure mapping

| Backend module | Frontend vi tri nen dung |
| --- | --- |
| `api-gateway` | `src/core/api`, `src/core/http`, `src/config/services` |
| `pcms-common` | `src/shared`, `src/core/constants`, `src/core/utils` |
| `config-server` | `src/config/env`, `.env*` |
| `discovery-server` | Khong can module frontend rieng |

## Gateway base URL

Backend gateway dang chay mac dinh tai:

```text
http://localhost:8080/api/v1
```

Frontend dung bien moi truong:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```
