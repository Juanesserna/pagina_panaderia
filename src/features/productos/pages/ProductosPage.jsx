import { Box, Stack, Card } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBox, IconBread } from '@tabler/icons-react'
import { ROUTES } from '@app/router/routes'
import StatsCard from '@shared/components/StatsCard'
import CatalogoProductos from '../components/CatalogoProductos'
import ProductosTable from '../components/ProductosTable'
import PaginacionProductos from '../components/PaginacionProductos'
import NuevoProductoModal from '../components/NuevoProductoModal'
import EditarProductoModal from '../components/EditarProductoModal'
import DetalleProductoModal from '../components/DetalleProductoModal'
import EliminarProductoModal from '../components/EliminarProductoModal'
import { useProductos } from '../hooks/useProductos'

export default function ProductosPage() {
  const navigate = useNavigate()
  const { productos, crearProducto, editarProducto, eliminarProducto } = useProductos()
  const [nuevoProductoModal, setNuevoProductoModal] = useState(false)
  const [editarProductoModal, setEditarProductoModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [detalleProductoModal, setDetalleProductoModal] = useState(false)
  const [productoDetalle, setProductoDetalle] = useState(null)
  const [eliminarProductoModal, setEliminarProductoModal] = useState(false)
  const [productoAEliminar, setProductoAEliminar] = useState(null)

  const handleNuevoProducto = () => {
    setNuevoProductoModal(true)
  }

  const handleEditarProducto = (producto) => {
    setProductoEditar(producto)
    setEditarProductoModal(true)
  }

  const handleVerDetalle = (producto) => {
    setProductoDetalle(producto)
    setDetalleProductoModal(true)
  }

  const handleGuardarProducto = (datos) => {
    const producto = crearProducto(datos)
    setNuevoProductoModal(false)
    navigate(ROUTES.AGREGAR_RECETA, { state: { producto } })
  }

  const handleGuardarEdicion = (datos) => {
    editarProducto(productoEditar.id, datos)
    setEditarProductoModal(false)
    setProductoEditar(null)
  }

  const handleEliminarProducto = (producto) => {
    setProductoAEliminar(producto)
    setEliminarProductoModal(true)
  }

  const handleConfirmarEliminar = () => {
    eliminarProducto(productoAEliminar.id)
    setEliminarProductoModal(false)
    setProductoAEliminar(null)
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
      <Stack direction="row" spacing={2}>
        <StatsCard
          label="PRODUCTOS ACTIVOS"
          value={productos.filter((p) => p.estado === 'Activo').length}
          icon={<IconBread size={20} />}
          iconBgColor="success"
        />
        <StatsCard
          label="AGOTADOS"
          value={productos.filter((p) => p.estado === 'Agotado').length}
          icon={<IconBox size={20} />}
          iconBgColor="error"
        />
      </Stack>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <CatalogoProductos onNuevoClick={handleNuevoProducto} />
        <ProductosTable
          productos={productos}
          onEdit={handleEditarProducto}
          onVer={handleVerDetalle}
          onEliminar={handleEliminarProducto}
        />
        <PaginacionProductos totalRegistros={6} />
      </Card>

      <NuevoProductoModal
        open={nuevoProductoModal}
        onClose={() => setNuevoProductoModal(false)}
        onGuardar={handleGuardarProducto}
      />
      <EditarProductoModal
        open={editarProductoModal}
        onClose={() => {
          setEditarProductoModal(false)
          setProductoEditar(null)
        }}
        onGuardar={handleGuardarEdicion}
        producto={productoEditar}
      />
      <DetalleProductoModal
        open={detalleProductoModal}
        onClose={() => {
          setDetalleProductoModal(false)
          setProductoDetalle(null)
        }}
        producto={productoDetalle}
      />
      <EliminarProductoModal
        open={eliminarProductoModal}
        onClose={() => {
          setEliminarProductoModal(false)
          setProductoAEliminar(null)
        }}
        onConfirm={handleConfirmarEliminar}
        nombreProducto={productoAEliminar?.nombre}
      />
    </Box>
  )
}
