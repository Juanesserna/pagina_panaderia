import { useState } from 'react'
import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { IconFilter, IconX } from '@tabler/icons-react'
import { Button } from '@shared/ui'
import CampoFiltro from './filtros/CampoFiltro'
import {
  TIPOS_CATEGORIA,
  ESTADOS_CATEGORIA,
  FILTRO_TODOS_TIPOS,
  FILTRO_TODAS_ESTADOS,
} from './comunes/opcionesCategoria'

const aOpciones = (lista) => lista.map((valor) => ({ value: valor, label: valor }))

const OPCIONES_TIPO = [{ value: FILTRO_TODOS_TIPOS, label: FILTRO_TODOS_TIPOS }, ...aOpciones(TIPOS_CATEGORIA)]
const OPCIONES_ESTADO = [{ value: FILTRO_TODAS_ESTADOS, label: FILTRO_TODAS_ESTADOS }, ...aOpciones(ESTADOS_CATEGORIA)]

export default function FiltrosCategoriasDrawer({ open, onClose, filtros, onApply, onClear }) {
  const [tipo, setTipo] = useState(filtros?.tipo ?? FILTRO_TODOS_TIPOS)
  const [estado, setEstado] = useState(filtros?.estado ?? FILTRO_TODAS_ESTADOS)

  const handleApply = () => {
    onApply({ tipo, estado })
  }

  const handleClear = () => {
    setTipo(FILTRO_TODOS_TIPOS)
    setEstado(FILTRO_TODAS_ESTADOS)
    onClear()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 360,
          maxWidth: '100vw',
          height: '100%',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconFilter size={20} />
            <Typography variant="h5" component="p">
              Filtros
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar filtros" sx={{ color: 'text.secondary' }}>
            <IconX size={20} />
          </IconButton>
        </Box>

        <Divider />

        <Stack spacing={2.5} sx={{ px: 3, py: 3 }}>
          <CampoFiltro
            etiqueta="TIPO"
            opciones={OPCIONES_TIPO}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <CampoFiltro
            etiqueta="ESTADO"
            opciones={OPCIONES_ESTADO}
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Stack spacing={1.5} sx={{ px: 3, pt: 2, pb: 3 }}>
          <Button fullWidth onClick={handleApply}>
            Aplicar filtros
          </Button>
          <Button fullWidth variant="secondary" onClick={handleClear}>
            Limpiar filtros
          </Button>
          <Button fullWidth variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}