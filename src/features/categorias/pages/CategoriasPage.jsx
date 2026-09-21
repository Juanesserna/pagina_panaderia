import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { IconStack, IconTag, IconCheck, IconX } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'
import CatalogoCategorias from '../components/CatalogoCategorias'
import CategoriasTable from '../components/CategoriasTable'
import PaginacionCategorias from '../components/PaginacionCategorias'
import NuevaCategoriaModal from '../components/NuevaCategoriaModal'
import EditarCategoriaModal from '../components/EditarCategoriaModal'
import EliminarCategoriaDialog from '../components/EliminarCategoriaDialog'
import StatsCard from '@shared/components/StatsCard'
import { resumenStats } from '../services/categorias.service'
import { useCategorias } from '../hooks/useCategorias'

export default function CategoriasPage() {
  const navigate = useNavigate()
  const {
    categorias,
    allCategorias,
    searchTerm,
    handleSearch,
    paginaActual,
    totalPaginas,
    totalRegistros,
    porPagina,
    handlePageChange,
    toggleEstado,
    eliminarCategoria,
    editarCategoria,
  } = useCategorias()

  const totalCategorias = allCategorias.length
  const categoriasProducto = allCategorias.filter((c) => c.tipo === 'Producto' || c.tipo === 'Ambos').length
  const activas = allCategorias.filter((c) => c.estado === 'Activa').length
  const inactivas = allCategorias.filter((c) => c.estado === 'Inactiva').length

  const [nuevaCategoriaModal, setNuevaCategoriaModal] = useState(false)
  const [editarCategoriaModal, setEditarCategoriaModal] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)

  const handleNuevoClick = () => {
    setNuevaCategoriaModal(true)
  }

  const handleNuevaCategoriaSubmit = (datos) => {
    console.log('Nueva categoría:', datos)
  }

  const handleFiltrarClick = () => {
    console.log('Filtrar click')
  }

  const handleToggleEstado = (id) => {
    toggleEstado(id)
  }

  const handleEditar = (id) => {
    const categoria = allCategorias.find((c) => c.id === id)
    setCategoriaSeleccionada(categoria)
    setEditarCategoriaModal(true)
  }

  const handleEditarCategoriaSubmit = (id, datosActualizados) => {
    editarCategoria(id, datosActualizados)
    setEditarCategoriaModal(false)
    setCategoriaSeleccionada(null)
  }

  const handleEliminar = (id) => {
    const categoria = allCategorias.find((c) => c.id === id)
    setCategoriaAEliminar(categoria)
    setEliminarDialogOpen(true)
  }

  const handleConfirmarEliminar = () => {
    eliminarCategoria(categoriaAEliminar.id)
    setEliminarDialogOpen(false)
    setCategoriaAEliminar(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'background.paper',
        minHeight: '100vh',
        margin: '-16px',
        padding: '16px',
        width: 'calc(100% + 32px)',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: fonts.sans,
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        Categorías
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
        <StatsCard
          label="TOTAL CATEGORÍAS"
          value={totalCategorias}
          icon={<IconStack size={20} />}
          iconBgColor="warning"
        />
        <StatsCard
          label="CATEGORÍAS DE PRODUCTO"
          value={categoriasProducto}
          icon={<IconTag size={20} />}
          iconBgColor="warning"
        />
        <StatsCard
          label="ACTIVAS"
          value={activas}
          icon={<IconCheck size={20} />}
          iconBgColor="success"
        />
        <StatsCard
          label="INACTIVAS"
          value={inactivas}
          icon={<IconX size={20} />}
          iconBgColor="error"
        />
      </Stack>

      <CatalogoCategorias
        onBuscar={handleSearch}
        onNuevoClick={handleNuevoClick}
        onFiltrarClick={handleFiltrarClick}
      />

      <CategoriasTable
        categorias={categorias}
        onToggleEstado={handleToggleEstado}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      <PaginacionCategorias
        paginaActual={paginaActual}
        totalRegistros={totalRegistros}
        porPagina={porPagina}
        onPageChange={handlePageChange}
      />

      <NuevaCategoriaModal
        open={nuevaCategoriaModal}
        onClose={() => setNuevaCategoriaModal(false)}
        onSubmit={handleNuevaCategoriaSubmit}
      />

      <EditarCategoriaModal
        open={editarCategoriaModal}
        onClose={() => {
          setEditarCategoriaModal(false)
          setCategoriaSeleccionada(null)
        }}
        onSubmit={handleEditarCategoriaSubmit}
        categoria={categoriaSeleccionada}
      />

      <EliminarCategoriaDialog
        open={eliminarDialogOpen}
        onClose={() => {
          setEliminarDialogOpen(false)
          setCategoriaAEliminar(null)
        }}
        onConfirm={handleConfirmarEliminar}
        nombreCategoria={categoriaAEliminar?.nombre}
      />
    </Box>
  )
}