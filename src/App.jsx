import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ROUTES } from '@core/router/paths.js'
import { BranchDetailPage } from '@modules/branch-service/pages/BranchDetailPage.jsx'
import { BranchFormPage } from '@modules/branch-service/pages/BranchFormPage.jsx'
import { BranchListPage } from '@modules/branch-service/pages/BranchListPage.jsx'
import { MedicineDetailPage } from '@modules/catalog-service/pages/MedicineDetailPage.jsx'
import { MedicineFormPage } from '@modules/catalog-service/pages/MedicineFormPage.jsx'
import { MedicineListPage } from '@modules/catalog-service/pages/MedicineListPage.jsx'
import { InventoryAlertsPage } from '@modules/inventory-service/pages/InventoryAlertsPage.jsx'
import { InventoryBatchDetailPage } from '@modules/inventory-service/pages/InventoryBatchDetailPage.jsx'
import { InventoryHistoryPage } from '@modules/inventory-service/pages/InventoryHistoryPage.jsx'
import { InventoryListPage } from '@modules/inventory-service/pages/InventoryListPage.jsx'
import { InventoryOperationPage } from '@modules/inventory-service/pages/InventoryOperationPage.jsx'
import { LoginPage } from '@modules/user-service/pages/LoginPage.jsx'
import { RegisterPage } from '@modules/user-service/pages/RegisterPage.jsx'
import { ForgotPasswordPage } from '@modules/user-service/pages/ForgotPasswordPage.jsx'
import { ResetPasswordPage } from '@modules/user-service/pages/ResetPasswordPage.jsx'
import { AuditLogPage } from '@modules/user-service/pages/AuditLogPage.jsx'
import { UserDashboardPage } from '@modules/user-service/pages/UserDashboardPage.jsx'
import { UserDetailPage } from '@modules/user-service/pages/UserDetailPage.jsx'
import { UserFormPage } from '@modules/user-service/pages/UserFormPage.jsx'
import { UserListPage } from '@modules/user-service/pages/UserListPage.jsx'
// B2C Shop pages
import { ShopLayout } from '@modules/customer-portal-service/layouts/ShopLayout.jsx'
import { ShopHomePage } from '@modules/customer-portal-service/pages/ShopHomePage.jsx'
import { SearchPage } from '@modules/customer-portal-service/pages/SearchPage.jsx'
import { PdpPage } from '@modules/customer-portal-service/pages/PdpPage.jsx'
import { CartPage } from '@modules/customer-portal-service/pages/CartPage.jsx'
import { CheckoutPage } from '@modules/customer-portal-service/pages/CheckoutPage.jsx'
import { OrderSuccessPage } from '@modules/customer-portal-service/pages/OrderSuccessPage.jsx'
import { OrderTrackingPage } from '@modules/customer-portal-service/pages/OrderTrackingPage.jsx'
import { StoreLocatorPage } from '@modules/customer-portal-service/pages/StoreLocatorPage.jsx'

function ShopRedirect({ to }) {
  const params = useParams()
  return <Navigate to={to(params)} replace />
}

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<ShopLayout><ShopHomePage /></ShopLayout>} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.DASHBOARD} element={<UserDashboardPage />} />
        <Route path={ROUTES.USERS} element={<UserListPage />} />
        <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogPage />} />
        <Route path={ROUTES.USER_NEW} element={<UserFormPage mode="create" />} />
        <Route path={ROUTES.USER_DETAIL(':userId')} element={<UserDetailPage />} />
        <Route path={ROUTES.USER_EDIT(':userId')} element={<UserFormPage mode="edit" />} />
        <Route path={ROUTES.BRANCHES} element={<BranchListPage />} />
        <Route path={ROUTES.BRANCH_NEW} element={<BranchFormPage mode="create" />} />
        <Route path={ROUTES.BRANCH_DETAIL(':branchId')} element={<BranchDetailPage />} />
        <Route
          path={ROUTES.BRANCH_EDIT(':branchId')}
          element={<BranchFormPage mode="edit" />}
        />
        <Route path={ROUTES.MEDICINES} element={<MedicineListPage />} />
        <Route path={ROUTES.MEDICINE_NEW} element={<MedicineFormPage mode="create" />} />
        <Route path={ROUTES.MEDICINE_DETAIL(':medicineId')} element={<MedicineDetailPage />} />
        <Route
          path={ROUTES.MEDICINE_EDIT(':medicineId')}
          element={<MedicineFormPage mode="edit" />}
        />
        <Route path={ROUTES.INVENTORY} element={<InventoryListPage />} />
        <Route
          path={ROUTES.INVENTORY_IMPORT}
          element={<InventoryOperationPage mode="import" />}
        />
        <Route
          path={ROUTES.INVENTORY_EXPORT}
          element={<InventoryOperationPage mode="export" />}
        />
        <Route
          path={ROUTES.INVENTORY_TRANSFER}
          element={<InventoryOperationPage mode="transfer" />}
        />
        <Route path={ROUTES.INVENTORY_ALERTS} element={<InventoryAlertsPage />} />
        <Route path={ROUTES.INVENTORY_HISTORY} element={<InventoryHistoryPage />} />
        <Route
          path={ROUTES.INVENTORY_BATCH(':batchId')}
          element={<InventoryBatchDetailPage />}
        />

        {/* B2C Shop routes */}
        <Route path={ROUTES.SEARCH} element={<ShopLayout><SearchPage /></ShopLayout>} />
        <Route path={ROUTES.PRODUCT(':id')} element={<ShopLayout><PdpPage /></ShopLayout>} />
        <Route path={ROUTES.CART} element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path={ROUTES.CHECKOUT} element={<ShopLayout><CheckoutPage /></ShopLayout>} />
        <Route path={ROUTES.ORDER_SUCCESS(':orderNumber')} element={<ShopLayout><OrderSuccessPage /></ShopLayout>} />
        <Route path={ROUTES.ORDER_TRACKING} element={<ShopLayout><OrderTrackingPage /></ShopLayout>} />
        <Route path={ROUTES.STORES} element={<ShopLayout><StoreLocatorPage /></ShopLayout>} />

        {/* Backward-compat redirects from old /shop/* URLs */}
        <Route path="/shop" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path="/shop/search" element={<Navigate to={ROUTES.SEARCH} replace />} />
        <Route path="/shop/product/:id" element={<ShopRedirect to={(params) => ROUTES.PRODUCT(params.id)} />} />
        <Route path="/shop/cart" element={<Navigate to={ROUTES.CART} replace />} />
        <Route path="/shop/checkout" element={<Navigate to={ROUTES.CHECKOUT} replace />} />
        <Route path="/shop/order-success/:orderNumber" element={<ShopRedirect to={(params) => ROUTES.ORDER_SUCCESS(params.orderNumber)} />} />
        <Route path="/shop/order-tracking" element={<Navigate to={ROUTES.ORDER_TRACKING} replace />} />
        <Route path="/shop/stores" element={<Navigate to={ROUTES.STORES} replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
