// =====================================================
// PCMS - RX Console feature types
// =====================================================

export interface Customer360 {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  tier?: string;
  totalSpent?: number;
  totalOrders?: number;
  allergies?: string[];
  conditions?: string[];
  recentOrders?: Array<{
    id: string;
    code: string;
    total: number;
    createdAt: string;
  }>;
  familyMembers?: Array<{ id: string; name: string; relation: string }>;
  vipMark?: { tier: string; reason?: string };
}

export interface CrossSellProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  reason?: string;
  imageUrl?: string;
  score?: number;
}

export interface DrugCheckRequest {
  medicines: string[];
  symptoms?: string[];
}

export interface DrugCheckResult {
  medicineId?: string;
  interactions?: Array<{
    drugA: string;
    drugB: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  }>;
  warnings?: string[];
  safe: boolean;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName?: string;
  notes: string;
  dueDate: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  response?: string;
}

export interface VipMark {
  id: string;
  customerId: string;
  customerName?: string;
  tier: 'GOLD' | 'PLATINUM' | 'DIAMOND';
  reason: string;
  createdAt?: string;
}