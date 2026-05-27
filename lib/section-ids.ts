/**
 * Anchor ids for landing sections, per language.
 *
 * Used for in-page navigation (e.g. <a href={`#${sectionIds[lang].services}`}>).
 * Fill in your own sections once you build the landing.
 *
 * Example:
 *   export const sectionIds = {
 *     es: { home: 'inicio', services: 'servicios', contact: 'contactanos' },
 *     en: { home: 'home', services: 'services', contact: 'contact' },
 *   } as const
 */
export const sectionIds = {
  es: {},
  en: {},
} as const

export type Lang = keyof typeof sectionIds
