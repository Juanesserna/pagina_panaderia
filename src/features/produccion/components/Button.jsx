import { Button as MuiButton } from '@mui/material'

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  disabled,
  onClick,
  title,
  children,
  type = 'button',
  fullWidth,   // 👈 agregado
  sx,          // 👈 agregado
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
      color: '#fff',
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
        fontWeight: 600,
        borderRadius: 1.5,
        fontSize: size === 'sm' ? 13 : 14,
        px: size === 'sm' ? 1.75 : 2.5,
        py: size === 'sm' ? 0.7 : 1,
        minWidth: 'auto',
        boxShadow: 'none',
        '&:disabled': { opacity: 0.4, color: 'inherit' },
        ...sx,   // 👈 se mergea al final, mismo patrón que Ventas
      }}
    >
      {children}
    </MuiButton>
  )
}