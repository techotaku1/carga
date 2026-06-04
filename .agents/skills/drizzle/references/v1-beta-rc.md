# Drizzle v1 beta/RC Notes

Use this reference when a project uses `drizzle-orm` or `drizzle-kit` `1.0.0-beta.*` or `1.0.0-rc.*`, when upgrading from `0.44.x`/`0.31.x`, or when migration folders/query relations behave differently than older examples.

## Release Risk

Drizzle's v1 beta/RC line includes breaking changes. Before changing an existing app:

1. Inspect installed versions with `npm ls drizzle-orm drizzle-kit`.
2. Read local `drizzle.config.ts`, schema files, and current migration folder layout.
3. Run type checks and migration checks after changes.
4. Keep rollback simple when moving from stable to beta/RC.

## Drizzle Kit v1 Changes

### Folders v3 Migrations

v1 Kit changes the migrations folder format:

- Removes the shared `meta/_journal.json`.
- Groups each migration SQL file and snapshot into its own folder.
- Removes the old `drizzle-kit drop` command.

Upgrade old migration metadata before generating new migrations:

```bash
npx drizzle-kit up
```

Expected shape:

```text
migrations/
└── 20250212120000_init/
    ├── migration.sql
    └── snapshot.json
```

Validation workflow:

```bash
npx drizzle-kit up
npx drizzle-kit generate
npx drizzle-kit check
npx drizzle-kit migrate
```

### Full Kit Rewrite

The v1 Kit rewrite moved from database snapshots to database DDL snapshots and changed how diffs are detected and applied. Expect different generated metadata even when SQL is equivalent.

Practical guidance:

- Review generated SQL, not only snapshot diffs.
- Treat snapshot-only migration layout changes as normal after `drizzle-kit up`.
- Prefer `drizzle-kit check` before committing migrations in a team branch.

### `pull --init`

Use `pull --init` for an existing database where Drizzle should create the migration table and mark the first pulled migration as applied:

```bash
npx drizzle-kit pull --init
```

This is useful when adopting Drizzle on a database that already exists.

### `schemaFilter` Behavior

v1 Kit starts managing all schemas defined in code. Use `schemaFilter` to restrict management, including glob patterns.

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/models/Schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
```

## Drizzle ORM v1 Changes

### RQBv2 Relations

RQBv2 uses `defineRelations` and can split relation config into parts.

```typescript
import { defineRelations, defineRelationsPart } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({
      from: r.users.invitedBy,
      to: r.users.id,
    }),
    posts: r.many.posts(),
  },
}));

export const relationPart = defineRelationsPart(schema, (r) => ({
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  },
}));

export const db = drizzle(process.env.DB_URL, {
  relations: { ...relations, ...relationPart },
});
```

Do not use `db.query.table.findMany(...)` unless `relations` is configured. For normal queries, prefer SQL-style selects and joins:

```typescript
const rows = await db
  .select({
    userId: users.id,
    postId: posts.id,
  })
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id));
```

### Connection Patterns

For `node-postgres` in v1 beta/RC, prefer one of these shapes:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle({ client: pool });
```

```typescript
export const db = drizzle(process.env.DATABASE_URL);
```

```typescript
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});
```

Older `drizzle(pool, { schema })` examples may fail type checks on v1 beta/RC unless the selected driver still supports that overload.

### RLS Syntax

Do not use the old PostgreSQL table RLS syntax:

```typescript
pgTable('users', {}).enableRLS();
```

Use the new table factory syntax:

```typescript
pgTable.withRLS('users', {});
```

### Column Aliases

Columns can be aliased directly:

```typescript
const rows = await db
  .select({
    age: users.age.as('ageOfUser'),
    id: users.id.as('userId'),
  })
  .from(users)
  .orderBy(asc(users.id.as('userId')));
```

### New Dialects

v1 beta/RC adds or expands dialect support in ORM, Kit, and Seed:

- MSSQL via `drizzle-orm/node-mssql`.
- CockroachDB via `drizzle-orm/cockroach`.

RQBv2 may not be supported by every new dialect. Check current docs before using relation queries on MSSQL or CockroachDB.

## Deprecated Dependency Cleanup

Stable `drizzle-kit@0.31.x` may still depend on deprecated `@esbuild-kit/esm-loader` and `@esbuild-kit/core-utils`. The v1 beta/RC line replaces that loader stack with newer dependencies such as `jiti`.

Do not upgrade to beta/RC only to remove a deprecation warning unless the project can absorb breaking migration/API changes.

## Sources

- Drizzle v1.0.0-beta.2 release notes: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v1beta2
- RQBv1 to RQBv2 guide: https://orm.drizzle.team/docs/relations-v1-v2
- RQBv2 schema docs: https://orm.drizzle.team/docs/relations-v2
- RQBv2 query docs: https://orm.drizzle.team/docs/rqb-v2
