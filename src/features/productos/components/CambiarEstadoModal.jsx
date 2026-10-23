import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Button, Modal, Select } from '@shared/ui'
import FieldLabel from './formulario/FieldLabel'
import { ESTADOS_PRODUCTO } from './comunes/opcionesProducto'

const OPCIONES_ESTADO = ESTADOS_PRODUCTO.map((estado) => ({ value: estado, label: estado }))

// Modal para cambiar el estado de un producto desde el listado.
// Se monta solo cuando hay un producto seleccionado; la key reinicia el valor por producto.
export default function CambiarEstadoModal({ producto, onClose, onConfirmar }) {
  const [estado, setEstado] = useState(producto.estado)

  return (
    <Modal open onClose={onClose} title={`Cambiar estado ${producto.codigo}`} size="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FieldLabel required={false}>Estado</FieldLabel>
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