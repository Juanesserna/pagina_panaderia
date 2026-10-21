import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { IconPlus, IconFilter } from '@tabler/icons-react'
import { Button, Pagination, SearchInput } from '@shared/ui'
import { useInsumos } from '../hooks/useInsumos'
import { InsumosKpis } from '../components/InsumosKpis'
import { InsumosTable } from '../components/InsumosTable'
import { FiltrosInsumosPanel } from '../components/FiltrosInsumosPanel'
import { FormularioInsumo } from '../components/FormularioInsumo'
import { DetalleInsumo } from '../components/DetalleInsumo'
import { EliminarInsumoDialog, CambiarEstadoInsumoDialog } from '../components/InsumoDialogs'

export function InsumosPage() {
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
    insumoAccion,
    setInsumoAccion,
  } = useInsumos()

  const [showFiltros, setShowFiltros] = useState(false)
  const hayFiltros = filtrosActivosCount > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <InsumosKpis kpis={kpis} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ px: 2.5, py: 2 }}>
          <Typography variant="h6" sx={{ mr: 'auto' }}>
            Registro de insumos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25 }}>
            <SearchInput
              placeholder="Buscar por nombre o código…"
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
              Nuevo insumo
            </Button>
            <Button
              variant={showFiltros || hayFiltros ? 'primary' : 'secondary'}
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
          <FiltrosInsumosPanel
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
              Cargando insumos…
            </Typography>
          </Box>
        ) : (
          <InsumosTable
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
              setInsumoAccion(r)
              setModalEstado(true)
            }}
            onEliminar={(r) => {
              setInsumoAccion(r)
              setModalEliminar(true)
            }}
          />
        )}

        <Box sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </Box>
      </Box>

      <FormularioInsumo
        open={vista === 'crear' || vista === 'editar'}
        modo={vista === 'editar' ? 'editar' : 'crear'}
        insumo={seleccionado}
        onGuardar={handleGuardar}
        onCancelar={() => setVista('lista')}
      />

      <DetalleInsumo
        open={vista === 'detalle'}
        insumo={seleccionado}
        onEditar={() => setVista('editar')}
        onCerrar={() => setVista('lista')}
      />

      <EliminarInsumoDialog
        open={modalEliminar}
        insumo={insumoAccion}
        onClose={() => setModalEliminar(false)}
        onConfirmar={handleEliminar}
      />

      <CambiarEstadoInsumoDialog
        open={modalEstado}
        insumo={insumoAccion}
        onClose={() => setModalEstado(false)}
        onCambiar={handleCambiarEstado}
      />
    </Box>
  )
}

export default InsumosPage
