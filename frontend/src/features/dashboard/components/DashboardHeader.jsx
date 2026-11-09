import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { IconCalendar, IconChevronDown, IconDownload } from '@tabler/icons-react'
import { Button } from '@shared/ui'
import { FiltroFechaPanel } from './FiltroFechaPanel'

// Barra superior: título a la izquierda; a la derecha el selector de fechas y el botón de exportar.
export function DashboardHeader({ rango, etiquetaRango, onAplicarRango, onRestablecerRango, onExportar }) {
  // Elemento al que se ancla el panel de fechas (null = cerrado)
  const [anchor, setAnchor] = useState(null)

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        <Typography variant="h6">Panel general</Typography>
        <Typography variant="body2" sx={{ mt: 0.25 }}>
          Resumen de operaciones
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', ml: 'auto' }}>
        <Button
          variant={anchor ? 'primary' : 'secondary'}
          size="sm"
          leftIcon={<IconCalendar size={14} />}
          onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
        >
          {etiquetaRango}
          <IconChevronDown size={13} style={{ marginLeft: 4 }} />
        </Button>

        {anchor && (
          <FiltroFechaPanel
            anchorEl={anchor}
            onClose={() => setAnchor(null)}
            rangoInicial={rango}
            onAplicar={(nuevo) => {
              onAplicarRango(nuevo)
              setAnchor(null)
            }}
            onRestablecer={() => {
              onRestablecerRango()
              setAnchor(null)
            }}
          />
        )}

        <Button variant="secondary" size="sm" leftIcon={<IconDownload size={14} />} onClick={onExportar}>
          Exportar
          <IconChevronDown size={13} style={{ marginLeft: 4 }} />
        </Button>
      </Stack>
    </Stack>
  )
}
