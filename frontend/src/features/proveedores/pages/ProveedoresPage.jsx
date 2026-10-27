import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { Button, Pagination, SearchInput } from '@shared/ui'
import { useProveedores } from '../hooks/useProveedores'
import { ProveedoresKpis } from '../components/ProveedoresKpis'
import { ProveedoresTable } from '../components/ProveedoresTable'
import { FiltrosProveedoresPanel } from '../components/FiltrosProveedoresPanel'
import { FormularioProveedor } from '../components/FormularioProveedor'
import { DetalleProveedor } from '../components/DetalleProveedor'
import { EliminarProveedorDialog, CambiarEstadoProveedorDialog } from '../components/ProveedorDialogos'

export function ProveedoresPage() {
  const {
    loading,
    kpis,
    filtered,
    paginated,
    pageSize,
    vista,
    setVista,
    seleccionado,
    setSeleccionado,
    search,
    setSearch,
    page,
    setPage,
    sortKey,
    sortDir,
    handleSort,
    filtrosActivos,
    setFiltrosActivos,
    filtrosActivosCount,
    limpiarFiltros,
    handleGuardar,
    handleEliminar,
    handleCambiarEstado,
    modalEliminar,
    setModalEliminar,
    modalEstado,
    setModalEstado,
    proveedorAccion,
    setProveedorAccion,
  } = useProveedores()

  const [showFiltros, setShowFiltros] = useState(false)
  const hayFiltros = filtrosActivosCount > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ProveedoresKpis kpis={kpis} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ px: 2.5, py: 2 }}>
          <Typography variant="h6" sx={{ mr: 'auto' }}>
            Registro de proveedores
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
            <SearchInput
              placeholder="Buscar empresa, NIT o código…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <Button
              size="toolbar"
              leftIcon={<IconPlus size={13} />}
              onClick={() => {
                setSeleccionado(null)
                setVista('crear')
              }}
            >
              Nuevo proveedor
            </Button>
            <Button
              variant={hayFiltros ? 'primary' : 'secondary'}
              size="toolbar"
              leftIcon={<IconFilter size={13} />}
              onClick={() => setShowFiltros((v) => !v)}
            >
              Filtrar
              {hayFiltros && (
                <Box
                  component="span"
                  sx={{
                    ml: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 16,
                    width: 16,
                    borderRadius: '50%',
                    typography: 'overline',
                    bgcolor: (t) => alpha(t.palette.common.white, 0.3),
                    color: 'inherit',
                  }}
                >
                  {filtrosActivosCount}
                </Box>
              )}
            </Button>
          </Box>
        </Stack>

        <Divider />

        {showFiltros && (
          <FiltrosProveedoresPanel
            filtrosActivos={filtrosActivos}
            onChange={(nuevo) => {
              setFiltrosActivos(nuevo)
              setPage(1)
            }}
            onLimpiar={limpiarFiltros}
          />
        )}

        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.dim' }}>
              Cargando proveedores…
            </Typography>
          </Box>
        ) : (
          <ProveedoresTable
            rows={paginated}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onVer={(r) => {
              setSeleccionado(r)
              setVista('detalle')
            }}
            onEditar={(r) => {
              setSeleccionado(r)
              setVista('editar')
            }}
            onCambiarEstado={(r) => {
              setProveedorAccion(r)
              setModalEstado(true)
            }}
            onEliminar={(r) => {
              setProveedorAccion(r)
              setModalEliminar(true)
            }}
          />
        )}

        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </Box>
      </Box>

      <FormularioProveedor
        open={vista === 'crear' || vista === 'editar'}
        modo={vista === 'editar' ? 'editar' : 'crear'}
        proveedor={seleccionado}
        onGuardar={handleGuardar}
        onCancelar={() => setVista('lista')}
      />

      <DetalleProveedor
        open={vista === 'detalle'}
        proveedor={seleccionado}
        onEditar={() => setVista('editar')}
        onCerrar={() => setVista('lista')}
      />

      <EliminarProveedorDialog
        open={modalEliminar}
        proveedor={proveedorAccion}
        onClose={() => setModalEliminar(false)}
        onConfirmar={handleEliminar}
      />

      <CambiarEstadoProveedorDialog
        open={modalEstado}
        proveedor={proveedorAccion}
        onClose={() => setModalEstado(false)}
        onCambiar={handleCambiarEstado}
      />
    </Box>
  )
}

export default ProveedoresPage
