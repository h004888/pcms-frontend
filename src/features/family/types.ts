// =====================================================
// PCMS - Family feature types
// =====================================================

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthYear: number;
  allergies: string[];
  conditions: string[];
}

export type CreateFamilyMemberRequest = Omit<FamilyMember, 'id'>;
export type UpdateFamilyMemberRequest = Partial<FamilyMember>;
