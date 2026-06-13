# 04 — Admin components

Quick reference. Read the source for full props.

## `data-table`
`features/admin/components/data-table/`

Wrapper around `@tanstack/react-table` v8.

| Component | Purpose |
|---|---|
| `DataTable` | Main table. Pass `columns`, `data`, optional `searchKey`, `pagination` (client or server), `meta`. |
| `DataTablePagination` | Pagination footer. |
| `DataTableToolbar` | Search + column-visibility + faceted filters. |
| `DataTableColumnHeader` | Sortable header cell. |
| `DataTableRowActions` | Edit/Delete dropdown in a row. |

Use `meta` on a column to attach `headerClass`, `cellClass`, or `resource` (resolved by `getColumnLabel`).

## `useResourceForm`
`features/admin/hooks/use-resource-form.ts`

```ts
const form = useResourceForm({
  fetchFn,                     // () => Promise<Row | null>
  schema,                      // Zod schema
  mapDataToForm,               // Row → FormValues
  onSubmit,                    // (values) => Promise<void>
  revalidateTags?,             // CacheTag[] passed to revalidateSiteCache
})
```

Handles: fetch + populate, react-hook-form integration, loading skeleton, error toast, success toast, automatic site revalidation after save.

## `ResourceForm` / `ResourceDialog` / `DeleteAlertDialog`
`features/admin/components/shared/`

Generic wrappers used by every CRUD page. Create/Edit dialogs share a form schema; delete is a confirm dialog.

## Layout shells
`features/admin/components/shared/`

| Component | When |
|---|---|
| `PageLayout` | Generic page with title + actions. |
| `FormPageLayout` | Single-form page (Hero, Settings…). |
| `TableListLayout` | List + create button. |
| `CardGridLayout` | Card grid for visual entities (e.g. gallery). |
| `FormSection` | Group related inputs inside a form. |

## Form inputs
`features/admin/components/form/`

- `RichTextEditor` — Tiptap (starter-kit + underline + text-align + placeholder).
- `CloudinaryMediaPicker` — opens the Cloudinary widget; returns a secure URL.
- `MediaUrlInput` — text input + Cloudinary picker beside it.
- `LinkInput` — URL input with a section-anchor dropdown (`SECTION_OPTIONS`).
- `SortableItem` + `getSortableData` — @dnd-kit drag-drop helpers.
- `SelectableBadge` — icon/color picker chip.

## Sidebar
`features/admin/components/sidebar/`

The sidebar is generated from `features/admin/config/routes.ts`. Add a route entry with a `sidebar` block and it appears in the nav. Groups (`layout`, `home`, `library`, `system`) and subgroups (`sections`, `layout`) are typed in `routes.ts`.

## Header
`features/admin/components/header/`

- `Header` — top bar inside `SidebarInset`.
- `CommandMenu` — `⌘K` jump-to-route palette wired to `adminRoutes`.
- `ProfileDropdown` — user menu (logout).
- `Search` — placeholder, hook up to your needs.
