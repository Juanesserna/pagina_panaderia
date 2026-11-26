import { Box, Stack, Card, Alert, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
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
import CambiarEstadoModal from '../components/CambiarEstadoModal'
import { useProductos } from '../hooks/useProductos'

export default function ProductosPage() {
  const navigate = useNavigate()
  const {
    productos,
    cargando,
    error,
    filtros,
    setFiltros,
    paginacion,
    conteos,
    crearProducto,
    editarProducto,
    eliminarProducto,
    cambiarEstado,
  } = useProductos()
  const [nuevoProductoModal, setNuevoProductoModal] = useState(false)
  const [editarProductoModal, setEditarProductoModal] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [detalleProductoModal, setDetalleProductoModal] = useState(false)
  const [productoDetalle, setProductoDetalle] = useState(null)
  const [eliminarProductoModal, setEliminarProductoModal] = useState(false)
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [productoEstado, setProductoEstado] = useState(null)
  const [errorServidor, setErrorServidor] = useState(null)
  const temporizadorBusqueda = useRef(null)

  const handleNuevoProducto = () => {
    setErrorServidor(null)
    setNuevoProductoModal(true)
  }

  const handleEditarProducto = (producto) => {
    setErrorServidor(null)
    setProductoEditar(producto)
    setEditarProductoModal(true)
  }

  const handleVerDetalle = (producto) => {
    setProductoDetalle(producto)
    setDetalleProductoModal(true)
  }

  // Los errores del servidor los muestra el propio modal (su catch los atrapa)
  const handleGuardarProducto = async (datos) => {
    const productoCreado = await crearProducto(datos)
    setNuevoProductoModal(false)
    navigate(ROUTES.AGREGAR_RECETA, {
      state: { productoId: productoCreado.id, producto: productoCreado },
    })
  }

  const handleGuardarEdicion = async (datos) => {
    if (!productoEditar?.id) return
    await editarProducto(productoEditar.id, datos)
    setEditarProductoModal(false)
    setProductoEditar(null)
  }

  const handleEliminarProducto = (producto) => {
    setProductoAEliminar(producto)
    setEliminarProductoModal(true)
  }

  const handleConfirmarEliminar = async () => {
    await eliminarProducto(productoAEliminar.id)
    setEliminarProductoModal(false)
    setProductoAEliminar(null)
  }

  const handleCambiarEstado = (producto) => {
    setProductoEstado(producto)
  }

  const handleConfirmarEstado = async (estado) => {
    const producto = productoEstado
    setProductoEstado(null)
    try {
      await cambiarEstado(producto.id, estado)
    } catch (error) {
      setErrorServidor(error.message || 'Error al cambiar el estado')
    }
  }

  const handleBuscar = (e) => {
    const valor = e.target.value.trim()
    clearTimeout(temporizadorBusqueda.current)
    temporizadorBusqueda.current = setTimeout(() => setFiltros({ buscar: valor }), 500)
  }

  const handleFiltroCategoriaChange = (valor) => {
    setFiltros({ categoria: valor })
  }

  const handleFiltroEstadoChange = (valor) => {
    setFiltros({ estado: valor })
  }

  const handleFiltroTipoChange = (valor) => {
    setFiltros({ tipo: valor })
  }

  const handleFiltroVendibleChange = (valor) => {
    setFiltros({ esVendible: valor })
  }

  const limpiarErrorServidor = () => {
    setErrorServidor(null)
  }

  useEffect(() => {
    return () => clearTimeout(temporizadorBusqueda.current)
  }, [])

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
      {errorServidor && (
        <Alert severity="error" onClose={limpiarErrorServidor}>
          {errorServidor}
        </Alert>
      )}
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Stack direction="row" spacing={2}>
        <StatsCard
          label="PRODUCTOS ACTIVOS"
          value={conteos.activos}
          icon={<IconBread size={20} />}
          iconBgColor="success"
        />
        <StatsCard
          label="AGOTADOS"
          value={conteos.agotados}
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
        <CatalogoProductos
          onNuevoClick={handleNuevoProducto}
          onBuscar={handleBuscar}
          onFiltroCategoriaChange={handleFiltroCategoriaChange}
          onFiltroEstadoChange={handleFiltroEstadoChange}
          onFiltroTipoChange={handleFiltroTipoChange}
          onFiltroVendibleChange={handleFiltroVendibleChange}
          filtroCategoria={filtros.categoria}
          filtroEstado={filtros.estado}
          filtroTipo={filtros.tipo}
          filtroVendible={filtros.esVendible}
        />
        {!cargando && !error && productos.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Sin productos encontrados
            </Typography>
          </Box>
        ) : (
          <ProductosTable
            productos={productos}
            onEdit={handleEditarProducto}
            onVer={handleVerDetalle}
            onEliminar={handleEliminarProducto}
            onCambiarEstado={handleCambiarEstado}
          />
        )}
        <PaginacionProductos
          paginaActual={paginacion.pagina}
          totalRegistros={paginacion.total}
          porPagina={filtros.limite}
          totalPaginas={paginacion.totalPaginas}
          onCambiarPagina={(pagina) => setFiltros({ pagina })}
        />
      </Card>

      <NuevoProductoModal
        open={nuevoProductoModal}
        onClose={() => setNuevoProductoModal(false)}
        onGuardar={handleGuardarProducto}
      />
      {/* El modal se monta solo cuando hay un producto seleccionado; la key reinicia el formulario por producto */}
      {productoEditar && (
        <EditarProductoModal
          key={productoEditar.id}
          open={editarProductoModal}
          onClose={() => {
            setEditarProductoModal(false)
            setProductoEditar(null)
          }}
          onGuardar={handleGuardarEdicion}
          producto={productoEditar}
        />
      )}
      <DetalleProductoModal
        open={detalleProductoModal}
        onClose={() => {
          setDetalleProductoModal(false)
          setProductoDetalle(null)
        }}
        producto={productoDetalle}
      />
      {productoAEliminar && (
        <EliminarProductoModal
          key={productoAEliminar.id}
          open={eliminarProductoModal}
          onClose={() => {
            setEliminarProductoModal(false)
            setProductoAEliminar(null)
          }}
          onConfirm={handleConfirmarEliminar}
          nombreProducto={productoAEliminar.nombre}
        />
      )}
      {productoEstado && (
        <CambiarEstadoModal
          key={productoEstado.id}
          producto={productoEstado}
          onClose={() => setProductoEstado(null)}
          onConfirmar={handleConfirmarEstado}
        />
      )}
    </Box>
  )
}
