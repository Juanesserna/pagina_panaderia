import { Box, Stack, Typography, Alert } from '@mui/material'
import { Button, Modal, StatusBadge } from '@shared/ui'
import { estadoDotColor, estadoVariant } from '../../constants/pedidos.constants'
import { obtenerNombreCliente, opcionesEstadoParaFila, cap } from '../../utils/pedidosHelpers'

export default function CambiarEstadoPedidoModal({
  abierto,
  pedido,
  estadoSeleccionado,
  onSeleccionar,
  pasoConfirmacion,
  onSolicitarConfirmacion,
  onRegresarASeleccion,
  motivo,
  onMotivoChange,
  procesando,
  onCerrar,
  onConfirmar,
}) {
  if (!pedido) return null

  const esAnulado = pedido.estado === 'anulado'
  const opciones = opcionesEstadoParaFila(pedido.estado)

  return (
    <Modal
      open={abierto}
      onClose={procesando ? undefined : onCerrar}
      title={pasoConfirmacion ? 'Confirmar cambio de estado' : 'Cambiar estado del pedido'}
      size="sm"
      showDivider
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2">
          Pedido <b>{pedido.id}</b> · {obtenerNombreCliente(pedido)}
        </Typography>

        {esAnulado ? (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            Este pedido se encuentra <b>Anulado</b>. La política del sistema prohíbe realizar modificaciones a pedidos anulados.
          </Alert>
        ) : pasoConfirmacion ? (
          // Tarea 3: Confirmación visual explícita indicando estado actual y nuevo estado
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity={estadoSeleccionado === 'anulado' ? 'warning' : 'info'} sx={{ borderRadius: 1.5 }}>
              ¿Estás seguro de que deseas actualizar el estado de este pedido?
            </Alert>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.alt',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Estado actual:
                </Typography>
                <StatusBadge variant={estadoVariant[pedido.estado]} dot>
                  {cap(pedido.estado)}
                </StatusBadge>
              </Stack>

              <Typography variant="h6" align="center" sx={{ color: 'text.secondary', my: -0.5 }}>
                ↓
              </Typography>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Nuevo estado:
                </Typography>
                <StatusBadge variant={estadoVariant[estadoSeleccionado]} dot>
                  {cap(estadoSeleccionado)}
                </StatusBadge>
              </Stack>
            </Box>

            {estadoSeleccionado === 'anulado' && (
              <Typography variant="caption" sx={{ color: 'error.main', fontStyle: 'italic' }}>
                Atención: Al transicionar al estado "Anulado", el pedido quedará bloqueado y no podrá volver a modificarse.
              </Typography>
            )}

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={onRegresarASeleccion} disabled={procesando}>
                Regresar
              </Button>
              <Button
                variant={estadoSeleccionado === 'anulado' ? 'danger' : 'primary'}
                size="sm"
                onClick={onConfirmar}
                disabled={procesando}
              >
                {procesando ? 'Actualizando…' : 'Confirmar cambio'}
              </Button>
            </Stack>
          </Box>
        ) : (
          // Paso 1: Selección del nuevo estado
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Selecciona el nuevo estado para el pedido:
            </Typography>

            {opciones.map((o) => {
              const activo = estadoSeleccionado === o.value
              return (
                <Box
                  key={o.value}
                  onClick={() => onSeleccionar(o.value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: activo ? 'text.primary' : 'divider',
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 1,
                    bgcolor: activo ? 'action.selected' : 'transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: estadoDotColor[o.value] }} />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: activo ? 600 : 400 }}>
                    {o.label}
                  </Typography>
                  {o.value === pedido.estado && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      (Actual)
                    </Typography>
                  )}
                </Box>
              )
            })}

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1.5 }}>
              <Button variant="secondary" size="sm" onClick={onCerrar}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!estadoSeleccionado || estadoSeleccionado === pedido.estado}
                onClick={onSolicitarConfirmacion}
              >
                Continuar
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  )
}

