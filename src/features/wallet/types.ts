// =====================================================
// PCMS - Wallet feature types
// =====================================================

export interface Medication {
  name: string;
  dosage: string;
  since: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface HealthWallet {
  bloodType: string;
  height: string;
  weight: string;
  bmi: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Medication[];
  emergencyContact: EmergencyContact;
}

export type UpdateWalletRequest = Partial<HealthWallet>;
