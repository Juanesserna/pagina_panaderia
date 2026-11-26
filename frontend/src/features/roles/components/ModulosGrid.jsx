import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  LinearProgress,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  CheckCheck,
  ListX,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { getModuleIcon } from '@shared/utils/moduleIcons'
import {
  MODULOS,
  PRIVILEGIOS_POR_MODULO,
} from '../services/rolesService'

const TOTAL_PRIVILEGIOS = MODULOS.reduce(
  (total, modulo) =>
    total + PRIVILEGIOS_POR_MODULO[modulo].length,
  0
)

const checkboxSx = {
  p: 0.6,
  '& .MuiSvgIcon-root': {
    fontSize: 19,
  },
}

export default function ModulosGrid({
  privilegios = {},
  privilegiosProtegidos = {},
  onPrivilegiosChange,
  disabled = false,
}) {
  // Obtiene únicamente los permisos válidos de cada módulo.
  const obtenerIds = modulo =>
    PRIVILEGIOS_POR_MODULO[modulo].map(({ id }) => id)

  const obtenerProtegidos = modulo =>
    obtenerIds(modulo).filter(id =>
      privilegiosProtegidos[modulo]?.includes(id)
    )

  const obtenerSeleccionados = modulo =>
    obtenerIds(modulo).filter(id =>
      privilegios[modulo]?.includes(id) ||
      privilegiosProtegidos[modulo]?.includes(id)
    )

  const totalSeleccionados = MODULOS.reduce(
    (total, modulo) =>
      total + obtenerSeleccionados(modulo).length,
    0
  )

  const totalProtegidos = MODULOS.reduce(
    (total, modulo) =>
      total + obtenerProtegidos(modulo).length,
    0
  )

  const modulosAsignados = MODULOS.filter(
    modulo => obtenerSeleccionados(modulo).length > 0
  ).length

  const porcentaje = TOTAL_PRIVILEGIOS
    ? (totalSeleccionados / TOTAL_PRIVILEGIOS) * 100
    : 0

  // Garantiza que ninguna selección retire permisos protegidos.
  function actualizar(nuevos) {
    if (disabled) return

    const resultado = Object.fromEntries(
      MODULOS.map(modulo => [
        modulo,
        obtenerIds(modulo).filter(id =>
          nuevos[modulo]?.includes(id) ||
          privilegiosProtegidos[modulo]?.includes(id)
        ),
      ]).filter(([, ids]) => ids.length > 0)
    )

    onPrivilegiosChange(resultado)
  }

  function cambiarPrivilegio(modulo, id, checked) {
    if (
      disabled ||
      obtenerProtegidos(modulo).includes(id)
    ) return

    const actuales = obtenerSeleccionados(modulo)

    actualizar({
      ...privilegios,
      [modulo]: checked
        ? [...new Set([...actuales, id])]
        : actuales.filter(item => item !== id),
    })
  }

  function seleccionarModulo(modulo, checked) {
    actualizar({
      ...privilegios,
      [modulo]: checked
        ? obtenerIds(modulo)
        : obtenerProtegidos(modulo),
    })
  }

  function seleccionarTodos() {
    actualizar(
      Object.fromEntries(
        MODULOS.map(modulo => [
          modulo,
          obtenerIds(modulo),
        ])
      )
    )
  }

  function deseleccionarTodos() {
    actualizar(privilegiosProtegidos)
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      {/* Resumen general de privilegios */}
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderTop: 3,
          borderTopColor: 'primary.main',
          borderRadius: 2,
          p: 2,
          mb: 1.5,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: 'primary.main',
                bgcolor: theme =>
                  alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ShieldCheck size={23} />
            </Box>

            <Box>
              <Typography fontWeight={700} fontSize={15}>
                Módulos y privilegios
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Configura las acciones permitidas para este rol.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              color="primary.main"
              fontWeight={700}
              fontSize={25}
              sx={{ lineHeight: 1.2 }}
            >
              {totalSeleccionados}/{TOTAL_PRIVILEGIOS}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Privilegios seleccionados
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={porcentaje}
          aria-label="Privilegios seleccionados"
          sx={{
            mt: 1.5,
            height: 5,
            borderRadius: 5,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {modulosAsignados} de {MODULOS.length} módulos asignados
          </Typography>

          {totalProtegidos > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
              }}
            >
              <Lock size={13} />

              <Typography variant="caption">
                {totalProtegidos} privilegios protegidos
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1.5,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckCheck size={17} />}
            onClick={seleccionarTodos}
            disabled={
              disabled ||
              totalSeleccionados === TOTAL_PRIVILEGIOS
            }
          >
            Seleccionar todos
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<ListX size={17} />}
            onClick={deseleccionarTodos}
            disabled={
              disabled ||
              totalSeleccionados === totalProtegidos
            }
          >
            Deseleccionar todos
          </Button>
        </Box>

        {totalProtegidos > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Los privilegios protegidos no pueden desmarcarse.
          </Typography>
        )}
      </Box>

      {/* Tarjetas de módulos */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1.5,
          alignItems: 'stretch',
        }}
      >
        {MODULOS.map(modulo => {
          const Icono = getModuleIcon(modulo)
          const opciones = PRIVILEGIOS_POR_MODULO[modulo]
          const seleccionados = obtenerSeleccionados(modulo)
          const protegidos = obtenerProtegidos(modulo)

          const cantidad = seleccionados.length
          const total = opciones.length
          const completo = total > 0 && cantidad === total
          const parcial = cantidad > 0 && cantidad < total
          const asignado = cantidad > 0
          const bloqueado = protegidos.length === total

          return (
            <Box
              key={modulo}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                border: 1,
                borderColor: asignado
                  ? 'primary.main'
                  : 'divider',
                borderTop: 3,
                borderTopColor: asignado
                  ? 'primary.main'
                  : 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Encabezado de la tarjeta */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.25,
                  py: 1.1,
                  bgcolor: theme =>
                    asignado
                      ? alpha(theme.palette.primary.main, 0.05)
                      : theme.palette.action.hover,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 1.5,
                    color: asignado
                      ? 'primary.main'
                      : 'text.secondary',
                    bgcolor: theme =>
                      alpha(
                        theme.palette.primary.main,
                        asignado ? 0.12 : 0.05
                      ),
                  }}
                >
                  <Icono size={19} />
                </Box>

                <Typography
                  fontSize={13}
                  fontWeight={700}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  {modulo}
                </Typography>

                {protegidos.length > 0 && (
                  <Box
                    component="span"
                    title="Contiene privilegios protegidos"
                    sx={{
                      display: 'flex',
                      color: 'text.secondary',
                    }}
                  >
                    <Lock size={14} />
                  </Box>
                )}

                <Typography
                  fontSize={12}
                  fontWeight={700}
                  color={
                    asignado
                      ? 'primary.main'
                      : 'text.secondary'
                  }
                >
                  {cantidad}/{total}
                </Typography>
              </Box>

              {/* Selección por módulo */}
              <Box sx={{ px: 1.25, py: 0.75 }}>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      checked={completo}
                      indeterminate={parcial}
                      disabled={disabled || bloqueado}
                      onChange={(_, checked) =>
                        seleccionarModulo(modulo, checked)
                      }
                      sx={checkboxSx}
                    />
                  }
                  label={
                    <Typography fontSize={12} fontWeight={600}>
                      {bloqueado
                        ? 'Módulo protegido'
                        : 'Seleccionar módulo'}
                    </Typography>
                  }
                />
              </Box>

              {/* Privilegios individuales */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  alignItems: 'start',
                  columnGap: 0.5,
                  rowGap: 0.25,
                  px: 1.25,
                  pb: 1.25,
                  flex: 1,
                }}
              >
                {opciones.map(({ id, nombre }) => {
                  const protegido = protegidos.includes(id)

                  return (
                    <FormControlLabel
                      key={id}
                      sx={{
                        m: 0,
                        minWidth: 0,
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          minWidth: 0,
                          pt: 0.65,
                        },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          checked={seleccionados.includes(id)}
                          disabled={disabled || protegido}
                          onChange={(_, checked) =>
                            cambiarPrivilegio(
                              modulo,
                              id,
                              checked
                            )
                          }
                          sx={checkboxSx}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            fontSize={11.5}
                            sx={{ lineHeight: 1.4 }}
                            color="text.secondary"
                          >
                            {nombre}
                          </Typography>

                          {protegido && (
                            <Box
                              component="span"
                              title="Privilegio protegido"
                              sx={{
                                display: 'flex',
                                flexShrink: 0,
                                color: 'text.secondary',
                              }}
                            >
                              <Lock size={11} />
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  )
                })}
              </Box>

              {/* Indicador de asignación */}
              <LinearProgress
                variant="determinate"
                value={total ? (cantidad / total) * 100 : 0}
                aria-label={`Privilegios asignados en ${modulo}`}
                sx={{
                  height: 3,
                  bgcolor: 'action.hover',
                }}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
