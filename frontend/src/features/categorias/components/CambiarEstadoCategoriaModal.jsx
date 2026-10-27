import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button, Modal, Select } from '@shared/ui'
import { ESTADOS_CATEGORIA } from './comunes/opcionesCategoria'

const OPCIONES_ESTADO = ESTADOS_CATEGORIA.map((estado) => ({ value: estado, label: estado }))

// Modal para cambiar el estado de una categoría desde el listado.
// Se monta solo cuando hay una categoría seleccionada; la key reinicia el valor por categoría.
export default function CambiarEstadoCategoriaModal({ categoria, onClose, onConfirmar }) {
  const [estado, setEstado] = useState(categoria.estado)

  return (
    <Modal open onClose={onClose} title={`Cambiar estado ${categoria.nombre}`} size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography component="label" variant="overline" color="text.secondary">
            Estado
          </Typography>
          <Select
            options={OPCIONES_ESTADO}
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </Box>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => onConfirmar(estado)}>
            Guardar
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}