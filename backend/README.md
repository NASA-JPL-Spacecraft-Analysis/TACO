# Testbed Visualization Backend

Node.js + Express + MySQl with Prisma

## Quick Start

### 1. Install MySQL

```bash
brew install mysql
brew services start mysql
mysql_secure_installation  # Optional but recommended
```

Create the database:

```bash
mysql -u root -p
CREATE DATABASE taco_db;
exit;
```

### 2. Setup Backend

Install dependencies:

```bash
npm install
```

Configure environment:

```bash
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL="mysql://root:password@localhost:3306/taco_db?authPlugin=caching_sha2_password""
```

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Run the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs on `http://localhost:3000`
Health check: `http://localhost:3000/health`

## Architecture

### Design Pattern

**Repository Pattern** - Three-layer architecture:

- **Routes** (`*.routes.js`) - HTTP endpoints, request/response handling
- **Service** (`*.service.js`) - Application logic
- **Repository** (`*.repository.js`) - Database access via Prisma

```
Request → Routes → Service → Repository → Prisma → Database
```

### Database Access

**Prisma Client** - Singleton pattern in `src/db/prisma.js`:

```javascript
import { client } from '../../db/prisma.js';

const getTestbeds = async () => {
    const prisma = client();
    return await prisma.testbed.findMany({...});
};
```

Prisma auto-connects on first query. No manual connection management needed.

### URL Structure

All API routes prefixed with `/api`:

```
/api/testbeds              # Public endpoints
/api/testbeds/:id/settings # Public endpoints
/api/users                 # Admin endpoints
...etc
```

**RESTful conventions:**

- Plural resource names (`/testbeds` not `/testbed`)
- HTTP verbs for operations (GET, POST, PUT, PATCH, DELETE)
- Nested resources for relationships (`/testbeds/:id/settings`)

### Error Handling

**asyncHandler Pattern** - Wraps async route handlers to catch errors:

```javascript
router.get(
    '/testbeds',
    asyncHandler(async (req, res) => {
        const testbeds = await service.getTestbeds();
        res.json(testbeds);
    })
);
```

Without `asyncHandler`, unhandled promise rejections crash the server. The wrapper catches errors and forwards them to the error middleware.

### Authentication

Currently uses `NO_AUTH` mode (mock user). Admin endpoints protected by `authenticate` middleware.

Future: JWT-based auth with role-based access control.

## Frontend Integration

**Important:** Frontend must be updated to use `/api` prefix for all backend calls.

Example:

```typescript
// Old
this.http.get(baseUrl + '/testbeds');

// New
this.http.get(baseUrl + '/api/testbeds');
```

TODO: Update all frontend calls to use RESTful endpoints with `/api` prefix.

## Database Schema

### Tables (via Prisma)

- `testbeds` - Testbed definitions
- `testbed_settings` - Configuration per testbed
- `item_status` - Status definitions per testbed
- `item_metadata` - Item tree structure
- `item_changes` - Change history
- `images` - Binary image storage

### Useful Commands

View database in GUI:

```bash
npm run prisma:studio
```

After schema changes:

```bash
npm run prisma:generate
```

Create migration:

```bash
npx prisma migrate dev --name description_of_change
```

## API Endpoints

### Public

- `GET /api/testbeds` - List all testbeds
- `GET /api/testbeds/:id` - Get testbed by ID
- `GET /api/testbeds/:id/settings` - Get testbed settings
- `PATCH /api/testbeds/:id` - Update testbed description

### Admin (require auth)

- `POST /api/testbeds` - Create testbed
- `PUT /api/testbeds/:id/settings` - Update settings
- `POST /api/testbeds/:id/statuses` - Create status
- `PUT /api/testbeds/:id/statuses/:statusId` - Update status

## Development

### Code Style

- ES6 modules (`import`/`export`)
- Async/await for all async operations
- Repository pattern for data access
- Functional JavaScript over classes
- Consistent error handling with try-catch + logger

### Project Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── middleware/      # Auth, error handling
│   │   ├── testbeds/        # Testbed module
│   │   └── users/           # User module
│   ├── db/
│   │   └── prisma.js        # Prisma singleton
│   ├── utils/
│   │   └── logger.js        # Winston logger
│   ├── app.js               # Express app setup
│   └── server.js            # Server startup
├── prisma/
│   └── schema.prisma        # Database schema
└── .env                     # Environment config
```

---

## Migration Notes

### Status: Java → Node.js

**Completed:**

- Testbed CRUD operations
- Testbed Settings management
- Item Status management
- Prisma database access
- Error handling and logging
- RESTful API endpoints

**TODO:**

- Item management (hierarchical tree, snapshots)
- Image handling (binary storage)
- Email notifications
- Full authentication (JWT, LDAP)
- Audit trail/history tables

### Java to Node.js Mappings

| Java Component             | Node.js Equivalent      |
| -------------------------- | ----------------------- |
| `TestbedDaoImpl.java`      | `testbed.repository.js` |
| `TestbedServiceImpl.java`  | `testbed.service.js`    |
| `TestbedVizResource.java`  | `testbed.routes.js`     |
| `DatabaseUtil.java`        | `prisma.js`             |
| JDBC PreparedStatements    | Prisma queries          |
| JAX-RS `@Path` annotations | Express routes          |
| `e.printStackTrace()`      | `logger.error()`        |

### Key Improvements

- Type-safe database queries via Prisma
- Auto connection pooling
- Centralized error handling
- Modern async/await patterns
- RESTful API design
- Environment-based configuration
