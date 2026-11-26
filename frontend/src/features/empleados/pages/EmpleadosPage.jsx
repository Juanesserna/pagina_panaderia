import { useState } from 'react'
import { Box, Paper, Alert, Button } from '@mui/material'
import { Users, UserCheck, UserRound } from 'lucide-react'

import useEmpleados from '../hooks/useEmpleados'
import EmpleadosToolbar from '../components/EmpleadosToolbar'
import EmpleadosTable from '../components/EmpleadosTable'
import EmpleadoFormDialog from '../components/EmpleadoFormDialog'
import EmpleadoDetailsDialog from '../components/EmpleadoDetailsDialog'

import { Pagination, KPIGrid, KPICard } from '@shared/ui'

import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function EmpleadosPage() {
  const {
    empleadosPaginados,
    totalEmpleados,
    estadisticas,
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
    cargarEmpleados,
    registrarEmpleado,
    actualizarEmpleado,
  } = useEmpleados()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [formDialog, setFormDialog] = useState(null)
  const [empleadoDetalle, setEmpleadoDetalle] = useState(null)

  const { notificaciones, mostrarNotificacion } =
    useNotificaciones()

  function abrirFormulario(mode, empleado = null) {
    if (loading || submitting) return

    setFormDialog({ mode, empleado })
  }

  function cerrarFormulario() {
    setFormDialog(null)
  }

  // Registrar o actualizar un empleado.
  async function handleSubmitForm(data) {
    if (!formDialog || submitting) return false

    const esCreacion = formDialog.mode === 'create'

    try {
      if (esCreacion) {
        await registrarEmpleado(data)
      } else {
        await actualizarEmpleado(formDialog.empleado.id, data)
      }

      mostrarNotificacion(
        'exito',
        esCreacion
          ? 'Empleado registrado correctamente.'
          : 'Empleado actualizado correctamente.'
      )

      cerrarFormulario()
      return true
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el empleado.'
      )

      return false
    }
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0, overflowX: 'hidden' }}>
      {/* Indicadores generales. */}
      <Box sx={{ mb: 1.5 }}>
        <KPIGrid compact>
          <KPICard
            compact
            title="Total empleados"
            value={loading ? '—' : estadisticas.total}
            icon={<Users size={18} />}
            variant="accent"
          />

          <KPICard
            compact
            title="Con cuenta"
            value={loading ? '—' : estadisticas.conCuenta}
            icon={<UserCheck size={18} />}
            variant="success"
          />

          <KPICard
            compact
            title="Sin cuenta"
            value={loading ? '—' : estadisticas.sinCuenta}
            icon={<UserRound size={18} />}
            variant="info"
          />
        </KPIGrid>
      </Box>

      {/* Error de carga y opción de reintentar. */}
      {error && !loading && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={cargarEmpleados}
              disabled={submitting}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Listado principal. */}
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
        <EmpleadosToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoEmpleado={() => abrirFormulario('create')}
          filtersOpen={filtersOpen}
          onToggleFilters={() =>
            setFiltersOpen(prev => !prev)
          }
          tipoDocumentoFiltro={tipoDocumentoFiltro}
          onTipoDocumentoFiltroChange={setTipoDocumentoFiltro}
          cuentaFiltro={cuentaFiltro}
          onCuentaFiltroChange={setCuentaFiltro}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
        />

        <EmpleadosTable
          empleados={empleadosPaginados}
          loading={loading}
          submitting={submitting}
          onView={setEmpleadoDetalle}
          onEdit={empleado =>
            abrirFormulario('edit', empleado)
          }
        />

        <Box sx={{
          px: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}>
          <Pagination
            page={page}
            total={totalEmpleados}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </Box>
      </Paper>

      {/* El formulario gestiona sus propias confirmaciones. */}
      <EmpleadoFormDialog
        open={Boolean(formDialog)}
        empleado={formDialog?.empleado}
        submitting={submitting}
        onSubmit={handleSubmitForm}
        onCancel={cerrarFormulario}
        onError={mensaje =>
          mostrarNotificacion('error', mensaje)
        }
      />

      <EmpleadoDetailsDialog
        open={Boolean(empleadoDetalle)}
        empleado={empleadoDetalle}
        onClose={() => setEmpleadoDetalle(null)}
      />

      <NotificacionesContainer
        notificaciones={notificaciones}
      />
    </Box>
  )
}
