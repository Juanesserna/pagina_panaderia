import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
} from '@mui/material'

import {
  ShieldCheck,
  Layers3,
  KeyRound,
  CheckCircle2,
  Circle,
  SlidersHorizontal,
} from 'lucide-react'

import { PRIVILEGIOS_POR_MODULO } from '../services/rolesService'

function Resumen({ icon: Icon, label, value }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        px: 1.2,
        py: 0.6,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        <Icon size={15} />
      </Box>

      <Box minWidth={0}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', lineHeight: 1.1 }}
        >
          {label}
        </Typography>
        <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

function ModuloCard({ modulo, privilegios }) {
  const opciones = PRIVILEGIOS_POR_MODULO[modulo] ?? []
  const asignados = privilegios[modulo] ?? []

  return (
    <Box
      sx={{
        minWidth: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          px: 1.2,
          py: 0.5,
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
        }}
      >
        <Typography variant="body2" fontWeight={700} noWrap title={modulo}>
          {modulo}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ flexShrink: 0 }}
        >
          {asignados.length}/{opciones.length}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 0.8,
          alignContent: 'flex-start',
        }}
      >
        {opciones.map((privilegio) => {
          const activo = asignados.includes(privilegio.id)

          return (
            <Box
              key={privilegio.id}
              title={`${privilegio.nombre} · ${privilegio.id}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                maxWidth: '100%',
                px: 0.7,
                py: 0.25,
                borderRadius: 1,
                bgcolor: activo ? 'action.selected' : 'action.hover',
                border: '1px solid',
                borderColor: activo ? 'divider' : 'transparent',
              }}
            >
              {activo ? (
                <CheckCircle2 size={12} color="currentColor" />
              ) : (
                <Circle size={12} color="currentColor" />
              )}

              <Typography
                sx={{
                  fontSize: 10.5,
                  lineHeight: 1.3,
                  fontWeight: activo ? 600 : 400,
                  color: activo ? 'text.primary' : 'text.secondary',
                  overflowWrap: 'anywhere',
                }}
              >
                {privilegio.nombre}
              </Typography>
            </Box>
          )
        })}

        {!opciones.length && (
          <Typography variant="caption" color="text.secondary">
            Sin privilegios disponibles.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default function RoleDetailDialog({ open, rol, onClose }) {
  if (!rol) return null

  const modulos = rol.modulos ?? []
  const privilegios = rol.privilegios ?? {}

  const totalPermisos = modulos.reduce(
    (total, modulo) => total + (privilegios[modulo]?.length ?? 0),
    0
  )

  // Reparte los módulos alternados en dos columnas independientes.
  const columnaIzq = modulos.filter((_, i) => i % 2 === 0)
  const columnaDer = modulos.filter((_, i) => i % 2 === 1)

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      fullWidth
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: '94vw',
            maxWidth: 850,
            maxHeight: '96vh',
            m: 1,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 1.5, pb: 1.2 }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Box
            sx={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2,
              bgcolor: 'action.hover',
              color: 'text.secondary',
            }}
          >
            <SlidersHorizontal size={18} />
          </Box>

          <Box>
            <Typography fontWeight={700} lineHeight={1.2}>
              Detalles del rol
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Consulta los módulos y privilegios asignados.
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 2.5,
          py: 1.2,
          overflowY: 'auto',
        }}
      >
        <Stack spacing={1.2}>
          {/* Información principal del rol */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {rol.nombre}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Identificador del rol: #{rol.id}
              </Typography>
            </Box>

            <Chip
              icon={<ShieldCheck size={14} />}
              label={rol.estado}
              color={rol.estado === 'Activo' ? 'success' : 'default'}
              size="small"
              sx={{ height: 22 }}
            />
          </Stack>

          {/* Estadísticas del rol */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 1,
            }}
          >
            <Resumen
              icon={Layers3}
              label="Módulos asignados"
              value={modulos.length}
            />

            <Resumen
              icon={KeyRound}
              label="Privilegios asignados"
              value={totalPermisos}
            />
          </Box>

          <Typography variant="subtitle2" fontWeight={700}>
            Permisos por módulo
          </Typography>

          {modulos.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                },
                gap: 1,
                alignItems: 'start',
              }}
            >
              <Stack spacing={1}>
                {columnaIzq.map((modulo) => (
                  <ModuloCard
                    key={modulo}
                    modulo={modulo}
                    privilegios={privilegios}
                  />
                ))}
              </Stack>

              <Stack spacing={1}>
                {columnaDer.map((modulo) => (
                  <ModuloCard
                    key={modulo}
                    modulo={modulo}
                    privilegios={privilegios}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Este rol todavía no tiene módulos asignados.
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1 }}>
        <Button onClick={onClose} variant="contained" size="small">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
