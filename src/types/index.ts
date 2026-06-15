// =====================================================
// PCMS Frontend - TypeScript Type Definitions
// Matches backend entities in pcms/* services
// =====================================================

// === Common ===
export type UUID = string;
export type ISODate = string;

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// === Enums (match backend Java enums) ===
export type Role = 'ADMIN' | 'CEO' | 'BRANCH_MANAGER' | 'PHARMACIST' | 'CUSTOMER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';
export type BranchStatus = 'ACTIVE' | 'INACTIVE';
export type MedicineStatus = 'ACTIVE' | 'INACTIVE';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'QR' | 'LOYALTY_POINTS';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type TransactionType = 'IMPORT' | 'EXPORT' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'SALE' | 'ADJUSTMENT';
export type PrescriptionStatus = 'DRAFT' | 'SIGNED' | 'CANCELLED';
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';

// === Auth ===
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
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// === User (UC02) ===
export interface User {
  id: UUID;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  branchId?: UUID;
  status: UserStatus;
  lastLoginAt?: ISODate;
  lastLoginIp?: string;
  failedLoginCount?: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Branch (UC03) ===
export interface Branch {
  id: UUID;
  code: string;
  name: string;
  address: string;
  phone: string;
  managerId?: UUID;
  status: BranchStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Category ===
export interface Category {
  id: UUID;
  name: string;
  description?: string;
  createdAt: ISODate;
}

// === Medicine (UC04) ===
export interface Medicine {
  id: UUID;
  sku: string;
  name: string;
  categoryId: UUID;
  supplierId?: UUID;
  price: number;
  unit: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  status: MedicineStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Supplier (UC11) ===
export interface Supplier {
  id: UUID;
  name: string;
  taxCode: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  bankName?: string;
  bankAccount?: string;
  status: SupplierStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Customer (UC08) ===
export interface Customer {
  id: UUID;
  code: string;          // CUST-yyyy####
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  points: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Inventory (UC05) ===
export interface InventoryBatch {
  id: UUID;
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  qtyOnHand: number;
  expiryDate: string;
  minStockLevel: number;
  receivedAt: ISODate;
}

export interface InventoryTransaction {
  id: UUID;
  batchId: UUID;
  type: TransactionType;
  qty: number;
  reason?: string;
  refId?: UUID;
  actorId: UUID;
  createdAt: ISODate;
}

// === Order (UC06) ===
export interface OrderItem {
  id?: UUID;
  medicineId: UUID;
  medicineName?: string;
  batchId?: UUID;
  qty: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Order {
  id: UUID;
  orderNumber: string;        // ORD-yyyymmdd-####
  customerId: UUID;
  branchId: UUID;
  staffId?: UUID;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  prescriptionId?: UUID;
  couponCode?: string;
  items: OrderItem[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

// === Payment (UC07) ===
export interface Payment {
  id: UUID;
  orderId: UUID;
  invoiceNumber: string;     // INV-yyyymmdd-####
  paymentMethod: PaymentMethod;
  amount: number;
  tenderedAmount?: number;
  changeAmount?: number;
  transactionRef?: string;
  status: PaymentStatus;
  staffId: UUID;
  createdAt: ISODate;
}

// === Prescription (UC12) ===
export interface Prescription {
  id: UUID;
  code: string;               // RX-yyyy####
  patientId: UUID;
  doctorId: UUID;
  diagnosis: string;
  notes?: string;
  signatureHash: string;
  licenseNo?: string;
  status: PrescriptionStatus;
  issuedAt?: ISODate;
  createdAt: ISODate;
}

// === Notification (UC13) ===
export interface Notification {
  id: UUID;
  recipientId: UUID;
  channel: NotificationChannel;
  template?: string;
  title: string;
  body: string;
  status: NotificationStatus;
  retryCount: number;
  sentAt?: ISODate;
  readAt?: ISODate;
  createdAt: ISODate;
}

// === Form Types (used in Create/Edit forms) ===
export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'lastLoginIp' | 'failedLoginCount' | 'status'> & { status?: UserStatus; password?: string };
export type UpdateUserRequest = Partial<Pick<User, 'fullName' | 'phone' | 'role' | 'branchId' | 'status'>>;

export type CreateBranchRequest = Omit<Branch, 'id' | 'createdAt' | 'updatedAt' | 'managerId' | 'status'> & { status?: BranchStatus; managerId?: UUID };
export type UpdateBranchRequest = Partial<Pick<Branch, 'name' | 'address' | 'phone' | 'status' | 'managerId'>>;

export type CreateMedicineRequest = Omit<Medicine, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: MedicineStatus };
export type UpdateMedicineRequest = Partial<Pick<Medicine, 'name' | 'price' | 'unit' | 'categoryId' | 'supplierId' | 'prescriptionRequired' | 'imageUrl' | 'status'>>;

export type CreateCustomerRequest = Omit<Customer, 'id' | 'code' | 'points' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerRequest = Partial<Pick<Customer, 'name' | 'phone' | 'email' | 'address' | 'dob' | 'gender'>>;

export type CreateOrderRequest = {
  customerId: UUID;
  branchId: UUID;
  staffId?: UUID;
  items: { medicineId: UUID; quantity: number }[];
  couponCode?: string;
};

export type CreatePaymentRequest = {
  orderId: UUID;
  paymentMethod: PaymentMethod;
  amount: number;
  tenderedAmount?: number;
  staffId: UUID;
  transactionRef?: string;
};

export type CreatePrescriptionRequest = Omit<Prescription, 'id' | 'code' | 'signatureHash' | 'status' | 'issuedAt' | 'createdAt'> & { status?: PrescriptionStatus };

export type ImportStockRequest = {
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  qty: number;
  expiryDate: string;
  actorId: UUID;
  poRef?: UUID;
};

export type ExportStockRequest = {
  medicineId: UUID;
  branchId: UUID;
  qty: number;
  reason: string;
  actorId: UUID;
};
