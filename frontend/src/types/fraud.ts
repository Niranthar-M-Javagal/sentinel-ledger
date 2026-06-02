export interface FraudEvent {
    id: string;
    account_id: string;
    transaction_count: number;
    reason: string;
    created_at: string;
}