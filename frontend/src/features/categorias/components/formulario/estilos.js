// Estilos compartidos del formulario de categorías.
// Misma especificación visual que el formulario de productos (imagePreview).
export const imagePreviewSx = (theme) => ({
  width: 72,
  height: 72,
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.action.hover,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  overflow: 'hidden',
})
