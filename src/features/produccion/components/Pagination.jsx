import { Box, Typography, IconButton, Button } from '@mui/material'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

/**
 * Paginación del panel administrativo.
 * page: página actual (1-indexed) | total: total de registros | pageSize: registros por página
 */
export function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, flexWrap: 'wrap', gap: 1.5 }}>
      <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
        Mostrando {from}–{to} de {total} registros
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          sx={{ color: 'text.secondary' }}
        >
          <IconChevronLeft size={16} />
        </IconButton>

        {pages.map((p) => (
          <Button
            key={p}
            onClick={() => onPageChange(p)}
            sx={{
              minWidth: 32,
              width: 32,
              height: 32,
              borderRadius: 1.5,
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: p === page ? 'primary.main' : 'transparent',
              color: p === page ? 'primary.contrastText' : 'text.secondary',
              '&:hover': { bgcolor: p === page ? 'primary.dark' : 'action.hover' },
            }}
          >
            {p}
          </Button>
        ))}

        <IconButton
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          sx={{ color: 'text.secondary' }}
        >
          <IconChevronRight size={16} />
        </IconButton>
      </Box>
    </Box>
  )
}