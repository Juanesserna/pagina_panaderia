import { Button as MuiButton } from '@mui/material'
import { CONTROL_HEIGHT } from './tokens'

// Tamaños permitidos. 'toolbar' = botones junto al buscador (mismo alto que Input size="sm").
const sizeStyles = {
  sm: { fontSize: '0.75rem', px: 1.75, py: 0.7 },
  md: { fontSize: '0.8125rem', px: 2.5, py: 1 },
  toolbar: { fontSize: '0.75rem', px: 1.5, py: 0, height: CONTROL_HEIGHT, borderRadius: 1 },
}

/**
 * Botón del panel administrativo.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'toolbar'  (toolbar: botones de la barra con buscador; alto estándar)
 * fullWidth: ocupa todo el ancho disponible.
 * sx: estilos opcionales para sobrescribir en una instancia puntual.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  disabled,
  onClick,
  title,
  children,
  type = 'button',
  fullWidth,
  sx,
}) {
  const sxByVariant = {
    primary: {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      border: 'none',
      '&:hover': { bgcolor: 'primary.dark' },
    },
    secondary: {
      bgcolor: 'background.alt',
      color: 'text.primary',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': { bgcolor: 'background.alt', opacity: 0.85 },
    },
    ghost: {
      bgcolor: 'transparent',
      color: 'text.secondary',
      border: 'none',
      '&:hover': { bgcolor: 'action.hover' },
    },
    danger: {
      bgcolor: 'error.main',
      color: 'common.white',
      border: 'none',
      '&:hover': { bgcolor: 'error.dark' },
    },
  }

  return (
    <MuiButton
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      startIcon={leftIcon}
      fullWidth={fullWidth}
      sx={{
        ...sxByVariant[variant],
        textTransform: 'none',
        fontWeight: 'fontWeightSemiBold',
        borderRadius: 1.5,
        minWidth: 'auto',
        boxShadow: 'none',
        '&:disabled': { opacity: 0.4, color: 'inherit' },
        ...(sizeStyles[size] ?? sizeStyles.md),
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  )
}
