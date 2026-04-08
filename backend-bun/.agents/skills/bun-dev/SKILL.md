---
name: bun-dev
description: SOLID principles and development best practices for Bun applications.
---

# Bun Development Skill & Best Practices

## SOLID Principles
- **S — Single Responsibility**: Each class, module, or function should have only one reason to change. Focus on a specific task.
- **O — Open/Closed**: Software entities should be open for extension but closed for modification. Use Interfaces or Abstract classes to extend features without modifying the core code.
- **L — Liskov Substitution**: Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.
- **I — Interface Segregation**: Instead of one large interface, split it into many specific, purposeful interfaces so clients don't have to depend on methods they don't use.
- **D — Dependency Inversion**: Depend on abstractions (interfaces/abstract classes), not on concrete implementations.

## Core Development Rules
- **Separation of Concerns**: Clearly separate Controller, Service, and Repository layers. Do not mix logic across different layers.
- **Law of Demeter**: "Only talk to your immediate neighbors." An object should only request services from objects directly related to it.
- **Composition over Inheritance**: Prefer injecting behaviors (inject behavior) over deep multi-level inheritance.
- **Explicit over Implicit**: Types must be clear, code should be explicit, and avoid "hidden magic" (magic strings/behaviors).
- **Fail Fast**: Validate inputs as early as possible. If an error occurs, throw a clear error immediately.
- **CQS (Command Query Separation)**: A function should either be a Command (perform an action, change state) or a Query (return data), but not both.
- **Immutability**: Use `readonly` and `const` by default. Minimize side effects.
- **Pure Functions**: The same input should always return the same output. Easier for testing.
- **Alias Paths**: Always use the `@/` alias for importing modules from the `src/` directory (e.g., `import { ... } from "@/shared/utils"`). Avoid long relative paths (e.g., `../../../shared`).

## Patterns & Architecture
- **Repository Pattern**: Data access should always be through an abstraction layer (interface).
- **Dependency Injection**: Inject dependencies via constructors to increase flexibility and testability.
- **Factory / Builder**: Use these to clearly initialize complex objects.
- **Least Privilege**: Provide the minimum necessary scope and permissions for each entity.

## Reliability & Security
- **Idempotency**: Ensure that performing an operation N times has the same result as performing it once (especially important for retry/network).
- **Defense in Depth**: Implement validation at multiple layers (layered validation), don't just trust a single point.
- **Design for Failure**: Always have Timeout, Retry, and Circuit Breaker mechanisms ready.

## Observability
- **Structured Logging**: Logs must have Trace IDs, Metrics, and clear error structures. Code is only truly good when its state can be observed and tracked.
