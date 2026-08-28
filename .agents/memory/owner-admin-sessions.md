---
name: Owner admin sessions
description: Security rules for environment-backed owner authority and database-backed additional admins.
---

Owner authority must be revalidated against the current environment-backed identity and a keyed credential version. Additional database-backed admins must never inherit owner capability. Revoking an additional admin must remove persisted sessions and active checks must still verify that the account remains enabled.

**Why:** Trusting a serialized owner flag allows an old session to survive owner credential rotation, while only disabling an admin row leaves its Passport session authenticated until expiry.

**How to apply:** Any new owner-only API must derive owner status from the current configured credentials. Any admin deactivation flow must invalidate PostgreSQL sessions and retain an active-account check on protected requests.