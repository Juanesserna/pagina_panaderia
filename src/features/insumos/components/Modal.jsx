import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material'
import { IconX } from '@tabler/icons-react'

const maxWidthBySize = { sm: 'xs', md: 'sm', lg: 'md' }

/**
 * Modal genérico del panel administrativo.
 * size: 'sm' | 'md' | 'lg'
 */
export function Modal({ open, onClose, title, size = 'md', children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidthBySize[size] || 'sm'}
      fullWidth
      PaperProps={{ sx: { borderRadius: 2.5, bgcolor: 'background.paper' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}>
        <Box component="span" sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <IconX size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>{children}</DialogContent>
    </Dialog>
  )
}
