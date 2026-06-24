// =====================================================
// PCMS - Profile feature types
// =====================================================

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
}

export interface Profile extends ProfileFormData {
  tier: string;
  memberSince: string;
}

export type UpdateProfileRequest = Partial<ProfileFormData>;
