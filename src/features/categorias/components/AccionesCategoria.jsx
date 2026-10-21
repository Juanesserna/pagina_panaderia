import { IconButton, Stack } from '@mui/material'
import { IconPencil, IconTrash } from '@tabler/icons-react'

const BOTON_SX = { color: 'text.secondary', width: 28, height: 28 }

export default function AccionesCategoria({ categoria, onEditar, onEliminar }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.25}>
      <IconButton size="small" onClick={() => onEditar(categoria.id)} sx={BOTON_SX} title="Editar">
        <IconPencil size={15} />
      </IconButton>
      <IconButton size="small" onClick={() => onEliminar(categoria.id)} sx={BOTON_SX} title="Eliminar">
        <IconTrash size={15} />
      </IconButton>
    </Stack>
  )
}