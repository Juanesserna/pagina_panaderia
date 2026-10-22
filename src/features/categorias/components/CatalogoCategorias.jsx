import { useState } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { Button, SearchInput } from '@shared/ui'
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

export default function CatalogoCategorias({
  onBuscar,
  onNuevoClick,
  valorBusqueda = '',
  filtros,
  onFiltrosChange,
}) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const handleFiltrarClick = () => {
    setMostrarFiltros((prev) => !prev)
  }

  // Aplica el filtro al elegir una opción, conservando el otro filtro
  const cambiarFiltro = (campo) => (e) => {
    onFiltrosChange?.({ ...filtros, [campo]: e.target.value })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="p">
          Categorías
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchInput
            placeholder="Buscar categoría..."
            value={valorBusqueda}
            onChange={onBuscar}
          />
          <Button size="toolbar" leftIcon={<IconPlus size={16} />} onClick={onNuevoClick}>
            Nueva categoría
          </Button>
          <Button
            variant="secondary"
            size="toolbar"
            leftIcon={<IconFilter size={16} />}
            onClick={handleFiltrarClick}
          >
            Filtrar
          </Button>
        </Box>
      </Box>
      <Divider />

      {mostrarFiltros && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            backgroundColor: 'background.default',
          }}
        >
          <CampoFiltro
            etiqueta="Tipo"
            opciones={OPCIONES_TIPO}
            value={filtros?.tipo ?? FILTRO_TODOS_TIPOS}
            onChange={cambiarFiltro('tipo')}
            minWidth={220}
          />
          <CampoFiltro
            etiqueta="Estado"
            opciones={OPCIONES_ESTADO}
            value={filtros?.estado ?? FILTRO_TODAS_ESTADOS}
            onChange={cambiarFiltro('estado')}
            minWidth={200}
          />
        </Box>
      )}
    </Box>
  )
}
