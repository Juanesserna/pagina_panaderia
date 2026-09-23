import { useState } from 'react'
import { Box, Stack, Typography, Badge } from '@mui/material'
import { IconSearch, IconPlus, IconFilter } from '@tabler/icons-react'
import { Input, Button, Pagination } from '@shared/components'

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

  const desde = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const hasta = Math.min(page * pageSize, filtered.length)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1.5 }}>
      <ProveedoresKpis kpis={kpis} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
            Registro de proveedores
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="flex-end" sx={{ gap: 1, rowGap: 1 }}>
            <Box sx={{ width: 220 }}>
              <Input
                placeholder="Buscar empresa, NIT o código…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                leftIcon={<IconSearch size={13} />}
                sx={{ bgcolor: (theme) => theme.alhorno.surface2 }}
              />
            </Box>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconPlus size={12} />}
              onClick={() => {
                setSeleccionado(null)
                setVista('crear')
              }}
              sx={{ fontSize: 12, px: 1.5, py: 0.5, minHeight: 0 }}
            >
              Nuevo proveedor
            </Button>
            <Badge badgeContent={hayFiltros ? filtrosActivosCount : 0} color="primary">
              <Button
                variant={hayFiltros ? 'primary' : 'secondary'}
                size="sm"
                leftIcon={<IconFilter size={13} />}
                onClick={() => setShowFiltros((v) => !v)}
              >
                Filtrar
              </Button>
            </Badge>
          </Stack>
        </Box>

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
            <Typography sx={{ fontSize: 14, color: 'text.dim' }}>Cargando proveedores…</Typography>
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

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ px: 2, py: 1.25, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}
        >
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
            Mostrando {desde}–{hasta} de {filtered.length} registros
          </Typography>
          <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </Stack>
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
