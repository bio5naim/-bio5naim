export interface ReceiptItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface CompanyInfo {
  name: string;
  regNumber: string; // BN: 3577792
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  phones: string[];
  email: string;
  facebook: string;
  socialTag: string; // @Davetrackng
  shopNumber: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface PaymentDetails {
  method: 'Bank Transfer' | 'Cash' | 'POS Terminal' | 'Cheque';
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  referenceNo: string;
  amountPaid: number;
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  dueDate?: string;
  company: CompanyInfo;
  customer: CustomerInfo;
  items: ReceiptItem[];
  payment: PaymentDetails;
  taxRate: number; // e.g. 0 or 7.5%
  discount: number;
  notes: string;
  terms: string[];
  issuedBy: string;
}
