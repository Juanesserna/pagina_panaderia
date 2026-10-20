import { Box, IconButton, Typography } from '@mui/material'
import { IconCalendar, IconChevronDown, IconChevronUp, IconHash, IconX } from '@tabler/icons-react'
import { Input, Select } from '@shared/ui'
import { opcionesInsumo } from '../utils/comprasHelpers'
import { Campo } from './Campo'

// Una línea de "Productos solicitados": insumo, cantidad, unidad (heredada), valor
// y, plegable, la trazabilidad del lote (n.º de lote, vencimiento, cantidad disponible).
export function ItemCompraForm({ item, insumos, lotesAbierto, puedeQuitar, onChange, onQuitar, onAlternarLote }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, borderRadius: 2, bgcolor: 'background.alt', position: 'relative' }}>
      {puedeQuitar && (
        <IconButton
          size="small"
          onClick={onQuitar}
          aria-label="Eliminar insumo"
          sx={{ position: 'absolute', top: 6, right: 6, color: 'text.dim', '&:hover': { color: 'error.main' } }}
        >
          <IconX size={14} />
        </IconButton>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.6fr 0.8fr 0.8fr 1fr', gap: 1.5 }}>
        <Campo label="Insumo">
          <Select options={opcionesInsumo(insumos)} value={item.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
        </Campo>
        <Campo label="Cantidad">
          <Input
            type="number"
            min={1}
            value={item.cantidad}
            onChange={(e) => onChange('cantidad', Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </Campo>
        <Campo label="Unidad">
          {/* No es texto libre: se hereda del insumo elegido */}
          <Input value={item.unidad} disabled />
        </Campo>
        <Campo label="Valor unitario ($)">
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={item.precioUnitario || ''}
            onChange={(e) => onChange('precioUnitario', Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </Campo>
      </Box>

      {/* Trazabilidad del lote: subgrupo plegable */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
        <Box
          component="button"
          type="button"
          onClick={onAlternarLote}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            textAlign: 'left',
            color: 'text.secondary',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <IconHash size={12} style={{ opacity: 0.5 }} />
            <Typography variant="overline">Trazabilidad del lote</Typography>
            <Typography variant="mono" sx={{ color: 'text.dim' }}>
              · {item.lote}
            </Typography>
          </Box>
          {lotesAbierto ? <IconChevronUp size={14} style={{ opacity: 0.6 }} /> : <IconChevronDown size={14} style={{ opacity: 0.6 }} />}
        </Box>

        {lotesAbierto && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2.5 }}>
            <Campo label="N.º de lote" ayuda="Automático · no editable">
              <Input value={item.lote} disabled leftIcon={<IconHash size={11} />} />
            </Campo>
            <Campo label="Vencimiento" ayuda="Opcional, si aplica">
              <Input
                type="date"
                value={item.fechaVencimiento}
                onChange={(e) => onChange('fechaVencimiento', e.target.value)}
                leftIcon={<IconCalendar size={12} />}
              />
            </Campo>
            <Campo label="Cant. disponible" ayuda="Igual al total comprado">
              <Input type="number" value={item.cantidad} disabled />
            </Campo>
          </Box>
        )}
      </Box>
    </Box>
  )
}
