import { Box, IconButton, Typography } from '@mui/material'
import { IconCalendar, IconChevronDown, IconChevronUp, IconHash, IconPlus, IconX } from '@tabler/icons-react'
import { Input, Select } from '@shared/ui'
import { formatearMoneda, opcionesInsumo } from '../utils/comprasHelpers'
import { Campo } from './Campo'

// Una línea de "Productos solicitados": insumo, cantidad, unidad (heredada), valor
// y, plegable, la trazabilidad del lote (n.º de lote, vencimiento, cantidad disponible).
export function ItemCompraForm({ item, insumos, lotesAbierto, puedeQuitar, onChange, onQuitar, onAlternarLote, onNuevoInsumo }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2.25,
        borderRadius: 2.5,
        bgcolor: 'background.alt',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      {puedeQuitar && (
        <IconButton
          size="small"
          onClick={onQuitar}
          aria-label="Eliminar insumo"
          sx={{ position: 'absolute', top: 8, right: 8, color: 'text.dim', '&:hover': { color: 'error.main', bgcolor: 'action.hover' } }}
        >
          <IconX size={15} />
        </IconButton>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'minmax(180px, 1.45fr) repeat(5, minmax(0, 0.72fr))',
          },
          gap: 1.75,
          alignItems: 'start',
          pr: puedeQuitar ? 3.5 : 0,
          minWidth: 0,
          '& > *': { minWidth: 0 },
        }}
      >
        <Campo label="Insumo">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Select options={opcionesInsumo(insumos)} value={item.nombre} onChange={(e) => onChange('nombre', e.target.value)} />
            </Box>
            {onNuevoInsumo && (
              <IconButton
                size="small"
                onClick={onNuevoInsumo}
                title="Nuevo insumo"
                sx={{
                  color: 'primary.main',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                }}
              >
                <IconPlus size={16} />
              </IconButton>
            )}
          </Box>
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
        <Campo label="Descuento de producto" ayuda="Opcional, % sobre el ítem">
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={item.descuentoProducto || ''}
            onChange={(e) => onChange('descuentoProducto', Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
          />
        </Campo>
        <Campo label="Subtotal ($)">
          <Input disabled value={formatearMoneda(Math.round(item.cantidad * item.precioUnitario * (1 - (item.descuentoProducto || 0) / 100)))} />
        </Campo>
      </Box>

      {/* Trazabilidad del lote: subgrupo plegable */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1.75, borderTop: '1px dashed', borderColor: 'divider' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <IconHash size={12} style={{ opacity: 0.5 }} />
            <Typography variant="overline">Trazabilidad del lote</Typography>
            <Typography variant="mono" sx={{ color: 'text.dim' }}>
              · {item.lote}
            </Typography>
          </Box>
          {lotesAbierto ? <IconChevronUp size={14} style={{ opacity: 0.6 }} /> : <IconChevronDown size={14} style={{ opacity: 0.6 }} />}
        </Box>

        {lotesAbierto && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
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
