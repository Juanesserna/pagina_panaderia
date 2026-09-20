import { Box } from '@mui/material'
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react'

// Encabezado de columna ordenable para DataTable (que por sí solo no ordena).
export function SortHeader({ label, colKey, sortKey, sortDir, onSort }) {
  const activo = sortKey === colKey
  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSort(colKey)}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        background: 'none',
        border: 'none',
        p: 0,
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': { opacity: 0.8 },
      }}
    >
      {label}
      {activo ? (
        sortDir === 'asc' ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />
      ) : (
        <IconSelector size={12} style={{ opacity: 0.4 }} />
      )}
    </Box>
  )
}
