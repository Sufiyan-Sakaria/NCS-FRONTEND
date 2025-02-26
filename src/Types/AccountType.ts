export type Account = {
  id: string;
  name: string;
  code: string;
  groupId: string;
  accountType:
    | "LEDGER"
    | "BANK"
    | "CASH"
    | "RECEIVABLES"
    | "PAYABLES"
    | "EXPENSE"
    | "INCOME"
    | "CAPITAL";
  openingBalance: number;
  currentBalance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};
