import { useState } from 'react'
import { Box, Card, CardContent, Collapse, Typography, useTheme } from '@mui/material'
import { IconChevronDown } from '@tabler/icons-react'
import RecetaTabla from '../RecetaTabla'
import { tarjetaSx } from './estilos'

// Tarjeta plegable con la tabla de insumos de la receta (solo lectura)
export default function RecetaColapsable({ insumos }) {
  const theme = useTheme()
  const [abierta, setAbierta] = useState(false)

  return (
    <Card variant="outlined" sx={tarjetaSx(theme)}>
      <Box
        component="button"
        type="button"
        aria-expanded={abierta}
        aria-controls="detalle-producto-receta"
        onClick={() => setAbierta((valor) => !valor)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: 0,
          backgroundColor: 'transparent',
          px: 3,
          py: 2.5,
          cursor: 'pointer',
          textAlign: 'left',
          color: theme.palette.text.primary,
          '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 },
        }}
      >
        <Typography variant="h6" component="span">
          Listar insumos receta
        </Typography>
        <Box
          sx={{
            display: 'flex',
            color: theme.palette.primary.main,
            transform: abierta ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <IconChevronDown size={18} />
        </Box>
      </Box>

      <Collapse in={abierta} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
          <RecetaTabla insumos={insumos} mostrarEncabezado={false} showActions={false} />
        </CardContent>
      </Collapse>
    </Card>
  )
}