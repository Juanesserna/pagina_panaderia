import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { BRAND } from '@shared/utils/colors'

export default function TablePaginationFooter({ page, pageCount, totalItems, pageSize, onPageChange }) {
  if (totalItems === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        px: 2.5,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        Mostrando {from}-{to} de {totalItems} registros
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            minWidth: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            bgcolor: BRAND.orange,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {page}
        </Box>

        <IconButton size="small" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}