import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/user-dashboard" element={<UserDashboardPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/audit-logs" element={<AuditLogPage />} />
        <Route path="/users/new" element={<UserFormPage mode="create" />} />
        <Route path="/users/:userId" element={<UserDetailPage />} />
        <Route path="/users/:userId/edit" element={<UserFormPage mode="edit" />} />
        <Route path="/branches" element={<BranchListPage />} />
        <Route path="/branches/new" element={<BranchFormPage mode="create" />} />
        <Route path="/branches/:branchId" element={<BranchDetailPage />} />
        <Route
          path="/branches/:branchId/edit"
          element={<BranchFormPage mode="edit" />}
        />
        <Route path="/medicines" element={<MedicineListPage />} />
        <Route path="/medicines/new" element={<MedicineFormPage mode="create" />} />
        <Route path="/medicines/:medicineId" element={<MedicineDetailPage />} />
        <Route
          path="/medicines/:medicineId/edit"
          element={<MedicineFormPage mode="edit" />}
        />
        <Route path="/inventory" element={<InventoryListPage />} />
        <Route
          path="/inventory/import"
          element={<InventoryOperationPage mode="import" />}
        />
        <Route
          path="/inventory/export"
          element={<InventoryOperationPage mode="export" />}
        />
        <Route
          path="/inventory/transfer"
          element={<InventoryOperationPage mode="transfer" />}
        />
        <Route path="/inventory/alerts" element={<InventoryAlertsPage />} />
        <Route path="/inventory/history" element={<InventoryHistoryPage />} />
        <Route
          path="/inventory/batches/:batchId"
          element={<InventoryBatchDetailPage />}
        />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
