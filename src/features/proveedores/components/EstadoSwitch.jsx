import { Switch, Stack, Typography } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'

// Interruptor tipo "píldora": verde cuando el proveedor está activo, gris
// tostado cuando está inactivo. La perilla se desliza con una transición suave.
// Todos los colores salen del tema (claro y oscuro), no hay hex.
const PillSwitch = styled((props) => <Switch disableRipple {...props} />)(({ theme }) => {
  const on = theme.palette.success.main
  const off = alpha(theme.palette.text.secondary, 0.35)
  const thumb = theme.palette.common.white

  return {
    width: 42,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 2,
      color: thumb,
      transitionDuration: '250ms',
      '&.Mui-checked': {
        color: thumb,
        transform: 'translateX(18px)',
        '& + .MuiSwitch-track': { backgroundColor: on, opacity: 1, border: 0 },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        boxShadow: `0 0 0 4px ${alpha(on, 0.35)}`,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 20,
      height: 20,
      boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.3)}`,
    },
    '& .MuiSwitch-track': {
      borderRadius: 12,
      backgroundColor: off,
      opacity: 1,
      transition: theme.transitions.create('background-color', { duration: 250 }),
    },
  }
})

/**
 * Interruptor de estado del proveedor (Activo / Inactivo) con su etiqueta.
 * Es controlado: no cambia solo, el padre decide qué hacer en `onChange`
 * (en Proveedores abre el diálogo de confirmación).
 */
export function EstadoSwitch({ activo, onChange, nombre }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <PillSwitch
        checked={activo}
        onChange={onChange}
        inputProps={{ 'aria-label': `Cambiar estado de ${nombre}` }}
      />
      <Typography variant="subtitle2" sx={{ minWidth: 52, color: activo ? 'success.main' : 'text.secondary' }}>
        {activo ? 'Activo' : 'Inactivo'}
      </Typography>
    </Stack>
  )
}
