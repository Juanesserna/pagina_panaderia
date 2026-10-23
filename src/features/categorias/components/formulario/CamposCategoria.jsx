import { Box, Stack, Typography } from '@mui/material'
import { Input, Select } from '@shared/ui'
import { TIPOS_CATEGORIA, ESTADOS_CATEGORIA } from '../comunes/opcionesCategoria'

const aOpciones = (lista) => lista.map((valor) => ({ value: valor, label: valor }))
const OPCIONES_TIPO = aOpciones(TIPOS_CATEGORIA)
const OPCIONES_ESTADO = aOpciones(ESTADOS_CATEGORIA)

function Campo({ etiqueta, children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography component="label" variant="overline" color="text.secondary">
        {etiqueta}
      </Typography>
      {children}
    </Box>
  )
}

export default function CamposCategoria({ valores, onCambio }) {
  return (
    <Stack spacing={3}>
      <Campo etiqueta="NOMBRE">
        <Input
          placeholder="ej. Repostería"
          value={valores.nombre}
          onChange={(e) => onCambio('nombre', e.target.value)}
        />
      </Campo>
      <Campo etiqueta="TIPO DE CATEGORÍA">
        <Select
          options={OPCIONES_TIPO}
          value={valores.tipo}
          onChange={(e) => onCambio('tipo', e.target.value)}
        />
      </Campo>
      <Campo etiqueta="ESTADO">
        <Select
          options={OPCIONES_ESTADO}
          value={valores.estado}
          onChange={(e) => onCambio('estado', e.target.value)}
        />
      </Campo>
    </Stack>
  )
}