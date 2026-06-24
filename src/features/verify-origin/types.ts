// =====================================================
// PCMS - Verify Origin feature types
// =====================================================

export interface VerifyOriginRequest {
  code: string;
  type?: 'BARCODE' | 'QR';
}

export interface VerifyOriginResult {
  authentic: boolean;
  medicineName?: string;
  manufacturer?: string;
  batchNo?: string;
  manufacturedAt?: string;
  expiresAt?: string;
  registrationNo?: string;
  origin?: string;
  message?: string;
}