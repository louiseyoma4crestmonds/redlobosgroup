---
name: Automatic database migrations
description: Durable rules for keeping fresh and established PostgreSQL databases compatible with the application.
---

Database migrations must be immutable after application, serialized across concurrent starts, and completed successfully before the HTTP server listens. Every table, index, foreign key, and conflict target assumed by application SQL must be represented by a versioned migration.

**Why:** An established development database can hide missing baseline objects. That allowed fresh databases to appear initialized while property, add-on, and Stripe booking operations still failed at runtime.

**How to apply:** Whenever a route adds or changes SQL, add a new migration rather than editing an applied one. Validate migrations against an empty schema, an existing schema, concurrent runners, and the exact inserts/upserts used by the affected routes.