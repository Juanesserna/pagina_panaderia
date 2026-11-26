
import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import useRoles from '../hooks/useRoles'
import RolesKpis from '../components/RolesKpis'

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
import { GERENTE_ID } from '../services/rolesService'

export default function RolesPage() {
  const {
    roles,
    totalFiltrados,
    page,
    pageSize,
    setPage,
    loading,
    submitting,
    kpis,
    search,
    setSearch,
    agregarRol,
    editarRol,
    cambiarEstado,
    eliminarRol,
  } = useRoles()

  const [formDialog, setFormDialog] = useState(null)
  const [rolDetalle, setRolDetalle] = useState(null)
  const [rolAEliminar, setRolAEliminar] = useState(null)

  const { notificaciones, mostrarNotificacion } =
    useNotificaciones()

  const handleSubmitForm = async (data) => {
    if (!formDialog || submitting) return

    try {
      if (formDialog.mode === 'create') {
        await agregarRol(data)

        mostrarNotificacion(
          'exito',
          'Rol creado correctamente.'
        )
      } else {
        await editarRol(formDialog.rol.id, data)

        mostrarNotificacion(
          'exito',
          'Rol actualizado correctamente.'
        )
      }

      setFormDialog(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message ||
        'No se pudo completar la operación. Intenta nuevamente.'
      )
    }
  }

  const handleToggleEstado = async (rolId) => {
    const rol = roles.find(item => item.id === rolId)

    if (!rol) {
      throw new Error('El rol seleccionado no existe.')
    }

    if (submitting) {
      throw new Error('Hay una operación en proceso.')
    }

    try {
      const actualizado = await cambiarEstado(rolId)

      mostrarNotificacion(
        'exito',
        `El rol ${rol.nombre} se ${actualizado.estado === 'Activo'
          ? 'activó'
          : 'desactivó'
        } correctamente.`
      )
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message ||
        'No se pudo cambiar el estado del rol.'
      )

      throw error
    }
  }

  const handleEliminar = async (id) => {
    if (!rolAEliminar) {
      throw new Error('No se ha seleccionado un rol.')
    }

    try {
      await eliminarRol(id)

      mostrarNotificacion(
        'exito',
        'Rol eliminado correctamente.'
      )
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo eliminar el rol.'
      )

      // Permite que el diálogo detecte el error
      // y permanezca abierto.
      throw error
    }
  }

  const handleValidationError = (mensaje) => {
    mostrarNotificacion('error', mensaje)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
      }}
    >
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
          borderTop: '4px solid',
          borderTopColor: 'primary.main',
          overflow: 'hidden',
          width: '100%',
          minWidth: 0,
        }}
      >


        <RolesToolbar
          search={search}
          onSearchChange={setSearch}
          submitting={submitting}
          onNuevoRol={() =>
            setFormDialog({ mode: 'create' })
          }
        />

        <RolesTable
          roles={roles}
          loading={loading}
          submitting={submitting}
          onToggleEstado={handleToggleEstado}
          onVer={setRolDetalle}
          onEditar={(rol) => {
            if (rol.id === GERENTE_ID || submitting) return

            setFormDialog({ mode: 'edit', rol })
          }}
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

      <NotificacionesContainer
        notificaciones={notificaciones}
      />
    </Box>
  )
}
