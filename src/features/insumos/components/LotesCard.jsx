import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { IconPackage, IconBan, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@features/produccion/components/Button'
import { dimLabelSx } from './Campo'
import { formatoFecha, diasParaVencer } from '../utils/insumosHelpers'

function LoteRow({ lote, unidad, primero }) {
  const dias = diasParaVencer(lote.fechaVencimiento)
  const agotado = lote.cantidadDisponible <= 0
  const porVencer = !agotado && dias !== null && dias <= 20

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 1.5,
        py: 1,
        bgcolor: 'background.alt',
        borderTop: primero ? 'none' : '1px solid',
        borderColor: 'divider',
        opacity: agotado ? 0.5 : 1,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: porVencer ? 'warning.main' : 'text.primary' }}>
          {lote.codigoLote}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
          Compra #{lote.idCompra} · ingresó {formatoFecha(lote.fechaRecepcion)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontSize: 14, fontFamily: 'monospace', color: 'text.primary' }}>
          {lote.cantidadDisponible} {unidad}
          <Box component="span" sx={{ color: 'text.dim' }}>
            {' '}/ {lote.cantidadRecibida} {unidad}
          </Box>
        </Typography>
        {agotado ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
            <IconBan size={12} />
            <Typography sx={{ fontSize: 12, color: 'error.main' }}>Agotado</Typography>
          </Stack>
        ) : porVencer ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
            <IconAlertTriangle size={12} />
            <Typography sx={{ fontSize: 12, color: 'warning.main' }}>Vence en {dias} días</Typography>
          </Stack>
        ) : (
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>Vence {formatoFecha(lote.fechaVencimiento)}</Typography>
        )}
      </Box>
    </Stack>
  )
}

export function LotesCard({ lotes = [], unidad = '' }) {
  const [expandido, setExpandido] = useState(false)

  const ordenados = [...lotes].sort((a, b) => {
    const da = diasParaVencer(a.fechaVencimiento) ?? Infinity
    const db = diasParaVencer(b.fechaVencimiento) ?? Infinity
    return da - db
  })
  const activos = ordenados.filter((l) => l.cantidadDisponible > 0).length
  const visibles = expandido ? ordenados : ordenados.slice(0, 2)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: 2.5,
        p: 2.5,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <IconPackage size={15} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Lotes</Typography>
        </Stack>
        <Typography sx={dimLabelSx}>{activos} lotes activos</Typography>
      </Stack>

      {ordenados.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
          Este insumo no tiene lotes registrados todavía. Se crean automáticamente al recibir una compra.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          {visibles.map((lote, idx) => (
            <LoteRow key={lote.id} lote={lote} unidad={unidad} primero={idx === 0} />
          ))}
        </Box>
      )}

      {ordenados.length > 2 && (
        <Box>
          <Button variant="ghost" size="sm" onClick={() => setExpandido((v) => !v)}>
            {expandido ? 'Ver menos' : 'Ver todos los lotes'}
          </Button>
        </Box>
      )}

      <Typography sx={{ fontSize: 12, color: 'text.dim', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        El stock actual y el costo promedio los recalcula la BD automáticamente al recibir un lote.
      </Typography>
    </Box>
  )
}
