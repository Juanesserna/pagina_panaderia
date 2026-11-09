import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useEmpleados from '../hooks/useEmpleados'
import EmpleadosToolbar from '../components/EmpleadosToolbar'
import EmpleadosTable from '../components/EmpleadosTable'
import EmpleadoFormDialog from '../components/EmpleadoFormDialog'
import EmpleadoDetailsDialog from '../components/EmpleadoDetailsDialog'
import ConfirmarSalidaDialog from '../components/ConfirmarSalidaDialog'
import { Pagination } from '@shared/ui'
import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function EmpleadosPage() {
  const {
    empleadosPaginados,
    totalEmpleados,
    page,
    pageSize,
    setPage,
    loading,
    submitting,
    search,
    setSearch,
    tipoDocumentoFiltro,
    setTipoDocumentoFiltro,
    registrarEmpleado,
    actualizarEmpleado,
  } = useEmpleados()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [formDialog, setFormDialog] = useState(null)
  const [empleadoDetalle, setEmpleadoDetalle] = useState(null)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const [formDirty, setFormDirty] = useState(false)

  const { notificaciones, mostrarNotificacion } =
    useNotificaciones()

  const hayFiltrosActivos =
    search.trim() !== '' || tipoDocumentoFiltro !== 'Todos'

  const limpiarFiltros = () => {
    setSearch('')
    setTipoDocumentoFiltro('Todos')
    setPage(1)
  }

  const abrirFormulario = (mode, empleado = null) => {
    setFormDirty(false)
    setConfirmExitOpen(false)
    setFormDialog({ mode, empleado })
  }

  const cerrarFormulario = () => {
    setFormDialog(null)
    setConfirmExitOpen(false)
    setFormDirty(false)
  }

  const manejarCancelacion = () => {
    if (formDirty) {
      setConfirmExitOpen(true)
      return
    }

    cerrarFormulario()
  }

  const handleSubmitForm = async (data) => {
    try {
      if (formDialog.mode === 'create') {
        await registrarEmpleado(data)

        mostrarNotificacion(
          'exito',
          'Empleado registrado correctamente.'
        )
      } else {
        await actualizarEmpleado(formDialog.empleado.id, data)

        mostrarNotificacion(
          'exito',
          'Empleado actualizado correctamente.'
        )
      }

      cerrarFormulario()
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el empleado.'
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
        <EmpleadosToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoEmpleado={() => abrirFormulario('create')}
          filtersOpen={filtersOpen}
          onToggleFilters={() =>
            setFiltersOpen((actual) => !actual)
          }
          tipoDocumentoFiltro={tipoDocumentoFiltro}
          onTipoDocumentoFiltroChange={setTipoDocumentoFiltro}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
        />

        <EmpleadosTable
          empleados={empleadosPaginados}
          loading={loading}
          onView={setEmpleadoDetalle}
          onEdit={(empleado) =>
            abrirFormulario('edit', empleado)
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
            total={totalEmpleados}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </Box>
      </Paper>

      <EmpleadoFormDialog
        open={Boolean(formDialog)}
        empleado={formDialog?.empleado}
        submitting={submitting}
        onSubmit={handleSubmitForm}
        onCancel={manejarCancelacion}
        onError={handleValidationError}
        onDirtyChange={setFormDirty}
      />

      <EmpleadoDetailsDialog
        open={Boolean(empleadoDetalle)}
        empleado={empleadoDetalle}
        onClose={() => setEmpleadoDetalle(null)}
      />

      <ConfirmarSalidaDialog
        open={confirmExitOpen}
        onLeave={cerrarFormulario}
        onStay={() => setConfirmExitOpen(false)}
      />

      <NotificacionesContainer
        notificaciones={notificaciones}
      />
    </Box>
  )
}
