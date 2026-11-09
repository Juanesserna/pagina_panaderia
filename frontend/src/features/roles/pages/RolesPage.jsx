import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useRoles from '../hooks/useRoles'
import RolesKpis from '../components/RolesKpis'
import RolesInfoBanner from '../components/RolesInfoBanner'
import RolesToolbar from '../components/RolesToolbar'
import RolesTable from '../components/RolesTable'
import RoleFormDialog from '../components/RoleFormDialog'
import RoleDetailDialog from '../components/RoleDetailDialog'
import DeleteRoleDialog from '../components/DeleteRoleDialog'
import { Pagination } from '@shared/ui'
import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function RolesPage() {
  const {
    roles,
    totalFiltrados,
    page,
    pageSize,
    setPage,
    loading,
    kpis,
    search,
    setSearch,
    agregarRol,
    editarRol,
    cambiarEstado,
    eliminarRol,
  } = useRoles()

  const [formDialog, setFormDialog] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [rolDetalle, setRolDetalle] = useState(null)
  const [rolAEliminar, setRolAEliminar] = useState(null)

  const { notificaciones, mostrarNotificacion } = useNotificaciones()

  const handleSubmitForm = async (data) => {
    setSubmitting(true)

    try {
      if (formDialog.mode === 'create') {
        await agregarRol(data)
        mostrarNotificacion('exito', 'Rol creado correctamente.')
      } else {
        await editarRol(formDialog.rol.id, data)
        mostrarNotificacion('exito', 'Rol actualizado correctamente.')
      }

      setFormDialog(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo completar la operación. Intenta nuevamente.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleEstado = async (rolId) => {
    const rol = roles.find((item) => item.id === rolId)
    if (!rol) return

    const nuevoEstado = rol.estado === 'Activo' ? 'Inactivo' : 'Activo'

    try {
      await cambiarEstado(rolId)

      mostrarNotificacion(
        'exito',
        `El rol ${rol.nombre} se ${nuevoEstado === 'Activo' ? 'activó' : 'desactivó'} correctamente.`
      )
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo cambiar el estado del rol.'
      )
    }
  }

  const handleEliminar = async () => {
    if (!rolAEliminar) return

    try {
      await eliminarRol(rolAEliminar.id)
      mostrarNotificacion('exito', 'Rol eliminado correctamente.')
      setRolAEliminar(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo eliminar el rol.'
      )
    }
  }
  const handleValidationError = (mensaje) => {
  mostrarNotificacion('error', mensaje)
  }
  return (
    <Box sx={{ width: '100%', minWidth: 0, overflowX: 'hidden' }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          color: 'text.primary',
          mb: 0.5,
        }}
      >
        Gestión de roles
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: 'text.secondary',
          mb: 2,
        }}
      >
        Activa, edita o elimina los roles disponibles en el sistema
      </Typography>

      <RolesKpis kpis={kpis} />

      <Paper
        variant="outlined"
        sx={{
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
        }}
      >
        <RolesInfoBanner />

        <RolesToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoRol={() => setFormDialog({ mode: 'create' })}
        />

        <RolesTable
          roles={roles}
          loading={loading}
          onToggleEstado={handleToggleEstado}
          onVer={setRolDetalle}
          onEditar={(rol) => setFormDialog({ mode: 'edit', rol })}
          onEliminar={setRolAEliminar}
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

      <RoleFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode}
        initialData={formDialog?.rol}
        onClose={() => setFormDialog(null)}
        onSubmit={handleSubmitForm}
        onError={handleValidationError}
        submitting={submitting}
      />

      <RoleDetailDialog
        open={Boolean(rolDetalle)}
        rol={rolDetalle}
        onClose={() => setRolDetalle(null)}
      />

      <DeleteRoleDialog
        open={Boolean(rolAEliminar)}
        rol={rolAEliminar}
        onClose={() => setRolAEliminar(null)}
        onEliminar={handleEliminar}
      />

      <NotificacionesContainer notificaciones={notificaciones} />
    </Box>
  )
}
