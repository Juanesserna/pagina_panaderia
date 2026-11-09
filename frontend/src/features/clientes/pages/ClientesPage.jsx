
import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import useClientes from '../hooks/useClientes'
import ClientesToolbar from '../components/ClientesToolbar'
import ClientesTable from '../components/ClientesTable'
import ClienteFormDialog from '../components/ClienteFormDialog'
import ClienteDetailDialog from '../components/ClienteDetailDialog'

import { Pagination } from '@shared/ui'
import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function ClientesPage() {
  const {
    clientes,
    totalFiltrados,
    page,
    pageSize,
    setPage,
    loading,
    submitting,
    search,
    setSearch,
    tipoDocumentoFiltro,
    setTipoDocumentoFiltro,
    hayFiltrosActivos,
    limpiarFiltros,
    agregarCliente,
    editarCliente,
  } = useClientes()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [formDialog, setFormDialog] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)

  const { notificaciones, mostrarNotificacion } = useNotificaciones()

  const handleSubmitForm = async (data) => {
    try {
      if (formDialog.mode === 'create') {
        await agregarCliente(data)

        mostrarNotificacion(
          'exito',
          'Cliente registrado correctamente.'
        )
      } else {
        await editarCliente(formDialog.cliente.id, data)

        mostrarNotificacion(
          'exito',
          'Cliente actualizado correctamente.'
        )
      }

      setFormDialog(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el cliente.'
      )
    }
  }

  const handleValidationError = (mensaje) => {
  mostrarNotificacion('error', mensaje)
}
  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <ClientesToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoCliente={() => setFormDialog({ mode: 'create' })}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((prev) => !prev)}
          tipoDocumentoFiltro={tipoDocumentoFiltro}
          onTipoDocumentoFiltroChange={setTipoDocumentoFiltro}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
        />

        <ClientesTable
          clientes={clientes}
          loading={loading}
          onVer={setClienteDetalle}
          onEditar={(cliente) =>
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
        onError={handleValidationError}
        submitting={submitting}
      />

      <ClienteDetailDialog
        open={Boolean(clienteDetalle)}
        cliente={clienteDetalle}
        onClose={() => setClienteDetalle(null)}
      />

      <NotificacionesContainer
        notificaciones={notificaciones}
      />
    </Box>
  )
}
