import { useState } from 'react'
import Typography from '@mui/material/Typography'
import ConfirmDialog from '@shared/components/ConfirmDialog'

export default function DeleteRoleDialog({ open, rol, onClose, onEliminar }) {
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  if (!rol) return null

  const handleClose = () => {
    if (loading) return
    setErrorText('')
    onClose()
  }

  const handleConfirm = async () => {
    setLoading(true)
    setErrorText('')
    try {
      await onEliminar(rol.id)
      setLoading(false)
      onClose()
    } catch (err) {
      setLoading(false)
      setErrorText(err.message || 'Ocurrió un error inesperado.')
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Eliminar rol"
      description={
        <>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: 1.5 }}>
            Esta acción no se puede deshacer
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            ¿Seguro que deseas eliminar el rol <strong>{rol.nombre}</strong>? Esta acción es
            permanente.
          </Typography>
        </>
      }
      confirmText="Eliminar rol"
      confirmColor="error"
      loading={loading}
      errorText={errorText}
      onConfirm={handleConfirm}
    />
  )
}