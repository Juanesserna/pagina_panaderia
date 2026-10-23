import { Box, Card } from '@mui/material'
import { Pagination } from '@shared/ui'
import CatalogoCategorias from '../components/CatalogoCategorias'
import CategoriasTable from '../components/CategoriasTable'
import ResumenCategorias from '../components/ResumenCategorias'
import ModalesCategorias from '../components/ModalesCategorias'
import { useCategorias } from '../hooks/useCategorias'
import { useGestionCategorias } from '../hooks/useGestionCategorias'

export default function CategoriasPage() {
  const {
    categorias,
    allCategorias,
    searchTerm,
    handleSearch,
    filtros,
    aplicarFiltros,
    paginaActual,
    totalRegistros,
    porPagina,
    handlePageChange,
    crear,
    editar,
    eliminar,
  } = useCategorias()

  const gestion = useGestionCategorias({
    allCategorias,
    crear,
    editar,
    eliminar,
  })

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
      <ResumenCategorias categorias={allCategorias} />

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
          onNuevoClick={gestion.abrirNueva}
          filtros={filtros}
          onFiltrosChange={aplicarFiltros}
        />

        <CategoriasTable
          categorias={categorias}
          onCambiarEstado={gestion.abrirCambioEstado}
          onEditar={gestion.abrirEditar}
          onEliminar={gestion.abrirEliminar}
        />

        <Pagination
          page={paginaActual}
          total={totalRegistros}
          pageSize={porPagina}
          onPageChange={handlePageChange}
        />
      </Card>

      <ModalesCategorias gestion={gestion} />
    </Box>
  )
}
