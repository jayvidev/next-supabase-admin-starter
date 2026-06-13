/**
 * Cache tags for site revalidation — one per site-read table.
 *
 * Add a tag here when a table feeds the public site, then pass it to
 * `revalidateSiteCache([cacheTags.xxx])` from the resource form's onSubmit.
 *
 * Example:
 *   export const cacheTags = {
 *     exampleItems: 'example_items',
 *   } as const
 */
export const cacheTags = {} as const

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags]

export const allSiteTags: CacheTag[] = Object.values(cacheTags)
