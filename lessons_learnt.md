# Lessons Learnt — Vercel Deployment Debugging

Deploying a Replit-origin Express + Vite app to Vercel required fixing 4 distinct root causes, each surfacing only after the previous one was resolved. Documented here for future reference.

---

## 1. Vercel does not bundle relative imports outside `/api`

**Error:** `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/server/routes'`

**Why it happened:** Vercel's `@vercel/node` TypeScript compiler resolves and compiles `api/index.ts` but does **not** bundle relative imports that traverse outside the `/api` directory (e.g. `../server/routes`). At runtime, `/var/task/server/routes` simply doesn't exist.

**Fix:** Pre-bundle the API entry point using esbuild in the build step:
```ts
// script/build.ts
await esbuild({
  entryPoints: ["api/_server.ts"],
  platform: "node",
  bundle: true,       // inlines all relative imports
  format: "esm",
  outfile: "api/index.js",
  packages: "external", // keeps node_modules as runtime imports
});
```
All source files (`server/`, `shared/`) are inlined into `api/index.js`. Only npm packages remain as external imports resolved from Vercel's installed `node_modules`.

---

## 2. Vercel ignores underscore-prefixed files as API handlers

**Error:** No lambda registered — the function slot was missing entirely.

**Why it happened:** Renaming the source to `api/_server.ts` (to avoid it being auto-compiled by Vercel) meant Vercel's router never registered a handler for `/api/index`. Underscore-prefixed files in `/api` are treated as internal utilities, not routes.

**Fix:** Commit the pre-built `api/index.js` to git. Vercel registers JavaScript files in `/api` as handlers directly, without TypeScript compilation. The committed file acts as the handler; the build step regenerates it fresh on each deploy.

---

## 3. Having both `api/index.ts` and `api/index.js` causes a Vercel builder conflict

**Error:** Deployment status `● Error` with 3-second build time and no lambda registered.

**Why it happened:** When both `api/index.ts` (TypeScript source) and `api/index.js` (pre-built bundle) exist simultaneously, Vercel's builder detects a conflict and errors out during the function registration phase.

**Fix:** Keep the source as `api/_server.ts` (underscore = ignored by Vercel routing) and only commit `api/index.js` (the bundle). This gives Vercel exactly one unambiguous handler file, with the source staying available for the build step.

```
api/
  _server.ts   ← source (esbuild entry point, ignored by Vercel router)
  index.js     ← committed bundle (Vercel handler, regenerated on each build)
```

---

## 4. `DATABASE_URL` set but schema never migrated

**Error:** `DrizzleQueryError: relation "employees" does not exist`

**Why it happened:** The Vercel project had a `DATABASE_URL` environment variable set (from the initial deployment setup), so `DatabaseStorage` was selected over `MemStorage`. However, the database schema (`npm run db:push`) had never been applied to that database, so all queries against the `employees` table failed.

**Fix:** Added a `StorageWithFallback` wrapper that tries `DatabaseStorage` first, and automatically switches to pre-seeded `MemStorage` if `seedEmployees()` throws:

```ts
class StorageWithFallback implements IStorage {
  private inner: IStorage;

  constructor() {
    this.inner = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
  }

  async seedEmployees(): Promise<void> {
    try {
      await this.inner.seedEmployees();
    } catch (err) {
      console.warn("Primary storage unavailable, switching to in-memory:", err.message);
      this.inner = new MemStorage();
      await this.inner.seedEmployees();
    }
  }

  // All other methods delegate to this.inner
}
```

This makes the app resilient to both missing `DATABASE_URL` and unmigrated databases, without requiring manual intervention.

---

## Summary

| # | Root Cause | Symptom | Fix |
|---|-----------|---------|-----|
| 1 | Vercel doesn't bundle cross-directory relative imports | `ERR_MODULE_NOT_FOUND` at runtime | Pre-bundle with esbuild (`packages: "external"`) |
| 2 | Underscore-prefixed files are not Vercel API routes | No lambda registered, 404 on all `/api` calls | Commit `api/index.js` (the bundle) directly |
| 3 | Both `.ts` and `.js` for the same route cause a conflict | Build errors with 3s failure, no lambda | Keep only `api/index.js`; source lives as `api/_server.ts` |
| 4 | `DATABASE_URL` set but schema not migrated | `relation "employees" does not exist` | `StorageWithFallback`: auto-fallback to `MemStorage` on DB errors |

**Key takeaway:** When moving an Express app from Replit (or any always-on server) to Vercel serverless functions, the API entry point must be a self-contained bundle. Vercel's TypeScript compilation is not equivalent to bundling — it resolves types but does not inline cross-directory source files.
