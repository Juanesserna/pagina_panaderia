import { Box, Typography, Stack, IconButton, useTheme } from '@mui/material'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

const pageButtonBase = {
  minWidth: 32,
  width: 32,
  height: 32,
  borderRadius: 1.5,
  typography: 'subtitle1',
}

export default function PaginacionProductos({ paginaActual = 1, totalRegistros = 0, porPagina = 10, totalPaginas = 1, onCambiarPagina }) {
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
        px: 3,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        Mostrando {from}–{to} de {totalRegistros} registros
      </Typography>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ alignItems: 'center' }}
      >
        <IconButton
          size="small"
          disabled={paginaActual <= 1}
          onClick={() => onCambiarPagina?.(paginaActual - 1)}
          aria-label="Página anterior"
          sx={{
            ...pageButtonBase,
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
            '&.Mui-disabled': { opacity: 0.4 },
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
            typography: 'subtitle1',
          }}
        >
          {paginaActual}
        </Box>

        <IconButton
          size="small"
          disabled={paginaActual >= totalPaginas}
          onClick={() => onCambiarPagina?.(paginaActual + 1)}
          aria-label="Página siguiente"
          sx={{
            ...pageButtonBase,
            color: theme.palette.text.secondary,
            '&:hover': { bgcolor: theme.palette.action.hover },
            '&.Mui-disabled': { opacity: 0.4 },
          }}
        >
          <IconChevronRight size={16} />
        </IconButton>
      </Stack>
    </Box>
  )
}
