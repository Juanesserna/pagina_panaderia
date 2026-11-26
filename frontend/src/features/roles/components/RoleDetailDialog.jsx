import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Collapse,
  ButtonBase,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import {
  ShieldCheck,
  Layers3,
  KeyRound,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { getModuleIcon } from '@shared/utils/moduleIcons'
import {
  MODULOS,
  PRIVILEGIOS_POR_MODULO,
} from '../services/rolesService'

const cardSx = {
  border: 1,
  borderColor: 'divider',
  borderTop: 3,
  borderTopColor: 'primary.main',
  borderRadius: '8px',
  bgcolor: 'background.paper',
  minWidth: 0,
}

function IconoCaja({ icon: Icon, size = 30 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1.5,
        bgcolor: 'action.hover',
        color: 'primary.main',
        flexShrink: 0,
      }}
    >
      <Icon size={Math.round(size * 0.55)} />
    </Box>
  )
}

// Indicadores de información del rol.
function Resumen({ icon, label, value }) {
  return (
    <Box
      sx={{
        ...cardSx,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 0.75,
      }}
    >
      <IconoCaja icon={icon} />

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
          {label}
        </Typography>

        <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

// Tarjeta expandible con los privilegios asignados.
function ModuloCard({ modulo, asignados, expandido, onToggle }) {
  const Icono = getModuleIcon(modulo)
  const total = PRIVILEGIOS_POR_MODULO[modulo]?.length ?? 0

  return (
    <Box sx={{ ...cardSx, overflow: 'hidden' }}>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={expandido}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 0.75,
          textAlign: 'left',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <IconoCaja icon={Icono} size={28} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {modulo}
          </Typography>

          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
            {asignados.length} de {total} privilegios
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', color: 'text.secondary' }}>
          {expandido
            ? <ChevronUp size={17} />
            : <ChevronDown size={17} />}
        </Box>
      </ButtonBase>

      <Collapse in={expandido} unmountOnExit>
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 0.75,
            p: 0.75,
          }}
        >
          {asignados.map(privilegio => (
            <Box
              key={privilegio.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  color: 'success.main',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={14} />
              </Box>

              <Typography
                sx={{
                  fontSize: 11.5,
                  lineHeight: 1.4,
                  overflowWrap: 'anywhere',
                }}
              >
                {privilegio.nombre}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

export default function RoleDetailDialog({ open, rol, onClose }) {
  const [expandidos, setExpandidos] = useState([])

  const theme = useTheme()
  const esMediano = useMediaQuery(theme.breakpoints.up('md'))
  const esPequeno = useMediaQuery(theme.breakpoints.up('sm'))

  const cantidadColumnas = esMediano ? 4 : esPequeno ? 2 : 1

  useEffect(() => {
    setExpandidos([])
  }, [open, rol?.id])

  if (!rol) return null

  // Solo muestra módulos con privilegios válidos y asignados.
  const modulos = MODULOS.map(nombre => ({
    nombre,
    asignados: PRIVILEGIOS_POR_MODULO[nombre].filter(
      privilegio =>
        (rol.privilegios?.[nombre] ?? []).includes(privilegio.id)
    ),
  })).filter(modulo => modulo.asignados.length > 0)

  const totalPermisos = modulos.reduce(
    (total, modulo) => total + modulo.asignados.length,
    0
  )

  const todosExpandidos =
    modulos.length > 0 &&
    modulos.every(modulo => expandidos.includes(modulo.nombre))

  // Distribuye las tarjetas en columnas independientes.
  // Cada columna ajusta su altura sin afectar a las demás.
  const columnas = Array.from(
    { length: cantidadColumnas },
    (_, indice) =>
      modulos.filter((_, posicion) =>
        posicion % cantidadColumnas === indice
      )
  )

  function toggleModulo(nombre) {
    setExpandidos(prev =>
      prev.includes(nombre)
        ? prev.filter(item => item !== nombre)
        : [...prev, nombre]
    )
  }

  function toggleTodos() {
    setExpandidos(
      todosExpandidos
        ? []
        : modulos.map(modulo => modulo.nombre)
    )
  }

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') onClose()
      }}
      fullWidth
      maxWidth={false}
      aria-labelledby="role-detail-title"
      slotProps={{
        paper: {
          sx: {
            width: '94vw',
            maxWidth: 1100,
            maxHeight: '90dvh',
            m: 1,
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle id="role-detail-title" sx={{ px: 2.5, py: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <IconoCaja icon={ShieldCheck} size={36} />

          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
              Detalles del rol
            </Typography>

            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Consulta la información y los privilegios asignados.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.25 }}>
        {/* Información principal */}
        <Box
          sx={{
            ...cardSx,
            p: 1,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
              {rol.nombre}
            </Typography>

            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              ID: #{rol.id}
            </Typography>
          </Box>

          <Chip
            label={rol.estado}
            color={rol.estado === 'Activo' ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Indicadores */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1,
            mb: 1,
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

          <Resumen
            icon={Users}
            label="Usuarios asignados"
            value={rol.usuariosAsignados ?? '—'}
          />
        </Box>

        {/* Controles de visualización */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 0.75,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            Privilegios por módulo
          </Typography>

          <Button
            size="small"
            onClick={toggleTodos}
            disabled={!modulos.length}
            startIcon={
              todosExpandidos
                ? <ChevronUp size={16} />
                : <ChevronDown size={16} />
            }
          >
            {todosExpandidos ? 'Contraer todos' : 'Expandir todos'}
          </Button>
        </Box>

        {/* Columnas independientes de módulos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              `repeat(${cantidadColumnas}, minmax(0, 1fr))`,
            alignItems: 'start',
            gap: 1,
          }}
        >
          {columnas.map((columna, indice) => (
            <Box
              key={indice}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minWidth: 0,
              }}
            >
              {columna.map(modulo => (
                <ModuloCard
                  key={modulo.nombre}
                  modulo={modulo.nombre}
                  asignados={modulo.asignados}
                  expandido={expandidos.includes(modulo.nombre)}
                  onToggle={() => toggleModulo(modulo.nombre)}
                />
              ))}
            </Box>
          ))}
        </Box>

        {!modulos.length && (
          <Typography
            sx={{
              fontSize: 13,
              color: 'text.secondary',
              textAlign: 'center',
              py: 3,
            }}
          >
            Este rol no tiene privilegios asignados.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1 }}>
        <Button size="small" variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
