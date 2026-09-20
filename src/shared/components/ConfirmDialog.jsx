import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

/**
 * Diálogo de confirmación reutilizable. Soporta:
 * - `loading`: deshabilita los botones y cambia el texto del botón principal.
 * - `errorText`: si viene informado, muestra un Alert de error con opción de
 *   reintentar (flujo alternativo "si ocurre un error, permite reintentar").
 * - `actions`: permite reemplazar los botones por defecto (por ejemplo, para
 *   ofrecer dos acciones distintas como "Inhabilitar" / "Eliminar").
 */
export default function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  loading = false,
  errorText = '',
  confirmColor = 'primary',
  actions,
  maxWidth = 'xs',
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ color: 'text.secondary', fontSize: 14, mb: errorText ? 2 : 0 }}>
          {description}
        </Box>
        {errorText && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {errorText}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        {actions ? (
          actions
        ) : (
          <>
            <Button onClick={onClose} disabled={loading} color="inherit">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} disabled={loading} variant="contained" color={confirmColor}>
              {loading ? 'Procesando...' : errorText ? 'Reintentar' : confirmText}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}