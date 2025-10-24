# Testbed Visualization Backend

Node.js + Express + Prisma backend for Testbed Visualization, incrementally migrated from Java.

## Migration Status

### Completed Modules

**Testbed Module**

- Testbed CRUD operations
- Testbed Settings management
- Item Status management
- RESTful API endpoints
- Prisma database access
- Error handling and logging

**User Module**

- User CRUD operations
- User authentication and authorization
- LDAP group validation
- Admin role management

**Authentication**

- Protected admin endpoints
- Authentication middleware

### TODO: Future Modules

- **Item Management** (hierarchical tree structure, snapshots, comparisons)
- **Auth Integrations** (alternative authentication methods)
- **Image Handling** (binary storage/retrieval)
- **Email Notifications** (MailService)
- **Audit Trail** (history tables for testbed_settings, item_status, etc.)

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── error.js
│   │   ├── testbeds/
│   │   │   ├── itemStatus.model.js
│   │   │   ├── testbed.repository.js
│   │   │   ├── testbed.routes.js
│   │   │   ├── testbed.service.js
│   │   │   └── testbedSettings.model.js
│   │   └── users/
│   │       ├── user.model.js
│   │       ├── user.repository.js
│   │       ├── user.routes.js
│   │       └── user.service.js
│   ├── db/
│   │   └── prisma.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0
- Existing database from Java application (or run `database_setup.sql`)

### Installation

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Configure environment:**

    ```bash
    cp .env.example .env
    # Edit .env with your database credentials
    ```

3. **Generate Prisma client:**

    ```bash
    npm run prisma:generate
    ```

4. **Run migrations (optional - if using fresh database):**
    ```bash
    npm run prisma:migrate
    ```

### Running the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## API Endpoints

### Authentication

- `POST /api/users/login` - User login (returns JWT token)
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user info (requires authentication)

### Public Endpoints

#### Testbeds

- `GET /api/testbeds` - List all enabled testbeds with statuses
- `GET /api/testbeds/:testbedId` - Get testbed by ID with items and statuses
- `PATCH /api/testbeds/:testbedId` - Update testbed description

#### Settings

- `GET /api/testbeds/:testbedId/settings` - Get testbed settings
- `GET /api/settings` - Get all testbed settings

### Admin Endpoints (require authentication + admin role)

#### Testbeds

- `POST /api/testbeds` - Create new testbed
- `PUT /api/testbeds/:testbedId/settings` - Update testbed settings
- `POST /api/testbeds/:testbedId/statuses` - Create item status
- `PUT /api/testbeds/:testbedId/statuses/:statusId` - Update item status

#### Users

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

## Migration Notes

### Java to Node.js Mappings

| Java Component             | Node.js Equivalent      |
| -------------------------- | ----------------------- |
| `TestbedDaoImpl.java`      | `testbed.repository.js` |
| `TestbedServiceImpl.java`  | `testbed.service.js`    |
| `TestbedVizResource.java`  | `testbed.routes.js`     |
| `UserDaoImpl.java`         | `user.repository.js`    |
| `UserServiceImpl.java`     | `user.service.js`       |
| `AuthService.java`         | `auth.js` middleware    |
| `DatabaseUtil.java`        | `database.js` (Prisma)  |
| `e.printStackTrace()`      | `logger.error()`        |
| JDBC PreparedStatements    | Prisma queries          |
| JAX-RS `@Path` annotations | Express routes          |
| Jersey Response            | Express `res.json()`    |

### Key Improvements Over Java

1. **No manual SQL** - Prisma handles queries with type safety
2. **Auto connection pooling** - Built into Prisma
3. **Cleaner error handling** - Centralized error middleware
4. **RESTful routes** - Removed `/v1`, consistent plural resource names
5. **Environment config** - Centralized in `.env`
6. **Async/await** - Modern async patterns (vs Java try-catch blocks)
7. **JWT authentication** - Stateless token-based auth (TODO)

### Authentication Implementation

**TODO implementation:**

- JWT-based authentication with configurable expiration
- Role-based access control (admin/user roles)
- LDAP group validation support
- Password hashing with bcrypt

**Java supported:**

- CAM (Central Authentication Management)
- CSSO_PROXY

## Database Schema

Prisma schema includes:

### Current (Migrated)

- `testbeds` - Testbed definitions
- `testbed_settings` - Configuration per testbed
- `item_status` - Status definitions per testbed

### Defined (Ready for Migration)

- `item_metadata` - Item tree structure
- `item_changes` - Change history
- `images` - Binary image storage

### Future (TODO)

- History/audit tables for tracking changes

## Development

### Database Tools

**Prisma Studio (GUI):**

```bash
npm run prisma:studio
```

**Generate Prisma Client (after schema changes):**

```bash
npm run prisma:generate
```

### Code Style

- ES6 modules (`import`/`export`)
- Async/await for all async operations
- Prettier for consistent formatting
- Consistent error handling with try-catch + logger
- Resource based folder structure
- Functional JavaScript over Classes
