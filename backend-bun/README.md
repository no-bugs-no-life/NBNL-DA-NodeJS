# Bun Modular Monolith Architecture

A production-ready, highly scalable modular monolith backend boilerplate built with [Bun](https://bun.sh/) and [Hono](https://hono.dev/).

## ✨ Features

Based on a **5-Tier Architecture**, this boilerplate includes:

- **High Performance API**: Powered by `Bun` and `Hono`.
- **Environment Validation**: `zod` guarantees strict parsing and early failure for missing environment variables.
- **Structured Logging**: `pino` and `pino-pretty` provide observable, easily searchable logs.
- **Global Error Handling**: Custom `AppError` class catches and maps operational errors to standardized API JSON responses.
- **Linting & Formatting**: Pre-configured with `@biomejs/biome`.
- **Alias Paths**: Clean imports via `@/*` pointing to `src/*`.
- **Standardized API Responses**: Centralized response wrappers (`ok`, `fail`, `paginated`).

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository and install dependencies:
   ```bash
   bun install
   ```

2. Copy the example env file (if available):
   ```bash
   cp .env.example .env
   ```
   *Make sure `PORT` and `LOG_LEVEL` are set.*

---

## 🛠️ Development Commands

| Command | Description |
|---|---|
| `bun run dev` | Khởi động server trong chế độ development (watch mode). |
| `bun start` | Chạy server ở chế độ production. |
| `bun run lint` | Chạy Biome để phát hiện các lỗi style/logic. |
| `bun run format` | Chạy Biome để tự động định dạng files. |

---

## 📁 Project Structure

This project follows a **Modular Monolith** architecture:

```text
my-app/
├── root (configs)
├── src/
│   ├── index.ts              # Entrypoint: bootstrap Hono, initialize logger & app
│   ├── config/               # Environment variables config
│   ├── shared/               # Base classes, common interfaces, generic utils
│   ├── infra/                # Technical adapters (Db, Cache, Logger)
│   ├── routes/               # Global router aggregator
│   └── modules/              # Domain components (Users, Auth, Products, etc.)
└── tests/                    # E2E and Integration tests
```

---

## 📚 Documentation & Guidelines

To ensure code consistency and architectural integrity, all contributors MUST read:

1. **[CLAUDE.md](./CLAUDE.md)** - Explains the project's folder structure, layer definitions, and baseline conventions.
2. **[SKILL.md](./.agents/skills/bun-dev/SKILL.md)** - Details the **SOLID** principles and Development Best Practices (Separation of Concerns, Immutability, CQS, Defense in Depth) used in this repository.

> **💡 Rule of Thumb:** Business logic belongs in **Service** layers. **Controllers** only handle HTTP inputs/outputs. **Repositories** only handle data access.
