# SentinelLedger

A distributed fintech platform built to demonstrate real-world backend engineering concepts including event-driven architecture, double-entry accounting, fraud detection, distributed locking, Redis Streams, consumer groups, observability, and real-time monitoring.

## Overview

SentinelLedger is intentionally designed as a distributed systems project rather than a CRUD banking application.

The platform simulates a modern financial transaction processing system with:

* Immutable double-entry ledger
* Event-driven transaction processing
* Fraud detection engine
* Automatic account blacklisting
* Redis Streams and Consumer Groups
* Distributed locking
* Idempotent transaction processing
* Real-time dashboard updates
* Prometheus monitoring
* Grafana observability
* Dockerized infrastructure

---

## Architecture

```text
React + TypeScript Frontend
            │
            ▼
Node.js + Express + TypeScript
            │
 ┌──────────┼──────────┐
 ▼          ▼          ▼
Postgres   Redis    Socket.IO
            │
            ├─ Distributed Locks
            ├─ Idempotency
            ├─ Blacklist Cache
            ├─ Redis Streams
            ├─ Consumer Groups
            ├─ Pub/Sub
            └─ Worker Heartbeat
                    │
                    ▼
          Python Fraud Worker
                    │
                    ▼
             Fraud Events
                    │
                    ▼
          Automatic Blacklisting
                    │
                    ▼
             Live Dashboard

Prometheus
    │
    ▼
Grafana
```

---

## Tech Stack

### Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* Redis
* Socket.IO

### Fraud Processing

* Python
* Redis Streams
* Redis Consumer Groups

### Frontend

* React
* TypeScript

### Observability

* Prometheus
* Grafana

### Infrastructure

* Docker
* Docker Compose

---

## Core Features

### Double-Entry Accounting

Every transaction creates matching debit and credit ledger entries.

Benefits:

* Immutable ledger
* Auditability
* Accurate balance reconstruction
* No stored account balances

Balances are derived directly from ledger entries.

---

### Distributed Locking

Redis-based distributed locks prevent concurrent transaction corruption.

```text
lock:<accountId>
```

---

### Idempotency Protection

Transfers require an idempotency key.

```http
X-Idempotency-Key
```

This prevents duplicate transaction execution caused by retries or network failures.

---

### Event-Driven Processing

Transfers are published into Redis Streams.

```text
transactions-stream
```

Transactions are asynchronously consumed by fraud detection workers.

---

### Consumer Groups

Fraud workers process transactions using Redis Consumer Groups.

```text
Consumer Group: fraud-group
Consumer: worker-1
```

Benefits:

* Horizontal scaling
* Load distribution
* Reliable message processing
* Pending message tracking

---

### Fraud Detection Engine

A dedicated Python worker continuously monitors transaction activity.

Current rule:

```text
More than 5 transfers
within 10 seconds
```

When suspicious activity is detected:

```text
Transaction
    ↓
Fraud Detection
    ↓
Fraud Event
    ↓
Automatic Blacklisting
    ↓
Dashboard Notification
```

---

### Automatic Blacklisting

Fraudulent accounts are automatically restricted from performing further transactions.

```text
blacklist:<accountId>
```

Blacklisting events are persisted and broadcast to the dashboard.

---

### Real-Time Monitoring

Socket.IO provides live updates for:

* Transactions
* Fraud events
* Blacklist events
* Activity feed

---

### Observability

Prometheus metrics include:

```text
sentinel_transactions_total
sentinel_fraud_events_total
sentinel_blacklisted_accounts
sentinel_transfer_duration_seconds
sentinel_funding_total
```

Grafana dashboards visualize:

* System health
* Fraud activity
* Transaction volume
* Operational metrics

---

## API Endpoints

### Accounts

```http
POST /accounts
GET /accounts
GET /accounts/:id
GET /accounts/:id/balance
GET /accounts/:id/transactions
GET /accounts/:id/timeline
GET /accounts/stats
```

### Transfers

```http
POST /transfer
```

### Admin

```http
POST /admin/fund-account
POST /admin/blacklist
POST /admin/unblacklist
GET /admin/blacklist
```

### Fraud

```http
GET /fraud-events
```

### Dashboard

```http
GET /dashboard/metrics
```

### Operations

```http
GET /operations/metrics
```

### Events

```http
GET /events/recent-transactions
GET /events/recent-fraud
GET /events/recent-blacklist
GET /events/activity
```

### Metrics

```http
GET /metrics
```

---

## Running the Project

### Clone Repository

```bash
git clone https://github.com/your-username/SentinelLedger.git
cd SentinelLedger
```

### Start Services

```bash
docker compose up --build
```

Services:

```text
Backend      : 3000
Grafana      : 3001
Prometheus   : 9090
Redis        : 6379
```

---

## System Components

```text
backend
fraud-worker
postgres
redis
prometheus
grafana
frontend
```

---

## Project Highlights

SentinelLedger demonstrates production-oriented backend engineering concepts including:

* Distributed Systems
* Event-Driven Architecture
* Redis Streams
* Consumer Groups
* Fraud Detection
* Distributed Locking
* Idempotency
* Real-Time Communication
* Observability
* Reliability Engineering
* Double-Entry Accounting

---

## Current Status

Implemented:

* Account management
* Double-entry ledger
* Transfers
* Funding operations
* Fraud detection
* Automatic blacklisting
* Redis Streams
* Consumer Groups
* Socket.IO events
* Prometheus metrics
* Grafana monitoring
* Worker heartbeat monitoring

Planned:

* Retry Queue
* Dead Letter Queue
* Pending Message Recovery
* Multi-worker scaling
* Integration testing
* CI/CD pipelines
* Stream recovery tooling

---

## License

MIT License
