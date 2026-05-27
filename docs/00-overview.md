# 00 — Overview

## What this starter is

A reusable base for projects that need:

- a **marketing landing** rendered statically (with ISR);
- an **admin CMS** that edits the landing's content live;
- **Supabase** as the database / auth provider (**optional** — the app runs without it; see `10-supabase-optional.md`);
- **Cloudinary** for media.

Extracted from production use. Business-specific sections were removed; only the architectural pieces and the patterns to extend them are kept.

## Mental model

```
┌──────────────────────────────────────────────────────────┐
│  app/(landing)        →  force-static, reads via         │
│                          lib/supabase/server-queries.ts  │
│                          (unstable_cache + tags)          │
│                                                          │
│  app/admin/(panel)    →  force-dynamic, mutates via      │
│                          features/admin/api/<resource>.ts│
│                          → revalidateTag → landing       │
│                          regenerates next request        │
└──────────────────────────────────────────────────────────┘
                              ↑
                              │ Supabase RLS:
                              │ public_read + auth_all
                              ▼
                       supabase/migrations/*.sql
```

Two render modes, one DB. The admin writes, tags get invalidated, the landing rebuilds the affected page on the next visit.

## Layers

| Layer | Where | Purpose |
|---|---|---|
| Routes | `app/` | App Router pages, route groups for landing vs admin |
| Features | `features/{admin,landing,auth}/` | All business UI lives here, grouped by domain |
| Shared UI | `components/ui/` | shadcn primitives, used by both halves |
| Data | `lib/supabase/` | Server/browser/public clients + cached queries |
| Config | `config/`, `features/admin/config/` | Env, routes, sidebar |
| DB | `supabase/migrations/` | Versioned SQL, single source of truth |
| Docs | `docs/` | This guide |

## Next reads

- `01-setup.md` — boot the project end-to-end.
- `03-add-resource.md` — the most common task: adding a new editable section.
