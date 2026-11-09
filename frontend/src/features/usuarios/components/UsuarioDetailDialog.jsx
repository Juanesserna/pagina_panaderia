import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

import {
  Mail,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react'

import UserAvatar from '@shared/components/UserAvatar'
import StatusChip from './StatusChip'

import { getModulosVisibles } from '../services/usuariosService'
import { formatearHora } from '../../empleados/services/empleadosService'

function Dato({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 600,
          color: 'text.secondary',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>

      <Typography
        component="div"
        sx={{
          fontSize: 12.5,
          fontWeight: 600,
          color: 'text.primary',
          overflowWrap: 'anywhere',
          lineHeight: 1.35,
        }}
      >
        {value === null || value === undefined || value === ''
          ? 'No registrado'
          : value}
      </Typography>
    </Box>
  )
}

function Seccion({ icon: Icon, titulo, children }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        minWidth: 0,
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          mb: 1.2,
        }}
      >
        <Box sx={{ display: 'flex', color: 'text.secondary' }}>
          <Icon size={17} />
        </Box>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          {titulo}
        </Typography>
      </Box>

      {children}
    </Box>
  )
}

function PerfilCard({ perfil, tipo }) {
  if (!perfil) return null

  const esCliente = tipo === 'cliente'

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          mb: 1.2,
        }}
      >
        {esCliente ? (
          <UserRound size={17} />
        ) : (
          <BriefcaseBusiness size={17} />
        )}

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {esCliente ? 'Perfil de cliente' : 'Perfil de empleado'}
        </Typography>

        <Chip
          label="Vinculado"
          color="success"
          variant="outlined"
          size="small"
          sx={{
            ml: 'auto',
            height: 22,
            fontSize: 10.5,
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
          },
          gap: 1.2,
        }}
      >
        <Dato label="Nombre completo" value={perfil.nombre} />
        <Dato
          label="Tipo de documento"
          value={perfil.tipoDocumento}
        />
        <Dato
          label="Número de documento"
          value={perfil.documento}
        />

        {!esCliente && (
          <>
            <Dato label="Teléfono" value={perfil.telefono} />
            <Dato
              label="Hora de entrada"
              value={formatearHora(perfil.horaEntrada)}
            />
            <Dato
              label="Hora de salida"
              value={formatearHora(perfil.horaSalida)}
            />
          </>
        )}
      </Box>
    </Box>
  )
}

export default function UsuarioDetailDialog({
  open,
  usuario,
  onClose,
}) {
  if (!usuario) return null

  const modulos = getModulosVisibles(usuario)
  const nombreUsuario =
    usuario.nombre?.trim() || `Usuario #${usuario.id}`

  const tieneCliente = Boolean(usuario.cliente)
  const tieneEmpleado = Boolean(usuario.empleado)
  const tienePerfiles = tieneCliente || tieneEmpleado

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return
    }

    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      disableEscapeKeyDown
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: 'calc(100dvh - 24px)',
            width: '100%',
            m: { xs: 1, sm: 2 },
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 1.8, pb: 1 }}>
        <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
          Detalles del usuario
        </Typography>

        <Typography
          sx={{ fontSize: 12, color: 'text.secondary', mt: 0.2 }}
        >
          Información de la cuenta, perfiles vinculados y módulos disponibles.
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: 1.5,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.3,
            mb: 1.5,
          }}
        >
          <UserAvatar name={nombreUsuario} size={44} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}
            >
              {nombreUsuario}
            </Typography>

            <Typography
              sx={{ fontSize: 11.5, color: 'text.secondary' }}
            >
              Identificador de cuenta: #{usuario.id}
            </Typography>
          </Box>

          <StatusChip estado={usuario.estado} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 0.75fr) minmax(0, 1.25fr)',
            },
            gap: 1.5,
            alignItems: 'stretch',
          }}
        >
          <Seccion icon={ShieldCheck} titulo="Información de la cuenta">
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 0.8,
                }}
              >
                <Box
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    mt: 0.2,
                  }}
                >
                  <Mail size={15} />
                </Box>

                <Dato
                  label="Correo electrónico"
                  value={usuario.email || 'No disponible'}
                />
              </Box>

              <Dato
                label="Rol asignado"
                value={usuario.rol || 'Sin rol asignado'}
              />

              <Dato
                label="Estado de la cuenta"
                value={<StatusChip estado={usuario.estado} />}
              />
            </Box>
          </Seccion>

          <Seccion icon={UserRound} titulo="Perfiles relacionados">
            {tienePerfiles ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    tieneCliente && tieneEmpleado
                      ? { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                      : '1fr',
                  gap: 1,
                }}
              >
                {tieneCliente && (
                  <PerfilCard
                    perfil={usuario.cliente}
                    tipo="cliente"
                  />
                )}

                {tieneEmpleado && (
                  <PerfilCard
                    perfil={usuario.empleado}
                    tipo="empleado"
                  />
                )}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: 'text.secondary',
                }}
              >
                Esta cuenta no tiene perfiles de cliente o empleado relacionados.
              </Typography>
            )}
          </Seccion>
        </Box>

        <Box sx={{ mt: 1.5 }}>
          <Seccion icon={LayoutGrid} titulo="Módulos disponibles">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                mb: 1.3,
              }}
            >
              <Chip
                label={`${modulos.length} módulos`}
                size="small"
                variant="outlined"
                sx={{ height: 23, fontSize: 11 }}
              />

              <Typography
                sx={{
                  fontSize: 11.5,
                  color: 'text.secondary',
                }}
              >
                Accesos heredados del rol. Los privilegios se administran desde Roles.
              </Typography>
            </Box>

            {modulos.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    sm: 'repeat(3, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))',
                    lg: 'repeat(6, minmax(0, 1fr))',
                  },
                  gap: 0.8,
                }}
              >
                {modulos.map((modulo) => (
                  <Box
                    key={modulo.nombre}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.7,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      px: 1,
                      py: 0.9,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        color: 'success.main',
                        display: 'flex',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={15} />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {modulo.nombre}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: 'text.secondary',
                }}
              >
                Este rol todavía no tiene módulos disponibles.
              </Typography>
            )}
          </Seccion>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
