import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { IconDownload } from '@tabler/icons-react'
import { Button, Input, Modal } from '@shared/ui'
import { Campo } from './Campo'

function FormularioExportar({ onClose, onExportar }) {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [formato, setFormato] = useState('excel')

  const rangoInvertido = Boolean(fechaInicio && fechaFin && fechaFin < fechaInicio)
  const puedeExportar = !rangoInvertido

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="overline">Rango de fechas</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Campo label="Fecha inicio">
            <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </Campo>
          <Campo label="Fecha fin">
            <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </Campo>
        </Box>
        {rangoInvertido && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            La fecha fin no puede ser anterior a la fecha inicio
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Si no seleccionas fechas, se exportarán todos los registros.
        </Typography>
      </Box>

      <Campo label="Formato">
        <Stack direction="row" spacing={1}>
          <Button variant={formato === 'excel' ? 'primary' : 'secondary'} size="sm" fullWidth onClick={() => setFormato('excel')}>
            Excel (.xlsx)
          </Button>
          <Button variant={formato === 'pdf' ? 'primary' : 'secondary'} size="sm" fullWidth onClick={() => setFormato('pdf')}>
            PDF
          </Button>
        </Stack>
      </Campo>

      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
        <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
          Cancelar
        </Button>
        <Button
          size="sm"
          fullWidth
          disabled={!puedeExportar}
          leftIcon={<IconDownload size={14} />}
          onClick={() => onExportar({ fechaDesde: fechaInicio, fechaHasta: fechaFin, formato })}
        >
          Exportar
        </Button>
      </Stack>
    </Box>
  )
}

export function ExportarComprasModal({ open, onClose, onExportar }) {
  return (
    <Modal open={open} onClose={onClose} title="Exportar compras" size="sm" showDivider>
      <FormularioExportar onClose={onClose} onExportar={onExportar} />
    </Modal>
  )
}
