// =====================================================
// PCMS - Installment feature types
// =====================================================

export interface InstallmentQuoteRequest {
  amount: number;
  tenureMonths: number;
  paymentMethod?: string;
}

export interface InstallmentQuote {
  quoteId: string;
  amount: number;
  monthlyPayment: number;
  tenureMonths: number;
  interestRate: number;
  totalInterest: number;
  totalPayment: number;
  provider: string;
  expiresAt: string;
}

export interface InstallmentConfirmRequest {
  quoteId: string;
  paymentMethod: string;
}

export interface InstallmentConfirmResponse {
  success: boolean;
  contractNo?: string;
  message?: string;
}