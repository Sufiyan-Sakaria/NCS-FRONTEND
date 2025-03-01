export interface LedgerEntry {
  id: string;
  date: string;
  accountId: string;
  voucherId: string | null;
  returnId: string | null;
  invoiceId: string | null;
  transactionType: "DEBIT" | "CREDIT";
  amount: number;
  description: string;
  previousBalance: number | null;
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    name: string;
    code: string;
    groupId: string;
    accountType: string;
    openingBalance: number;
    currentBalance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
  voucher: {
    id: string;
    voucherType: string;
    voucherNo: number;
    date: string;
    description: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}
