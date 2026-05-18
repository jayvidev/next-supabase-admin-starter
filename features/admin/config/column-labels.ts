const columnLabelsByResource: Record<string, Record<string, string>> = {
  media: {
    display_name: 'Name',
    format: 'Format',
    bytes: 'Size',
    created_at: 'Date',
  },
}

export function getColumnLabel(resource: string | undefined, columnId: string): string {
  if (!resource) return columnId
  return columnLabelsByResource[resource]?.[columnId] ?? columnId
}
