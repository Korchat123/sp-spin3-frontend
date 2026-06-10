export function exportToCSV(filename, headers, rows) {
  const headerRow = headers.join(',')
  const dataRows = rows.map(row =>
    row.map(cell => {
      const value = cell === null || cell === undefined ? '' : String(cell)
      return value.includes(',') || value.includes('"') || value.includes('\n')
        ? '"' + value.replace(/"/g, '""') + '"'
        : value
    }).join(',')
  )
  const csv = [headerRow, ...dataRows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
