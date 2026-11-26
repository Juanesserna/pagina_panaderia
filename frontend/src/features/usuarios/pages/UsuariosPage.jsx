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
    submitting,
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
  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [usuarioCambioEstado, setUsuarioCambioEstado] = useState(null)

  const { notificaciones, mostrarNotificacion } =
    useNotificaciones()

  // Notificar errores durante la carga inicial.
  useEffect(() => {
    if (error) {
      mostrarNotificacion('error', error)
    }
  }, [error, mostrarNotificacion])

  // Crear o actualizar una cuenta.
  async function handleSubmitForm(data) {
    if (submitting || !formDialog) return false

    const esCreacion = formDialog.mode === 'create'

    try {
      if (esCreacion) {
        await agregarUsuario(data)
      } else {
        await editarUsuario(formDialog.usuario.id, data)
      }

      mostrarNotificacion(
        'exito',
        esCreacion
          ? 'Usuario registrado correctamente.'
          : 'Usuario actualizado correctamente.'
      )

      setFormDialog(null)
      return true
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo guardar el usuario.'
      )

      return false
    }
  }

  // Activar o desactivar una cuenta.
  async function handleCambiarEstado(id) {
    if (submitting) return false

    try {
      const actualizado = await cambiarEstado(id)

      mostrarNotificacion(
        'exito',
        actualizado.estado === 'Activo'
          ? 'Usuario activado correctamente.'
          : 'Usuario desactivado correctamente.'
      )

      setUsuarioCambioEstado(null)
      return true
    } catch (error) {
      mostrarNotificacion(
        'error',
        error.message || 'No se pudo cambiar el estado del usuario.'
      )

      return false
    }
  }

  function abrirFormulario(mode, usuario = null) {
    if (loading || submitting) return

    setFormDialog({ mode, usuario })
  }

  function cerrarFormulario() {
    if (!submitting) setFormDialog(null)
  }

  function abrirCambioEstado(usuario) {
    if (!loading && !submitting) {
      setUsuarioCambioEstado(usuario)
    }
  }

  function cerrarCambioEstado() {
    if (!submitting) setUsuarioCambioEstado(null)
  }

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
      }}
    >
      <UsuariosKpis kpis={kpis} />

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
        <UsuariosToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoUsuario={() => abrirFormulario('create')}
          filtersOpen={filtersOpen}
          onToggleFilters={() =>
            setFiltersOpen((prev) => !prev)
          }
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
          submitting={submitting}
          onVer={setUsuarioDetalle}
          onEditar={(usuario) =>
            abrirFormulario('edit', usuario)
          }
          onInhabilitar={abrirCambioEstado}
          esUnicoGerente={esUnicoGerente}
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
        onClose={cerrarFormulario}
        onSubmit={handleSubmitForm}
        onError={(mensaje) =>
          mostrarNotificacion('error', mensaje)
        }
        submitting={submitting}
      />

      <UsuarioDetailDialog
        open={Boolean(usuarioDetalle)}
        usuario={usuarioDetalle}
        onClose={() => setUsuarioDetalle(null)}
      />

      <DeleteUserDialog
        open={Boolean(usuarioCambioEstado)}
        usuario={usuarioCambioEstado}
        esUnicoGerente={esUnicoGerente}
        onClose={cerrarCambioEstado}
        onInhabilitar={handleCambiarEstado}
      />

      <NotificacionesContainer
        notificaciones={notificaciones}
      />
    </Box>
  )
}
