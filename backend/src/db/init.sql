CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    owner_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    from_account UUID NOT NULL,
    to_account UUID NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (from_account)
        REFERENCES accounts(id),

    FOREIGN KEY (to_account)
        REFERENCES accounts(id)
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY,

    transaction_id UUID NOT NULL,

    account_id UUID NOT NULL,

    entry_type VARCHAR(10)
    CHECK (
        entry_type IN (
            'DEBIT',
            'CREDIT'
        )
    ),

    amount BIGINT NOT NULL,

    created_at TIMESTAMP
    DEFAULT NOW(),

    FOREIGN KEY (
        transaction_id
    )
    REFERENCES transactions(id),

    FOREIGN KEY (
        account_id
    )
    REFERENCES accounts(id)
);

CREATE INDEX idx_account
ON ledger_entries(account_id);

CREATE INDEX idx_transaction
ON ledger_entries(transaction_id);

CREATE TABLE fraud_events (
    id UUID PRIMARY KEY,

    account_id UUID NOT NULL,

    transaction_count INTEGER NOT NULL,

    reason VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blacklisted_accounts (
    account_id UUID PRIMARY KEY,
    blacklisted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blacklist_events (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO accounts(
    id,
    owner_name
)
VALUES(
    '00000000-0000-0000-0000-000000000001',
    'SYSTEM'
) ON CONFLICT(id) DO NOTHING;