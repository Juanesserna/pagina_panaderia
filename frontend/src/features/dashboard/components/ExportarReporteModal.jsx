import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { IconCheck, IconDownload } from '@tabler/icons-react'
import { Button, Input, Modal } from '@shared/ui'
import { FORMATOS_EXPORTACION, MODULOS_EXPORTABLES } from '../constants/dashboard.constants'
import { useExportarReporteForm } from '../hooks/useExportarReporteForm'
import { Campo } from './Campo'

// El formulario se monta cada vez que el modal abre, así siempre arranca limpio.
function ExportarReporteForm({ onClose, onExportar }) {
  const f = useExportarReporteForm()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="overline">Rango de fechas</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Campo label="Fecha inicio">
            <Input type="date" value={f.fechaInicio} onChange={(e) => f.setFechaInicio(e.target.value)} />
          </Campo>
          <Campo label="Fecha fin">
            <Input type="date" value={f.fechaFin} onChange={(e) => f.setFechaFin(e.target.value)} />
          </Campo>
        </Box>
        {f.rangoInvertido && (
          <Typography variant="caption" sx={{ color: 'error.main' }}>
            La fecha fin no puede ser anterior a la fecha inicio
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="overline">Módulos</Typography>
          <Button variant="ghost" size="sm" onClick={f.alternarTodos}>
            {f.todosSeleccionados ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </Button>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {MODULOS_EXPORTABLES.map((m) => {
            const activo = f.modulos.includes(m.id)
            return (
              <FormControlLabel
                key={m.id}
                label={m.label}
                control={
                  <Checkbox
                    size="small"
                    checked={activo}
                    onChange={() => f.alternarModulo(m.id)}
                    checkedIcon={<IconCheck size={14} />}
                    sx={{ p: 0, mr: 1 }}
                  />
                }
                sx={{
                  m: 0,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: activo ? 'primary.main' : 'divider',
                  bgcolor: activo ? 'action.selected' : 'background.paper',
                  color: activo ? 'primary.main' : 'text.secondary',
                }}
              />
            )
          })}
        </Box>
      </Box>

      <Campo label="Formato">
        <Stack direction="row" spacing={1}>
          {FORMATOS_EXPORTACION.map((fmt) => (
            <Button
              key={fmt.value}
              variant={f.formato === fmt.value ? 'primary' : 'secondary'}
              size="sm"
              fullWidth
              onClick={() => f.setFormato(fmt.value)}
            >
              {fmt.label}
            </Button>
          ))}
        </Stack>
      </Campo>

      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
        <Button variant="secondary" size="sm" fullWidth onClick={onClose}>
          Cancelar
        </Button>
        <Button size="sm" fullWidth disabled={!f.puedeExportar} leftIcon={<IconDownload size={14} />} onClick={() => onExportar(f.datos)}>
          Exportar
        </Button>
      </Stack>
    </Box>
  )
}

export function ExportarReporteModal({ open, onClose, onExportar }) {
  return (
    <Modal open={open} onClose={onClose} title="Exportar reporte" size="sm" showDivider>
      <ExportarReporteForm onClose={onClose} onExportar={onExportar} />
    </Modal>
  )
}
