import { Box, Typography, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconLeaf, IconBox } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
import { ROUTES } from '@app/router/routes'
import ResumenCard from '../components/ResumenCard'
import CatalogoProductos from '../components/CatalogoProductos'
import ProductosTable from '../components/ProductosTable'
import PaginacionProductos from '../components/PaginacionProductos'
import NuevoProductoModal from '../components/NuevoProductoModal'
import EditarProductoModal from '../components/EditarProductoModal'
import DetalleProductoModal from '../components/DetalleProductoModal'
import { resumenStats } from '../services/productos.service'

export default function ProductosPage() {
  const navigate = useNavigate()
  const [nuevoProductoModal, setNuevoProductoModal] = useState(false)
  const [editarProductoModal, setEditarProductoModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [detalleProductoModal, setDetalleProductoModal] = useState(false)
  const [productoDetalle, setProductoDetalle] = useState(null)

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
    const producto = {
      ...datos,
      id: datos.id ?? Date.now(),
      codigo: datos.codigo ?? `PR-${Math.floor(Math.random() * 900) + 100}`,
    }
    setNuevoProductoModal(false)
    navigate(ROUTES.AGREGAR_RECETA, { state: { producto } })
  }

  const handleGuardarEdicion = (datos) => {
    console.log('Guardar edición:', datos)
    setEditarProductoModal(false)
    setProductoEditar(null)
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
        Productos
      </Typography>

      <Stack direction="row" spacing={2}>
        <ResumenCard
          titulo="PRODUCTOS ACTIVOS"
          valor={resumenStats.productosActivos}
          variacion={resumenStats.variacionActivos}
          icono={<IconLeaf size={20} />}
          iconoColor="success"
        />
        <ResumenCard
          titulo="AGOTADOS"
          valor={resumenStats.agotados}
          variacion={resumenStats.variacionAgotados}
          icono={<IconBox size={20} />}
          iconoColor="error"
        />
      </Stack>

      <CatalogoProductos onNuevoClick={handleNuevoProducto} />

      <ProductosTable onEdit={handleEditarProducto} onVer={handleVerDetalle} />

      <PaginacionProductos totalRegistros={6} />

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
    </Box>
  )
}
