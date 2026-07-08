import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpFromLine,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "@core/http/apiClient.js";
import { listBranches } from "@modules/branch-service/api/branchApi.js";
import {
  listMedicines,
  listSuppliers,
} from "@modules/catalog-service/api/medicineApi.js";
import { DashboardLayout } from "@shared/layouts/DashboardLayout.jsx";
import {
  BranchSelect,
  MedicineSelect,
  SupplierSelect,
} from "../components/InventoryLookupSelects.jsx";
import {
  exportStock,
  getBatchesByBranchAndMedicine,
  importStock,
  transferStock,
} from "../api/inventoryApi.js";
import {
  getBatchQuantity,
  toOptionalPositiveInteger,
  toPositiveInteger,
  unwrapList,
} from "../services/inventoryFormatters.js";

const CONFIG = {
  import: {
    title: "Nhập kho",
    description:
      "Tạo lô tồn kho mới cho một chi nhánh. Hệ thống kiểm tra thuốc, chi nhánh, số lô và hạn dùng trước khi lưu.",
    icon: ArrowDownToLine,
  },
  export: {
    title: "Xuất kho",
    description:
      "Giảm tồn theo nguyên tắc FIFO dựa trên thuốc, chi nhánh và số lượng.",
    icon: ArrowUpFromLine,
  },
  transfer: {
    title: "Chuyển kho",
    description:
      "Chuyển tồn giữa hai chi nhánh và ghi nhận đầy đủ giao dịch xuất, nhập.",
    icon: ArrowRightLeft,
  },
};

const EMPTY_FORM = {
  medicineId: "",
  branchId: "",
  fromBranchId: "",
  toBranchId: "",
  batchNo: "",
  barcode: "",
  qty: "",
  expiryDate: "",
  minStockLevel: "",
  supplierId: "",
  reason: "",
};

