import { Alert, Box, Stack, Typography } from '@mui/material'
import { IconArrowRight } from '@tabler/icons-react'
import { Button, Input, Modal, StatusBadge } from '@shared/ui'
import { estadoDotColor, estadoVariant } from '../../constants/ventas.constants'
import { cap, obtenerNombreCliente, opcionesEstadoParaFila } from '../../utils/ventasHelpers'

export default function CambiarEstadoModal({
  abierto,
  venta,
  estadoSeleccionado,
  paso,
  password,
  errorPassword,
  procesando,
  onSeleccionar,
  onPasswordChange,
  onRegresarASeleccion,
  onCerrar,
  onConfirmar,
}) {
  if (!venta) return null

  const esAnulado = venta.estado === 'anulado'
  const esPasoSeguridad = paso === 'confirmacion_anulacion'

  return (
    <Modal
      open={abierto}
      onClose={onCerrar}
      title={esPasoSeguridad ? 'Confirmar anulación' : 'Cambiar estado'}
      size="sm"
      showDivider
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          Venta <b>{venta.id}</b> · {obtenerNombreCliente(venta)}
        </Typography>

        {esAnulado ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
            <Alert severity="error">
              Esta venta se encuentra anulada. Su estado no puede ser modificado.
            </Alert>
            <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={onCerrar}>
                Cerrar
              </Button>
            </Stack>
          </Box>
        ) : esPasoSeguridad ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Alert severity="warning">
              Atención: La anulación de una venta es permanente e irreversible. No podrá volver a modificarse. Esta acción requiere permisos de Administrador o Gerente.
            </Alert>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                p: 1.25,
                borderRadius: 1.5,
                bgcolor: 'background.alt',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <StatusBadge variant={estadoVariant[venta.estado]} dot>
                {cap(venta.estado)}
              </StatusBadge>
              <IconArrowRight size={16} />
              <StatusBadge variant="danger" dot>
                Anulado
              </StatusBadge>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Ingrese su contraseña de administrador para continuar:
              </Typography>
              <Input
                type="password"
                placeholder="Contraseña de administrador"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                disabled={procesando}
              />
              {errorPassword && (
                <Alert severity="error">
                  {errorPassword}
                </Alert>
              )}
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" disabled={procesando} onClick={onRegresarASeleccion}>
                Regresar
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!password || procesando}
                onClick={onConfirmar}
              >
                Confirmar anulación
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {opcionesEstadoParaFila(venta.estado).map((o) => {
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
                    px: 1.25,
                    py: 0.875,
                    bgcolor: activo ? 'action.selected' : 'transparent',
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: estadoDotColor[o.value] }} />
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {o.label}
                  </Typography>
                </Box>
              )
            })}

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
              <Button variant="secondary" size="sm" onClick={onCerrar}>
                Cancelar
              </Button>
              <Button
                variant={estadoSeleccionado === 'anulado' ? 'danger' : 'primary'}
                size="sm"
                disabled={!estadoSeleccionado || estadoSeleccionado === venta.estado}
                onClick={onConfirmar}
              >
                {estadoSeleccionado === 'anulado' ? 'Continuar a anulación' : 'Confirmar'}
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
