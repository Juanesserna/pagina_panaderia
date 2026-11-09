import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import useUsuarios from '../hooks/useUsuarios'
import UsuariosKpis from '../components/UsuariosKpis'
import UsuariosToolbar from '../components/UsuariosToolbar'
import UsuariosTable from '../components/UsuariosTable'
import UsuarioFormDialog from '../components/UsuarioFormDialog'
import UsuarioDetailDialog from '../components/UsuarioDetailDialog'
import DeleteUserDialog from '../components/DeleteUserDialog'

import { Pagination } from '@shared/ui'
import {
  NotificacionesContainer,
  useNotificaciones,
} from '@shared/notifications'

export default function UsuariosPage() {
  const {
    usuarios,
    totalFiltrados,
    page,
    pageSize,
    setPage,
    loading,
    error,
    kpis,
    search,
    setSearch,
    rolFiltro,
    setRolFiltro,
    estadoFiltro,
    setEstadoFiltro,
    hayFiltrosActivos,
    limpiarFiltros,
    agregarUsuario,
    editarUsuario,
    cambiarEstado,
    esUnicoGerente,
  } = useUsuarios()

  const [filtersOpen, setFiltersOpen] = useState(false)

  const [formDialog, setFormDialog] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [usuarioAInhabilitar, setUsuarioAInhabilitar] = useState(null)
  const [changingStatus, setChangingStatus] = useState(false)

  const { notificaciones, mostrarNotificacion } = useNotificaciones()

  // Notificar errores durante la carga inicial.
  useEffect(() => {
    if (error) {
      mostrarNotificacion('error', error)
    }
  }, [error, mostrarNotificacion])

  // Guardar o actualizar usuario.
  const handleSubmitForm = async (data) => {
    if (submitting || !formDialog) return

    setSubmitting(true)

    try {
      if (formDialog.mode === 'create') {
        await agregarUsuario(data)

        mostrarNotificacion(
          'exito',
          'Usuario registrado correctamente.'
        )
      } else {
        await editarUsuario(formDialog.usuario.id, data)

        mostrarNotificacion(
          'exito',
          'Usuario actualizado correctamente.'
        )
      }

      setFormDialog(null)
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el usuario.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Errores de validación del formulario.
  const handleValidationError = (mensaje) => {
    mostrarNotificacion('error', mensaje)
  }

  // Cambiar estado después de confirmar.
  const handleInhabilitar = async (id) => {
  if (changingStatus) return false

  setChangingStatus(true)

  try {
    const actualizado = await cambiarEstado(id)

    mostrarNotificacion(
      'exito',
      actualizado.estado === 'Inactivo'
        ? 'El usuario ha sido inhabilitado.'
        : 'El usuario ha sido reactivado.'
    )

    setUsuarioAInhabilitar(null)
    return true
  } catch (error) {
    mostrarNotificacion(
      'error',
      error.message || 'No se pudo cambiar el estado del usuario.'
    )

    return false
  } finally {
    setChangingStatus(false)
  }
}

  return (
    <Box>
      <UsuariosKpis kpis={kpis} />

      <Paper
        variant="outlined"
        sx={{
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <UsuariosToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoUsuario={() => setFormDialog({ mode: 'create' })}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((prev) => !prev)}
          rolFiltro={rolFiltro}
          onRolFiltroChange={setRolFiltro}
          estadoFiltro={estadoFiltro}
          onEstadoFiltroChange={setEstadoFiltro}
          hayFiltrosActivos={hayFiltrosActivos}
          onLimpiarFiltros={limpiarFiltros}
        />

        <UsuariosTable
          usuarios={usuarios}
          loading={loading}
          onVer={setUsuarioDetalle}
          onEditar={(usuario) =>
            setFormDialog({ mode: 'edit', usuario })
          }
          onInhabilitar={setUsuarioAInhabilitar}
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

      <UsuarioFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode}
        initialData={formDialog?.usuario}
        onClose={() => {
          if (!submitting) setFormDialog(null)
        }}
        onSubmit={handleSubmitForm}
        onError={handleValidationError}
        submitting={submitting}
      />

      <UsuarioDetailDialog
        open={Boolean(usuarioDetalle)}
        usuario={usuarioDetalle}
        onClose={() => setUsuarioDetalle(null)}
      />

      <DeleteUserDialog
        open={Boolean(usuarioAInhabilitar)}
        usuario={usuarioAInhabilitar}
        esUnicoGerente={esUnicoGerente}
        onClose={() => {
          if (!changingStatus) setUsuarioAInhabilitar(null)
        }}
        onInhabilitar={handleInhabilitar}
      />

      <NotificacionesContainer notificaciones={notificaciones} />
    </Box>
  )
}