# 08 — i18n (optional)

The starter's `main` branch is **mono-lingual**. If you need a bilingual site, base it on the `i18n` branch (planned).

## What `i18n` adds

| Change | Detail |
|---|---|
| Dep | `next-intl` |
| Config | `i18n/routing.ts` (`defineRouting`) + `i18n/request.ts` (`getRequestConfig`) |
| Next plugin | `createNextIntlPlugin()` wraps `next.config.ts` |
| Routes | `app/(site)/` becomes `app/(site)/[lang]/` |
| DB | Columns become `<field>_es` / `<field>_en` (one migration per resource) |
| Admin | `TranslatableField` + `LanguageTabs` show both languages side-by-side |
| Cache | `revalidatePath('/[lang]/...')` paths added in `actions/revalidate.ts` |

Translations are **database-driven**, not message-file-based — every CMS row carries every locale.

## Migrating an existing mono-lang project to i18n

1. Install: `pnpm add next-intl`.
2. Copy `i18n/{routing,request}.ts` from the reference.
3. Wrap `next.config.ts` with `createNextIntlPlugin('./i18n/request.ts')(nextConfig)`.
4. For each translatable column add a migration: `alter table foo rename column title to title_es; alter table foo add column title_en text;`.
5. Update `server-queries.ts` selects + the Zod schemas + the form fields (use `TranslatableField`).
6. Move site routes under `[lang]` and read the param in pages.
7. Update `actions/revalidate.ts` paths.

## When NOT to add i18n

If a project is genuinely single-language. The duplicated columns and the routing overhead hurt DX with no upside.
