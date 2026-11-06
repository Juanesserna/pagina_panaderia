import { useState } from 'react'
import {
  Box,
  Typography,
  Divider,
  useTheme,
} from '@mui/material'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
// Botón y buscador estándar del panel
import { Button, Select, SearchInput } from '@shared/ui'
// Categorías del módulo Categorías (estado compartido vía CategoriasProvider)
import { useCategorias } from '@features/categorias'
// Opciones de estado de producto
import { ESTADOS_PRODUCTO } from './comunes/opcionesProducto'

// Valor que representa "sin filtro" en los selectores del catálogo
const TODAS = 'todas'

export default function CatalogoProductos({
  onBuscar,
  onNuevoClick,
  onFiltrarClick,
  onFiltroCategoriaChange,
  onFiltroEstadoChange,
  filtroCategoria = '',
  filtroEstado = '',
}) {
  const theme = useTheme()
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  // Lee todas las categorías del contexto compartido
  const { allCategorias } = useCategorias()

  // Filtra solo categorías activas de tipo Producto o Ambos
  const categoriasFiltradas = allCategorias.filter(
    (c) => c.estado === 'Activa' && (c.tipo === 'Producto' || c.tipo === 'Ambos')
  )

  const handleFiltrarClick = () => {
    setMostrarFiltros((prev) => !prev)
    if (onFiltrarClick) onFiltrarClick()
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
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Catálogo de productos
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchInput placeholder="Buscar producto o código..." onChange={onBuscar} />

          <Button size="toolbar" leftIcon={<IconPlus size={16} />} onClick={onNuevoClick}>
            Nuevo producto
          </Button>

          <Button variant="secondary" size="toolbar" leftIcon={<IconFilter size={16} />} onClick={handleFiltrarClick}>
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
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 220 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              Categoría
            </Typography>
            <Select
              value={filtroCategoria || TODAS}
              onChange={(e) => onFiltroCategoriaChange?.(e.target.value === TODAS ? '' : e.target.value)}
              options={[{ value: TODAS, label: 'Todas las categorías' }, ...categoriasFiltradas.map((c) => ({ value: c.nombre, label: c.nombre }))]}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 200 }}>
            <Typography
              component="label"
              sx={{
                fontFamily: fonts.sans,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: theme.palette.text.secondary,
              }}
            >
              Estado
            </Typography>
            <Select
              value={filtroEstado || TODAS}
              onChange={(e) => onFiltroEstadoChange?.(e.target.value === TODAS ? '' : e.target.value)}
              options={[{ value: TODAS, label: 'Todos los estados' }, ...ESTADOS_PRODUCTO.map((s) => ({ value: s, label: s }))]}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}