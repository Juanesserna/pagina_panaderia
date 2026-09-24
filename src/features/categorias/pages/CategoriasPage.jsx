import { useState } from 'react'
import { Box, Stack, Card } from '@mui/material'
import { IconStack, IconTag, IconCheck, IconX } from '@tabler/icons-react'
import CatalogoCategorias from '../components/CatalogoCategorias'
import CategoriasTable from '../components/CategoriasTable'
import PaginacionCategorias from '../components/PaginacionCategorias'
import NuevaCategoriaModal from '../components/NuevaCategoriaModal'
import EditarCategoriaModal from '../components/EditarCategoriaModal'
import EliminarCategoriaDialog from '../components/EliminarCategoriaDialog'
import FiltrosCategoriasDrawer from '../components/FiltrosCategoriasDrawer'
import StatsCard from '@shared/components/StatsCard'
import { useCategorias } from '../hooks/useCategorias'

export default function CategoriasPage() {
  const {
    categorias,
    allCategorias,
    searchTerm,
    handleSearch,
    filtros,
    aplicarFiltros,
    limpiarFiltros,
    paginaActual,
    totalRegistros,
    porPagina,
    handlePageChange,
    crear,
    editar,
    eliminar,
    cambiarEstado,
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
  const [filtrosDrawerOpen, setFiltrosDrawerOpen] = useState(false)

  const handleNuevoClick = () => {
    setNuevaCategoriaModal(true)
  }

  const handleNuevaCategoriaSubmit = (datos) => {
    crear(datos)
    setNuevaCategoriaModal(false)
  }

  const handleFiltrarClick = () => {
    setFiltrosDrawerOpen(true)
  }

  const handleApplyFiltros = (nuevosFiltros) => {
    aplicarFiltros(nuevosFiltros)
    setFiltrosDrawerOpen(false)
  }

  const handleLimpiarFiltros = () => {
    limpiarFiltros()
  }

  const handleToggleEstado = (id) => {
    cambiarEstado(id)
  }

  const handleEditar = (id) => {
    const categoria = allCategorias.find((c) => c.id === id)
    setCategoriaSeleccionada(categoria)
    setEditarCategoriaModal(true)
  }

  const handleEditarCategoriaSubmit = (id, datosActualizados) => {
    editar(id, datosActualizados)
    setEditarCategoriaModal(false)
    setCategoriaSeleccionada(null)
  }

  const handleEliminar = (id) => {
    const categoria = allCategorias.find((c) => c.id === id)
    setCategoriaAEliminar(categoria)
    setEliminarDialogOpen(true)
  }

  const handleConfirmarEliminar = () => {
    if (categoriaAEliminar) {
      eliminar(categoriaAEliminar.id)
    }
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

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <CatalogoCategorias
          valorBusqueda={searchTerm}
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
      </Card>

      <NuevaCategoriaModal
        open={nuevaCategoriaModal}
        onClose={() => setNuevaCategoriaModal(false)}
        onSubmit={handleNuevaCategoriaSubmit}
      />

      <EditarCategoriaModal
        key={categoriaSeleccionada?.id}
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

      <FiltrosCategoriasDrawer
        key={`${filtrosDrawerOpen}-${filtros.tipo}-${filtros.estado}`}
        open={filtrosDrawerOpen}
        onClose={() => setFiltrosDrawerOpen(false)}
        filtros={filtros}
        onApply={handleApplyFiltros}
        onClear={handleLimpiarFiltros}
      />
    </Box>
  )
}