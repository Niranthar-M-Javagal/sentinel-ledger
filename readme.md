# SentinelLedger

Distributed financial ledger system built with Node.js, TypeScript, PostgreSQL, Redis, and Python.

SentinelLedger is a backend-focused distributed systems project that simulates core infrastructure used in modern fintech platforms, including immutable double-entry accounting, concurrency-safe transfers, distributed locking, idempotent APIs, async fraud detection, and Redis Streams event processing.

---

# Features

## Financial Ledger Engine

* Immutable double-entry ledger architecture
* ACID-safe PostgreSQL transactions
* Dynamic balance computation
* Row-level locking using `SELECT ... FOR UPDATE`
* Transaction integrity and auditability

## Distributed Systems Features

* Redis distributed mutex locking
* API idempotency protection
* Redis Streams event pipeline
* Async event-driven fraud analytics
* Sliding-window velocity detection
* Redis-based blacklist circuit breaker

## Fraud Detection Pipeline

* Python async worker
* Redis Sorted Set velocity tracking
* Real-time transfer monitoring
* Automatic account blacklisting after suspicious activity

---

# Architecture

```text
                ┌──────────────────┐
                │      Client      │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │   Express API    │
                │  Transaction API │
                └────────┬─────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Redis Locks  │ │ Idempotency  │ │ Blacklisting │
└──────┬───────┘ └──────────────┘ └──────────────┘
       │
       ▼
┌──────────────────────────────┐
│ PostgreSQL ACID Transaction  │
│  - transactions              │
│  - ledger_entries            │
└──────────────┬───────────────┘
               │
               ▼
      ┌─────────────────┐
      │ Redis Streams   │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ Python Fraud    │
      │ Detection Worker│
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ Account         │
      │ Blacklisting    │
      └─────────────────┘
```

---

# Tech Stack

## Backend

* Node.js
* TypeScript
* Express.js

## Database

* PostgreSQL

## Distributed Coordination

* Redis
* Redis Streams
* Redis Sorted Sets

## Fraud Analytics

* Python asyncio

---

# Project Structure

```text
SentinelLedger/
│
├── transaction-engine/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   │
│   └── package.json
│
├── fraud-worker/
│   └── worker.py
│
└── infra/
```

---

# Core Design Principles

## Immutable Ledger

Balances are never stored directly.

Instead, balances are computed dynamically from immutable ledger entries:

```sql
SUM(
  CASE
    WHEN entry_type='CREDIT'
    THEN amount
    ELSE -amount
  END
)
```

This ensures:

* auditability
* traceability
* transactional correctness
* financial consistency

---

# API Endpoints

## Health Check

### GET `/health`

Response:

```json
{
  "status": "healthy"
}
```

---

## Transfer Funds

### POST `/transfer`

Headers:

```http
X-Idempotency-Key: unique-request-id
```

Request Body:

```json
{
  "fromAccount": "uuid",
  "toAccount": "uuid",
  "amount": 100
}
```

Success Response:

```json
{
  "transactionId": "uuid"
}
```

Possible Error Responses:

```json
{
  "error": "Missing X-Idempotency-Key"
}
```

```json
{
  "error": "Duplicate Request"
}
```

```json
{
  "error": "Insufficient balance"
}
```

```json
{
  "error": "Account Blacklisted"
}
```

---

# Transaction Flow

```text
Acquire Redis Lock
        ↓
BEGIN PostgreSQL Transaction
        ↓
SELECT ... FOR UPDATE
        ↓
Compute Account Balance
        ↓
Validate Funds
        ↓
Insert Transaction Record
        ↓
Insert Ledger Entries
        ↓
COMMIT
        ↓
Publish Redis Stream Event
        ↓
Fraud Detection Worker Consumes Event
```

---

# Fraud Detection Logic

The Python worker continuously consumes Redis Stream events.

Fraud detection rules:

* Track transfers per account
* Maintain 10-second sliding window
* If transaction count exceeds threshold:

  * automatically blacklist account

Redis Sorted Sets are used for velocity analytics.

---

# Running Locally

## 1. Clone Repository

```bash
git clone https://github.com/Niranthar-M-Javagal/sentinel-ledger.git
```

---

## 2. Start PostgreSQL

Create database:

```sql
CREATE DATABASE sentinel_ledger;
```

---

## 3. Start Redis

Default Redis URL:

```text
redis://localhost:6379
```

---

## 4. Configure Environment Variables

### transaction-engine/.env

```env
PORT=5000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sentinel_ledger

REDIS_URL=redis://localhost:6379
```

### fraud-worker/.env

```env
REDIS_URL=redis://localhost:6379
```

---

## 5. Install Dependencies

### Transaction Engine

```bash
cd transaction-engine
npm install
```

### Fraud Worker

```bash
cd fraud-worker
pip install -r requirements.txt
```

---

## 6. Run Services

### Start Backend

```bash
npm run dev
```

### Start Fraud Worker

```bash
python worker.py
```

---

# Future Improvements

* Docker Compose setup
* JWT authentication
* Swagger/OpenAPI documentation
* k6 load testing
* Redis consumer groups
* Retry queues and DLQs
* Structured logging
* Monitoring and metrics
* CI/CD pipelines
* Kubernetes deployment

---

# Why This Project Matters

SentinelLedger focuses on backend engineering concepts commonly used in production-grade financial and distributed systems:

* concurrency control
* transactional consistency
* distributed coordination
* event-driven architecture
* fraud analytics
* fault-tolerant design

This project was built to explore systems engineering beyond traditional CRUD applications.
