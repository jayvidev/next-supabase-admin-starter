import { unstable_cache } from 'next/cache'

import { publicClient } from './public-client'

const ONE_HOUR = 60 * 60

/**
 * Example query — replace with your own tables after running `pnpm db:types`.
 *
 * export const getMyTable = unstable_cache(
 *   async () => {
 *     const { data, error } = await publicClient.from('my_table').select('*').single()
 *     if (error) return null
 *     return data
 *   },
 *   ['my_table'],
 *   { revalidate: ONE_HOUR }
 * )
 */

// Prevent "unused import" errors until you add your own queries.
void unstable_cache
void publicClient
void ONE_HOUR
