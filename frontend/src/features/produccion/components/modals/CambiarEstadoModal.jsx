import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal, Select } from '@shared/ui'
import { estadoOptions } from '@features/produccion/constants/produccion.constants'
import FilterLabel from '@features/produccion/components/common/FilterLabel'

export default function CambiarEstadoModal({ ordenId, value, onChange, onClose, onConfirm }) {
  return (
    <Modal open={!!ordenId} onClose={onClose} title={`Cambiar estado ${ordenId ?? ''}`} size="sm" showDivider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FilterLabel>Estado</FilterLabel>
          <Select options={estadoOptions} value={value} onChange={(e) => onChange(e.target.value)} />
        </Box>
        {value === 'retrasado' && (
          <Typography variant="caption" sx={{ color: 'text.dim' }}>
            Nota: el estado "retrasado" también se aplica automáticamente cuando han pasado 2 días desde la fecha de
            solicitud.
          </Typography>
        )}
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}
