import { useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { IconDownload } from '@tabler/icons-react'
import { Button, Input, Modal } from '@shared/ui'
import { Campo } from './Campo'

function FormularioExportar({
  onClose,
  onExportar,
  exportando,
}) {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [formato, setFormato] = useState('excel')

  const rangoInvertido = Boolean(
    fechaInicio && fechaFin && fechaFin < fechaInicio
  )

  const puedeExportar = !rangoInvertido && !exportando

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="overline">
          Rango de fechas
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Campo label="Fecha inicio">
            <Input
              type="date"
              value={fechaInicio}
              disabled={exportando}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Campo>

          <Campo label="Fecha fin">
            <Input
              type="date"
              value={fechaFin}
              disabled={exportando}
              onChange={(e) => setFechaFin(e.target.value)}
            />
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
          <Button
            variant={formato === 'excel' ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            disabled={exportando}
            onClick={() => setFormato('excel')}
          >
            Excel (.xlsx)
          </Button>

          <Button
            variant={formato === 'pdf' ? 'primary' : 'secondary'}
            size="sm"
            fullWidth
            disabled={exportando}
            onClick={() => setFormato('pdf')}
          >
            PDF
          </Button>
        </Stack>
      </Campo>

      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          disabled={exportando}
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button
          size="sm"
          fullWidth
          disabled={!puedeExportar}
          leftIcon={<IconDownload size={14} />}
          onClick={() =>
            onExportar({
              fechaDesde: fechaInicio,
              fechaHasta: fechaFin,
              formato,
            })
          }
        >
          {exportando ? 'Exportando...' : 'Exportar'}
        </Button>
      </Stack>
    </Box>
  )
}

export function ExportarComprasModal({ open, onClose, onExportar }) {
  const [exportando, setExportando] = useState(false)
  const bloqueo = useRef(false)

  const handleClose = () => {
    if (!bloqueo.current) onClose()
  }

  const handleExportar = async (datos) => {
    if (bloqueo.current) return

    bloqueo.current = true
    setExportando(true)

    try {
      await onExportar(datos)
    } finally {
      bloqueo.current = false
      setExportando(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Exportar compras"
      size="sm"
      showDivider
    >
      <FormularioExportar
        onClose={handleClose}
        onExportar={handleExportar}
        exportando={exportando}
      />
    </Modal>
  )
}