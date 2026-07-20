import { Route, Routes, Navigate, useParams } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ROUTES } from '@core/router/paths.js'
import { GuestRoute } from '@core/router/GuestRoute.jsx'
import { ProtectedRoute } from '@core/router/ProtectedRoute.jsx'
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
import { PaymentPendingPage } from '@modules/customer-portal-service/pages/PaymentPendingPage.jsx'
import { OrderTrackingPage } from '@modules/customer-portal-service/pages/OrderTrackingPage.jsx'
import { MyAccountPage } from '@modules/customer-portal-service/pages/MyAccountPage.jsx'
import { MyOrdersPage } from '@modules/customer-portal-service/pages/MyOrdersPage.jsx'
import { OrderDetailPage } from '@modules/customer-portal-service/pages/OrderDetailPage.jsx'
import { StoreLocatorPage } from '@modules/customer-portal-service/pages/StoreLocatorPage.jsx'
// New modules
import { ReportPage } from '@modules/report-service/pages/ReportPage.jsx'
import { SupplierListPage } from '@modules/supplier-service/pages/SupplierListPage.jsx'
import { PrescriptionListPage } from '@modules/prescription-service/pages/PrescriptionListPage.jsx'
import { NotificationPage } from '@modules/notification-service/pages/NotificationPage.jsx'


function ShopRedirect({ to }) {
  const params = useParams()
  return <Navigate to={to(params)} replace />
}

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<ShopLayout><ShopHomePage /></ShopLayout>} />
        <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path={ROUTES.RESET_PASSWORD} element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path={ROUTES.USERS} element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
        <Route path={ROUTES.AUDIT_LOGS} element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
        <Route path={ROUTES.USER_NEW} element={<ProtectedRoute><UserFormPage mode="create" /></ProtectedRoute>} />
        <Route path={ROUTES.USER_DETAIL(':userId')} element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
        <Route path={ROUTES.USER_EDIT(':userId')} element={<ProtectedRoute><UserFormPage mode="edit" /></ProtectedRoute>} />
        <Route path={ROUTES.BRANCHES} element={<ProtectedRoute><BranchListPage /></ProtectedRoute>} />
        <Route path={ROUTES.BRANCH_NEW} element={<ProtectedRoute><BranchFormPage mode="create" /></ProtectedRoute>} />
        <Route path={ROUTES.BRANCH_DETAIL(':branchId')} element={<ProtectedRoute><BranchDetailPage /></ProtectedRoute>} />
        <Route
          path={ROUTES.BRANCH_EDIT(':branchId')}
          element={<ProtectedRoute><BranchFormPage mode="edit" /></ProtectedRoute>}
        />
        <Route path={ROUTES.MEDICINES} element={<ProtectedRoute><MedicineListPage /></ProtectedRoute>} />
        <Route path={ROUTES.MEDICINE_NEW} element={<ProtectedRoute><MedicineFormPage mode="create" /></ProtectedRoute>} />
        <Route path={ROUTES.MEDICINE_DETAIL(':medicineId')} element={<ProtectedRoute><MedicineDetailPage /></ProtectedRoute>} />
        <Route
          path={ROUTES.MEDICINE_EDIT(':medicineId')}
          element={<ProtectedRoute><MedicineFormPage mode="edit" /></ProtectedRoute>}
        />
        <Route path={ROUTES.INVENTORY} element={<ProtectedRoute><InventoryListPage /></ProtectedRoute>} />
        <Route
          path={ROUTES.INVENTORY_IMPORT}
          element={<ProtectedRoute><InventoryOperationPage mode="import" /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.INVENTORY_EXPORT}
          element={<ProtectedRoute><InventoryOperationPage mode="export" /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.INVENTORY_TRANSFER}
          element={<ProtectedRoute><InventoryOperationPage mode="transfer" /></ProtectedRoute>}
        />
        <Route path={ROUTES.INVENTORY_ALERTS} element={<ProtectedRoute><InventoryAlertsPage /></ProtectedRoute>} />
        <Route path={ROUTES.INVENTORY_HISTORY} element={<ProtectedRoute><InventoryHistoryPage /></ProtectedRoute>} />
        <Route
          path={ROUTES.INVENTORY_BATCH(':batchId')}
          element={<ProtectedRoute><InventoryBatchDetailPage /></ProtectedRoute>}
        />

        {/* ── New modules ───────────────────────────────────────────── */}
        <Route path={ROUTES.REPORTS} element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
        <Route path={ROUTES.SUPPLIERS} element={<ProtectedRoute><SupplierListPage /></ProtectedRoute>} />
        <Route path={ROUTES.PRESCRIPTIONS} element={<ProtectedRoute><PrescriptionListPage /></ProtectedRoute>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        <Route path={ROUTES.NOTIFICATIONS_COMPOSE} element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />

        {/* B2C Shop routes */}
        <Route path={ROUTES.SEARCH} element={<ShopLayout><SearchPage /></ShopLayout>} />
        <Route path={ROUTES.PRODUCT(':slug')} element={<ShopLayout><PdpPage /></ShopLayout>} />
        <Route path={ROUTES.CART} element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path={ROUTES.CHECKOUT} element={<ShopLayout><CheckoutPage /></ShopLayout>} />
        <Route path={ROUTES.ORDER_SUCCESS(':orderNumber')} element={<ShopLayout><OrderSuccessPage /></ShopLayout>} />
        <Route path="/payment/pending/:orderNumber" element={<ShopLayout><PaymentPendingPage /></ShopLayout>} />
        <Route path={ROUTES.ORDER_TRACKING} element={<ShopLayout><OrderTrackingPage /></ShopLayout>} />
        <Route path={ROUTES.STORES} element={<ShopLayout><StoreLocatorPage /></ShopLayout>} />
        <Route path={ROUTES.MY_ACCOUNT} element={<ShopLayout><ProtectedRoute><MyAccountPage /></ProtectedRoute></ShopLayout>} />
        <Route path={ROUTES.MY_ORDERS} element={<ShopLayout><ProtectedRoute><MyOrdersPage /></ProtectedRoute></ShopLayout>} />
        <Route path={ROUTES.ORDER_DETAIL(':orderId')} element={<ShopLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></ShopLayout>} />

        {/* Backward-compat redirects from old /shop/* URLs */}
        <Route path="/shop" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path="/shop/search" element={<Navigate to={ROUTES.SEARCH} replace />} />
        <Route path="/shop/cart" element={<Navigate to={ROUTES.CART} replace />} />
        <Route path="/shop/checkout" element={<Navigate to={ROUTES.CHECKOUT} replace />} />
        <Route path="/shop/order-success/:orderNumber" element={<ShopRedirect to={(params) => ROUTES.ORDER_SUCCESS(params.orderNumber)} />} />
        <Route path="/shop/order-tracking" element={<Navigate to={ROUTES.ORDER_TRACKING} replace />} />
        <Route path="/shop/stores" element={<Navigate to={ROUTES.STORES} replace />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  )
}

export default App
