import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { MODULOS } from '../services/rolesService'
import ModulosGrid from './ModulosGrid'

export default function RoleDetailDialog({ open, rol, onClose }) {
  if (!rol) return null

  const seleccionados = rol.modulos?.length ?? 0

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary' }}>
            {rol.nombre}
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{rol.codigo}</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: 13.5 }}>
            <TuneOutlinedIcon fontSize="small" />
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>Estado</Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>
            {rol.estado}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mb: 1.2 }}>
          Módulos que ven por defecto los usuarios con este rol ({seleccionados} de {MODULOS.length}):
        </Typography>
        <ModulosGrid value={rol.modulos ?? []} />
      </DialogContent>
    </Dialog>
  )
}