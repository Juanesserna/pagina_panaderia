import { Box, Stack, Typography } from '@mui/material'
import { IconLock, IconPlus } from '@tabler/icons-react'
import { Button, Input, Modal, Select } from '@shared/ui'
import { useNuevaCompraForm } from '../hooks/useNuevaCompraForm'
import { formatearMoneda, opcionesProveedor } from '../utils/comprasHelpers'
import { Campo } from './Campo'
import { ItemCompraForm } from './ItemCompraForm'

// El formulario se monta cada vez que el modal abre, así siempre arranca limpio.
function NuevaCompraForm({ compras, proveedores, insumos, solicitanteInicial, onConfirmar, onInvalido, onClose }) {
  const f = useNuevaCompraForm({ compras, proveedores, insumos, solicitanteInicial })

  const confirmar = () => {
    if (!f.esValido) {
      onInvalido()
      return
    }
    onConfirmar(f.construir())
  }

  return (
    // Cuerpo con scroll propio y footer con el total siempre visible
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 1 }}>
          {/* Identificación (la pone el sistema) */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
            <Campo label="ID de orden" ayuda="Generado automáticamente">
              <Input value={f.meta.id} disabled rightIcon={<IconLock size={12} />} />
            </Campo>
            <Campo label="Fecha" ayuda="Fecha del sistema">
              <Input value={f.meta.fecha} disabled />
            </Campo>
          </Box>

          {/* Configuración */}
          <Campo label="Proveedor">
            <Select
              options={opcionesProveedor(proveedores)}
              value={f.form.proveedorId}
              onChange={(e) => f.cambiarCampo('proveedorId', e.target.value)}
            />
          </Campo>

          <Box sx={{ maxWidth: 220 }}>
            <Campo label="Descuento general (%)">
              <Input
                type="number"
                min={0}
                placeholder="Ej: 10"
                value={f.form.descuento || ''}
                onChange={(e) => f.cambiarCampo('descuento', Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              />
            </Campo>
          </Box>

          {/* Productos solicitados */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="overline">Productos solicitados</Typography>
            {f.form.items.map((item, idx) => (
              <ItemCompraForm
                key={item.lote}
                item={item}
                insumos={insumos}
                lotesAbierto={Boolean(f.lotesAbiertos[item.lote])}
                puedeQuitar={f.form.items.length > 1}
                onChange={(campo, valor) => f.cambiarItem(idx, campo, valor)}
                onQuitar={() => f.quitarItem(idx)}
                onAlternarLote={() => f.alternarLote(item.lote)}
              />
            ))}
            <Button variant="secondary" size="sm" leftIcon={<IconPlus size={13} />} onClick={f.agregarItem}>
              Agregar insumo
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer fijo: no se desplaza junto con el cuerpo */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.dim' }}>
              Total a pagar
            </Typography>
            {f.totalDescontado > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: 'accentDim',
                  color: 'primary.main',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <Typography variant="caption" sx={{ color: 'primary.main', my: 0, fontWeight: 600 }}>
                  −{formatearMoneda(f.totalDescontado)} descontado
                </Typography>
              </Box>
            )}
          </Box>
          <Typography variant="h5">{formatearMoneda(f.total)}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={confirmar}>
            Generar orden
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export function NuevaCompraModal({ open, onClose, ...props }) {
  return (
    <Modal open={open} onClose={onClose} title="Nueva orden de compra" size="lg" showDivider sx={{ maxWidth: 'xl', width: '100%' }}>
      <NuevaCompraForm onClose={onClose} {...props} />
    </Modal>
  )
}
