/**
 * Cache tags for landing revalidation — one per landing-read table.
 *
 * Add a tag here when a table feeds the public landing, then pass it to
 * `revalidateLandingCache([cacheTags.xxx])` from the resource form's onSubmit.
 *
 * Example:
 *   export const cacheTags = {
 *     exampleItems: 'example_items',
 *   } as const
 */
export const cacheTags = {} as const

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags]

export const allLandingTags: CacheTag[] = Object.values(cacheTags)
