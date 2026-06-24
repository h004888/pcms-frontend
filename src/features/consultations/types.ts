// =====================================================
// PCMS - Consultations feature types
// =====================================================

export type ConsultationType = 'IN_PERSON' | 'PHONE' | 'VIDEO';
export type ConsultationStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Consultation {
  id: string;
  customerId: string;
  pharmacistId?: string;
  type: ConsultationType;
  topic: string;
  scheduledAt: string;
  status: ConsultationStatus;
  notes?: string;
}

export interface ConsultationMessage {
  id: string;
  consultationId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'PHARMACIST';
  message: string;
  sentAt: string;
}

export interface ConsultationsResponse {
  consultations: Consultation[];
  total: number;
}