# dot-backend (nestjs + typeorm + postgresql)

a simple REST API with Users & Posts, JWT authentication. Built for backend intern test case at DOT indonesia.

---

## Entities & Relations

**User**

- id: uuid (PK)
- email: string (unique)
- password: string
- createdAt: timestamptz
- updatedAt: timestamptz
- Relation: OneToMany -> Post (author -> posts)

**Post**

- id: uuid (PK)
- title: string
- description: text
- authorId: uuid (FK -> users.id)
- createdAt: timestamptz
- updatedAt: timestamptz

---

## Tech Stack

- **NestJS**
- **TypeORM** with **PostgreSQL**
- **Passport** strategies: Local (login) & JWT (protected routes) // NestJS Recomendation
- **Jest + Supertest** for E2E tests

---

## Getting Started

### 1) Create PostgreSQL databases

```bash
createdb myapp_dev
createdb myapp_test
```

### 2) Environment variables

Clone .env.example into **.env.development.local** or **.env.test.local**

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secret
POSTGRES_DB=myapp_dev

JWT_SECRET=secret@123
JWT_EXPIRES_IN=30d
```

### 3) Install & run

```bash
npm i
npm run start:dev
```

---

## Testing (e2e)

Configured with jest + supertest

```bash
npm run test:e2e
```

---

### Why using this pattern ?

The main reason I use the dependency injection pattern is because it is a built in pattern from the nestjs generator `nest g resource users`, which consists of services, controllers, DTOs, and entities. This is then combined with the ORM from TypeORM, which supports repositories for each entity, resulting in a pattern similar to dependency injection.

Dependency injection, as i understand it, usually consists of three layers:

- Repository Layer: used to connect the entity structure directly to the database
- Service/Use Case Layer: used as a connector between controllers/handlers to perform additional logic before reaching the repository (database)
- Controller/Handler Layer: used as an entry point to receive requests from clients and return responses. This layer is typically used for routing, request validation, authentication & authorization, request parsing, and more.