function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function InventoryOperationPage({ mode }) {
  const config = CONFIG[mode] || CONFIG.import;
  const Icon = config.icon;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  });
  const medicinesQuery = useQuery({
    queryKey: ["medicines"],
    queryFn: () => listMedicines({ page: 0, size: 100 }),
  });
  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => listSuppliers({ page: 0, size: 100 }),
    enabled: mode === "import",
  });
  const availabilityQuery = useQuery({
    queryKey: [
      "inventory-availability",
      mode,
      form.medicineId,
      mode === "transfer" ? form.fromBranchId : form.branchId,
    ],
    queryFn: () =>
      getBatchesByBranchAndMedicine(
        mode === "transfer" ? form.fromBranchId : form.branchId,
        form.medicineId,
      ),
    enabled:
      mode !== "import" &&
      Boolean(form.medicineId) &&
      Boolean(mode === "transfer" ? form.fromBranchId : form.branchId),
  });

  const branches = useMemo(
    () => unwrapList(branchesQuery.data),
    [branchesQuery.data],
  );
  const medicines = useMemo(
    () => unwrapList(medicinesQuery.data),
    [medicinesQuery.data],
  );
  const suppliers = useMemo(
    () => unwrapList(suppliersQuery.data),
    [suppliersQuery.data],
  );
  const availableQuantity = useMemo(() => {
    return unwrapList(availabilityQuery.data).reduce(
      (sum, batch) => sum + getBatchQuantity(batch),
      0,
    );
  }, [availabilityQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (mode === "import") {
        return importStock({
          medicineId: form.medicineId,
          branchId: form.branchId,
          batchNo: form.batchNo.trim(),
          barcode: form.barcode.trim() || undefined,
          qty: toPositiveInteger(form.qty),
          expiryDate: form.expiryDate,
          supplierId: form.supplierId || undefined,
          minStockLevel: toOptionalPositiveInteger(form.minStockLevel),
        });
      }

      if (mode === "transfer") {
        return transferStock({
          medicineId: form.medicineId,
          fromBranchId: form.fromBranchId,
          toBranchId: form.toBranchId,
          qty: toPositiveInteger(form.qty),
          reason: form.reason.trim(),
        });
      }

      return exportStock({
        medicineId: form.medicineId,
        branchId: form.branchId,
        qty: toPositiveInteger(form.qty),
        reason: form.reason.trim(),
      });
    },
    onSuccess: (result) => {
      toast.success(`Đã hoàn tất ${config.title.toLocaleLowerCase("vi-VN")}.`);
      queryClient.invalidateQueries({ queryKey: ["inventory-stock-level"] });

      if (mode === "import" && result?.id) {
        navigate(`/inventory/batches/${result.id}`);
        return;
      }

      navigate("/inventory");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const qty = toPositiveInteger(form.qty);
    const minStockLevel = toOptionalPositiveInteger(form.minStockLevel);

    if (!form.medicineId) {
      nextErrors.medicineId = "Vui lòng chọn thuốc.";
    }

    if (!qty) {
      nextErrors.qty = "Số lượng phải là số nguyên lớn hơn 0.";
    }

    if (mode === "import") {
      if (!form.branchId) {
        nextErrors.branchId = "Vui lòng chọn chi nhánh nhập.";
      }

      if (!form.batchNo.trim()) {
        nextErrors.batchNo = "Số lô là bắt buộc.";
      }

      if (!form.expiryDate) {
        nextErrors.expiryDate = "Ngày hết hạn là bắt buộc.";
      } else if (form.expiryDate <= todayDateString()) {
        nextErrors.expiryDate = "Ngày hết hạn phải sau hôm nay.";
      }

      if (form.minStockLevel.trim() && !minStockLevel) {
        nextErrors.minStockLevel =
          "Mức tồn tối thiểu phải là số nguyên lớn hơn 0.";
      }
    } else if (mode === "transfer") {
      if (!form.fromBranchId) {
        nextErrors.fromBranchId = "Vui lòng chọn chi nhánh nguồn.";
      }

      if (!form.toBranchId) {
        nextErrors.toBranchId = "Vui lòng chọn chi nhánh đích.";
      }

      if (form.fromBranchId && form.fromBranchId === form.toBranchId) {
        nextErrors.toBranchId =
          "Chi nhánh đích phải khác chi nhánh nguồn.";
      }

      if (!form.reason.trim()) {
        nextErrors.reason = "Lý do chuyển kho là bắt buộc.";
      }
    } else {
      if (!form.branchId) {
        nextErrors.branchId = "Vui lòng chọn chi nhánh xuất.";
      }

      if (!form.reason.trim()) {
        nextErrors.reason = "Lý do xuất kho là bắt buộc.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    saveMutation.mutate();
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">{config.title}</h1>
            <p className="page-description">{config.description}</p>
          </div>

          <Link className="btn btn-outline" to="/inventory">
            <ArrowLeft size={16} aria-hidden="true" />
            Quay lại
          </Link>
        </header>

        {branchesQuery.isError || medicinesQuery.isError ? (
          <div className="error-state" role="alert">
            Không tải được chi nhánh hoặc thuốc. Vui lòng kiểm tra kết nối và
            thử lại.
          </div>
        ) : null}

        {mode === "import" && suppliersQuery.isError ? (
          <div className="error-state" role="note">
            Không tải được nhà cung cấp. Vẫn có thể nhập kho không chọn nhà cung
            cấp.
          </div>
        ) : null}

        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Thông tin thao tác</h2>
              <p className="card-subtitle">
                Kiểm tra kỹ thông tin trước khi lưu thao tác kho.
              </p>
            </div>
            <Icon color="var(--accent-700)" size={22} aria-hidden="true" />
          </div>

          <div className="card-body form-grid">
            <MedicineSelect
              medicines={medicines}
              value={form.medicineId}
              error={errors.medicineId}
              onChange={(value) => setField("medicineId", value)}
            />

            {mode === "transfer" ? (
              <>
                <BranchSelect
                  branches={branches}
                  label="Chi nhánh nguồn"
                  value={form.fromBranchId}
                  error={errors.fromBranchId}
                  onChange={(value) => setField("fromBranchId", value)}
                />
                <BranchSelect
                  branches={branches}
                  label="Chi nhánh đích"
                  value={form.toBranchId}
                  error={errors.toBranchId}
                  onChange={(value) => setField("toBranchId", value)}
                />
              </>
            ) : (
              <BranchSelect
                branches={branches}
                label={
                  mode === "import" ? "Chi nhánh nhập" : "Chi nhánh xuất"
                }
                value={form.branchId}
                error={errors.branchId}
                onChange={(value) => setField("branchId", value)}
              />
            )}

            <label className="field">
              <span className="field-label">Số lượng</span>
              <input
                className="input mono"
                inputMode="numeric"
                value={form.qty}
                placeholder="100"
                onChange={(event) => setField("qty", event.target.value)}
              />
              {mode !== "import" ? (
                <p className="field-hint">
                  Khả dụng theo lô hiện tại:{" "}
                  <span className="mono">
                    {availabilityQuery.isLoading ? "..." : availableQuantity}
                  </span>
                </p>
              ) : null}
              {errors.qty ? (
                <span className="field-error">{errors.qty}</span>
              ) : null}
            </label>

            {mode === "import" ? (
              <>
                <label className="field">
                  <span className="field-label">Số lô</span>
                  <input
                    className="input mono"
                    value={form.batchNo}
                    maxLength={80}
                    placeholder="LOT-2026-001"
                    onChange={(event) =>
                      setField("batchNo", event.target.value)
                    }
                  />
                  {errors.batchNo ? (
                    <span className="field-error">{errors.batchNo}</span>
                  ) : null}
                </label>

                <label className="field">
                  <span className="field-label">Mã vạch</span>
                  <input
                    className="input mono"
                    value={form.barcode}
                    maxLength={120}
                    placeholder="Tự sinh nếu bỏ trống"
                    onChange={(event) =>
                      setField("barcode", event.target.value)
                    }
                  />
                </label>

                <label className="field">
                  <span className="field-label">Ngày hết hạn</span>
                  <input
                    className="input mono"
                    type="date"
                    value={form.expiryDate}
                    onChange={(event) =>
                      setField("expiryDate", event.target.value)
                    }
                  />
                  {errors.expiryDate ? (
                    <span className="field-error">{errors.expiryDate}</span>
                  ) : null}
                </label>

                <label className="field">
                  <span className="field-label">Mức tồn tối thiểu</span>
                  <input
                    className="input mono"
                    inputMode="numeric"
                    value={form.minStockLevel}
                    placeholder="10"
                    onChange={(event) =>
                      setField("minStockLevel", event.target.value)
                    }
                  />
                  <p className="field-hint">Bỏ trống để dùng mức mặc định.</p>
                  {errors.minStockLevel ? (
                    <span className="field-error">{errors.minStockLevel}</span>
                  ) : null}
                </label>

                <SupplierSelect
                  suppliers={suppliers}
                  value={form.supplierId}
                  onChange={(value) => setField("supplierId", value)}
                />
              </>
            ) : (
              <label className="field form-grid-full">
                <span className="field-label">
                  {mode === "transfer"
                    ? "Lý do chuyển kho"
                    : "Lý do xuất kho"}
                </span>
                <textarea
                  className="textarea"
                  value={form.reason}
                  maxLength={255}
                  placeholder={
                    mode === "transfer"
                      ? "Điều chuyển bổ sung tồn cho chi nhánh đích"
                      : "Xuất hủy, xuất kiểm kê, xuất điều chỉnh..."
                  }
                  onChange={(event) => setField("reason", event.target.value)}
                />
                {errors.reason ? (
                  <span className="field-error">{errors.reason}</span>
                ) : null}
              </label>
            )}
          </div>

          <div className="form-actions">
            <Link className="btn btn-outline" to="/inventory">
              Hủy
            </Link>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saveMutation.isPending}
            >
              <Save size={16} aria-hidden="true" />
              {saveMutation.isPending ? "Đang lưu..." : config.title}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
