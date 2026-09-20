import { Box, Typography, Stack, IconButton, useTheme } from '@mui/material'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const pageButtonBase = {
  minWidth: 32,
  width: 32,
  height: 32,
  borderRadius: 1.5,
  fontSize: 13,
  fontWeight: 500,
}

export default function PaginacionCategorias({ paginaActual = 1, totalRegistros = 8, porPagina = 8, onPageChange }) {
  const theme = useTheme()

  const from = totalRegistros === 0 ? 0 : (paginaActual - 1) * porPagina + 1
  const to = Math.min(paginaActual * porPagina, totalRegistros)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontFamily: fonts.sans, fontSize: 12, color: theme.palette.text.secondary }}
      >
        Mostrando {from}–{to} de {totalRegistros} registros
      </Typography>

      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton
          size="small"
          disabled={paginaActual === 1}
          onClick={() => onPageChange?.(paginaActual - 1)}
          sx={{
            ...pageButtonBase,
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
            '&.Mui-disabled': { color: theme.palette.text.disabled },
          }}
        >
          <IconChevronLeft size={16} />
        </IconButton>

        <Box
          sx={{
            ...pageButtonBase,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {paginaActual}
        </Box>

        <IconButton
          size="small"
          disabled={paginaActual * porPagina >= totalRegistros}
          onClick={() => onPageChange?.(paginaActual + 1)}
          sx={{
            ...pageButtonBase,
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
            '&.Mui-disabled': { color: theme.palette.text.disabled },
          }}
        >
          <IconChevronRight size={16} />
        </IconButton>
      </Stack>
    </Box>
  )
}