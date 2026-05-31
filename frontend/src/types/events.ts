export interface TransactionEvent {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  createdAt: string;
}