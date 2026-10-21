import { useState, useEffect } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoVariant } from '@features/produccion/constants/produccion.constants'
import { cap, estadoEfectivo, totalCantidad, calcularInsumos, formatCantidadInsumo } from '@features/produccion/utils/produccionHelpers'
import DimLabel from '@features/produccion/components/common/DimLabel'

function DetalleContenido({ orden, recetas, insumosAbiertos, onToggleInsumos, onClose }) {
  const insumos = calcularInsumos(orden.items, recetas)
  const efectivo = estadoEfectivo(orden)
  const detalleItems = [
    ...(orden.producto !== 'Manual' && orden.ventaId ? [{ label: 'Venta relacionada', value: orden.ventaId }] : []),
    { label: 'Cantidad', value: `${totalCantidad(orden)}${orden.unidad !== 'piezas' ? ` ${orden.unidad}` : ''}` },
    { label: 'Fecha solicitud', value: orden.fechaSolicitud },
    { label: 'Fecha fabricación', value: orden.fechaFabricacion || 'Por definir' },
    { label: 'Generado por', value: orden.generadoPor.nombre },
    { label: 'NIT/Cédula', value: orden.generadoPor.documento },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        {detalleItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              borderRadius: 1.5,
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.alt',
            }}
          >
            <DimLabel>{item.label}</DimLabel>
            <Typography variant="subtitle1">
              {item.label === 'Fecha fabricación' && !orden.fechaFabricacion ? (
                <Box component="span" sx={{ fontStyle: 'italic', opacity: 0.55 }}>
                  {item.value}
                </Box>
              ) : (
                item.value
              )}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <DimLabel>Productos asociados</DimLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          {orden.items.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 1,
                bgcolor: 'background.alt',
                borderTop: idx > 0 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {item.nombre}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {item.cantidad}
                {orden.unidad !== 'piezas' ? ` ${orden.unidad}` : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {insumos.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={onToggleInsumos}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 1.5,
              px: 1.5,
              py: 1.25,
              bgcolor: 'background.alt',
              border: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <DimLabel sx={{ color: 'text.secondary' }}>Insumos requeridos ({insumos.length})</DimLabel>
            {insumosAbiertos ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
          </Box>
          {insumosAbiertos && (
            <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              {insumos.map((insumo, idx) => (
                <Box
                  key={insumo.nombre}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    bgcolor: 'background.alt',
                    borderTop: idx > 0 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {insumo.nombre}
                  </Typography>
                  <Typography variant="mono" sx={{ color: 'text.secondary' }}>
                    {formatCantidadInsumo(insumo.cantidad)} {insumo.unidad}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Estado:
        </Typography>
        <StatusBadge variant={estadoVariant[efectivo]} dot>
          {cap(efectivo)}
        </StatusBadge>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </Stack>
    </Box>
  )
}

export default function OrdenDetalleModal({ open, onClose, orden, recetas }) {
  const [insumosAbiertos, setInsumosAbiertos] = useState(false)

  // Cada vez que se abre el detalle de una orden, la sección de insumos arranca colapsada.
  useEffect(() => {
    if (open) setInsumosAbiertos(false)
  }, [open, orden])

  return (
    <Modal open={open} onClose={onClose} title={`Detalle orden ${orden?.id ?? ''}`} size="md" showDivider>
      {orden && (
        <DetalleContenido
          orden={orden}
          recetas={recetas}
          insumosAbiertos={insumosAbiertos}
          onToggleInsumos={() => setInsumosAbiertos((v) => !v)}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}
