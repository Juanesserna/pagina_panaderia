import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconPackage, IconBan, IconAlertTriangle, IconCalculator } from '@tabler/icons-react'
import { Button } from '@shared/ui'
import { formatoFecha, diasParaVencer } from '../utils/insumosHelpers'

function LoteRow({ lote, unidad }) {
  const dias = diasParaVencer(lote.fechaVencimiento)
  const agotado = lote.cantidadDisponible <= 0
  const porVencer = !agotado && dias !== null && dias <= 20

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: porVencer ? 'warning.main' : 'divider',
        bgcolor: porVencer ? (t) => alpha(t.palette.warning.main, 0.12) : 'transparent',
        opacity: agotado ? 0.5 : 1,
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: porVencer ? 'warning.main' : 'text.primary' }}>
          {lote.codigoLote}
        </Typography>
        <Typography variant="caption">
          Compra #{lote.idCompra} · ingresó {formatoFecha(lote.fechaRecepcion)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle2" component="div">
          {lote.cantidadDisponible} {unidad}{' '}
          <Typography component="span" variant="caption">
            / {lote.cantidadRecibida} {unidad}
          </Typography>
        </Typography>
        {agotado ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ color: 'error.main' }}>
            <IconBan size={12} />
            <Typography variant="caption" sx={{ color: 'inherit' }}>
              Agotado
            </Typography>
          </Stack>
        ) : porVencer ? (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" sx={{ color: 'warning.main' }}>
            <IconAlertTriangle size={12} />
            <Typography variant="caption" sx={{ color: 'inherit' }}>
              Vence en {dias} días
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption">Vence {formatoFecha(lote.fechaVencimiento)}</Typography>
        )}
      </Box>
    </Stack>
  )
}

export function LotesCard({ lotes, unidad = '' }) {
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
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main' }}>
          <IconPackage size={18} />
          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Lotes
          </Typography>
        </Stack>
        <Typography variant="caption">{activos} lotes activos</Typography>
      </Stack>

      {ordenados.length === 0 ? (
        <Typography variant="caption" sx={{ py: 1 }}>
          Este insumo no tiene lotes registrados todavía. Se crean automáticamente al recibir una compra.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {visibles.map((lote) => (
            <LoteRow key={lote.id} lote={lote} unidad={unidad} />
          ))}
        </Stack>
      )}

      {ordenados.length > 2 && (
        <Box>
          <Button variant="ghost" size="sm" onClick={() => setExpandido((v) => !v)}>
            {expandido ? 'Ver menos' : 'Ver todos los lotes'}
          </Button>
        </Box>
      )}

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider', color: 'text.dim' }}
      >
        <IconCalculator size={13} />
        <Typography variant="caption">
          El stock actual y el costo promedio los recalcula la BD automáticamente al recibir un lote.
        </Typography>
      </Stack>
    </Box>
  )
}
