export const SECTION_OPTIONS = [{ label: 'Hero', value: '#hero' }] as const

export type SectionValue = (typeof SECTION_OPTIONS)[number]['value']
