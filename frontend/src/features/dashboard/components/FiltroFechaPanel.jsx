import { useState } from 'react'
import { Box, ClickAwayListener, Paper, Popper, Stack, Typography } from '@mui/material'
import { Button, Input } from '@shared/ui'
import { DIAS_RANGO_INICIAL } from '../constants/dashboard.constants'
import { fromInputValue, rangoEsValido, toInputValue } from '../utils/dashboardHelpers'
import { Campo } from './Campo'

// Panel desplegable (anclado al botón de fechas) para elegir el rango del dashboard.
// Se monta cada vez que se abre, así parte siempre del rango actual.
export function FiltroFechaPanel({ anchorEl, onClose, rangoInicial, onAplicar, onRestablecer }) {
  const [desde, setDesde] = useState(toInputValue(rangoInicial.start))
  const [hasta, setHasta] = useState(toInputValue(rangoInicial.end))

  const puedeAplicar = rangoEsValido(desde, hasta)

  const aplicar = () => {
    if (!puedeAplicar) return
    onAplicar({ start: fromInputValue(desde), end: fromInputValue(hasta) })
  }

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 50 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ width: 320, borderRadius: 2, border: '1px solid', borderColor: 'divider', mt: 1 }} elevation={4}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Filtrar por fecha</Typography>
            <Typography variant="caption" component="div" sx={{ mt: 0.25 }}>
              Las gráficas se agrupan automáticamente según el rango
            </Typography>
          </Box>

          <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Campo label="Desde">
                <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
              </Campo>
              <Campo label="Hasta">
                <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
              </Campo>
            </Box>
            {!puedeAplicar && (
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                Selecciona un rango de fechas válido
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 2 }}>
            <Button variant="secondary" size="sm" fullWidth onClick={onRestablecer}>
              Restablecer (últimos {DIAS_RANGO_INICIAL} días)
            </Button>
            <Button size="sm" fullWidth disabled={!puedeAplicar} onClick={aplicar}>
              Aplicar
            </Button>
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  )
}
