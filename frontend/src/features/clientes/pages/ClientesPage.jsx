import { useState } from 'react'
import { Alert, Box, Button, Paper } from '@mui/material'
import { Users, UserCheck, UserRound } from 'lucide-react'

import useClientes from '../hooks/useClientes'
import ClientesToolbar from '../components/ClientesToolbar'
import ClientesTable from '../components/ClientesTable'
import ClienteFormDialog from '../components/ClienteFormDialog'
import ClienteDetailDialog from '../components/ClienteDetailDialog'

import { Pagination, KPIGrid, KPICard } from '@shared/ui'
import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function ClientesPage() {
  const {
    clientes,
    estadisticas,
    totalFiltrados,
    page,
    pageSize,
    setPage,
    loading,
    submitting,
    error,
    search,
    setSearch,
    tipoDocumentoFiltro,
    setTipoDocumentoFiltro,
    cuentaFiltro,
    setCuentaFiltro,
    hayFiltrosActivos,
    limpiarFiltros,
    cargarClientes,
    agregarCliente,
    editarCliente,
  } = useClientes()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [formDialog, setFormDialog] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)

  const { notificaciones, mostrarNotificacion } = useNotificaciones()

  async function handleSubmitForm(data) {
    if (!formDialog || submitting) return

    try {
      const esCreacion = formDialog.mode === 'create'

      if (esCreacion) {
        await agregarCliente(data)
      } else {
        await editarCliente(formDialog.cliente.id, data)
      }

      mostrarNotificacion(
        'exito',
        esCreacion
          ? 'Cliente registrado correctamente.'
          : 'Cliente actualizado correctamente.'
      )

      setFormDialog(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el cliente.'
      )
    }
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      {/* Indicadores generales del módulo. */}
      <Box sx={{ mb: 1.5 }}>
        <KPIGrid compact>
          <KPICard
            title="Total clientes"
            value={loading ? '—' : estadisticas.total}
            icon={<Users size={18} />}
            variant="accent"
            compact
          />

          <KPICard
            title="Con cuenta"
            value={loading ? '—' : estadisticas.conCuenta}
            icon={<UserCheck size={18} />}
            variant="success"
            compact
          />

          <KPICard
            title="Sin cuenta"
            value={loading ? '—' : estadisticas.sinCuenta}
            icon={<UserRound size={18} />}
            variant="info"
            compact
          />
        </KPIGrid>
      </Box>

      {error && !formDialog && !loading && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={cargarClientes}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderColor: 'divider',
          borderRadius: 3,
          borderTop: '4px solid',
          borderTopColor: 'primary.main',
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
        }}
      >
        <ClientesToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoCliente={() => setFormDialog({ mode: 'create' })}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen(prev => !prev)}
          tipoDocumentoFiltro={tipoDocumentoFiltro}
          onTipoDocumentoFiltroChange={setTipoDocumentoFiltro}
          cuentaFiltro={cuentaFiltro}
          onCuentaFiltroChange={setCuentaFiltro}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
        />

        <ClientesTable
          clientes={clientes}
          loading={loading}
          onVer={setClienteDetalle}
          onEditar={cliente =>
            setFormDialog({ mode: 'edit', cliente })
          }
        />

        <Box
          sx={{
            px: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Pagination
            page={page}
            total={totalFiltrados}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </Box>
      </Paper>

      <ClienteFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode}
        initialData={formDialog?.cliente}
        onClose={() => {
          if (!submitting) setFormDialog(null)
        }}
        onSubmit={handleSubmitForm}
        onError={mensaje => mostrarNotificacion('error', mensaje)}
        submitting={submitting}
      />

      <ClienteDetailDialog
        open={Boolean(clienteDetalle)}
        cliente={clienteDetalle}
        onClose={() => setClienteDetalle(null)}
      />

      <NotificacionesContainer notificaciones={notificaciones} />
    </Box>
  )
}
