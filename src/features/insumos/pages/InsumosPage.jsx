import { useState } from 'react'
import { Box, Stack, Typography, Badge } from '@mui/material'
import { IconSearch, IconPlus, IconFilter } from '@tabler/icons-react'
import { Input } from '@features/insumos/components/Input'
import { Button } from '@features/insumos/components/Button'
import { Pagination } from '@features/insumos/components/Pagination'

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

  if (vista === 'crear' || vista === 'editar') {
    return (
      <FormularioInsumo
        modo={vista}
        insumo={seleccionado}
        onGuardar={handleGuardar}
        onCancelar={() => setVista('lista')}
      />
    )
  }

  if (vista === 'detalle' && seleccionado) {
    return (
      <DetalleInsumo insumo={seleccionado} onEditar={() => setVista('editar')} onVolver={() => setVista('lista')} />
    )
  }

  const desde = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1
  const hasta = Math.min(page * pageSize, filtered.length)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      <InsumosKpis kpis={kpis} />

      <Box sx={{ borderRadius: 2.5, overflow: 'hidden', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            columnGap: 2,
            px: 2.5,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', textAlign: 'center', whiteSpace: 'nowrap' }}>
            Registro de insumos
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="flex-end" sx={{ gap: 3, columnGap: 3, rowGap: 1.5 }}>
            <Box sx={{ width: 224 }}>
              <Input
                placeholder="Buscar por nombre o código…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                leftIcon={<IconSearch size={13} />}
              />
            </Box>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<IconPlus size={13} />}
              onClick={() => {
                setSeleccionado(null)
                setVista('crear')
              }}
            >
              Nuevo insumo
            </Button>
            <Badge badgeContent={hayFiltros ? filtrosActivosCount : 0} color="primary">
              <Button
                variant={showFiltros || hayFiltros ? 'primary' : 'secondary'}
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
            <Typography sx={{ fontSize: 14, color: 'text.dim' }}>Cargando insumos…</Typography>
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

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ px: 2.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}
        >
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
            Mostrando {desde}–{hasta} de {filtered.length} registros
          </Typography>
          <Pagination page={page} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </Stack>
      </Box>

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
