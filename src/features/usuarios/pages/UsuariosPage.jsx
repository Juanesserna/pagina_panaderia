import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import useUsuarios from '../hooks/useUsuarios'
import UsuariosKpis from '../components/UsuariosKpis'
import UsuariosToolbar from '../components/UsuariosToolbar'
import UsuariosTable from '../components/UsuariosTable'
import UsuarioFormDialog from '../components/UsuarioFormDialog'
import UsuarioDetailDialog from '../components/UsuarioDetailDialog'
import DeleteUserDialog from '../components/DeleteUserDialog'
import TablePaginationFooter from '@shared/components/TablePaginationFooter'

export default function UsuariosPage() {
  const {
    usuarios,
    totalFiltrados,
    page,
    pageCount,
    pageSize,
    setPage,
    loading,
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

  // formDialog: { mode: 'create' | 'edit', usuario? } | null
  const [formDialog, setFormDialog] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [usuarioAInhabilitar, setUsuarioAInhabilitar] = useState(null)

  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const handleSubmitForm = async (data) => {
    setSubmitting(true)
    try {
      if (formDialog.mode === 'create') {
        await agregarUsuario(data)
      } else {
        await editarUsuario(formDialog.usuario.id, data)
      }
      setFormDialog(null)
    } finally {
      setSubmitting(false)
    }
  }

  // Los usuarios nunca se eliminan: solo cambian de estado. Acá se arma el
  // mensaje de confirmación según a dónde quedó el usuario después del
  // cambio (inhabilitado o reactivado).
  const handleInhabilitar = async (id) => {
    const actualizado = await cambiarEstado(id)
    setSnackbar({
      open: true,
      message:
        actualizado.estado === 'Inactivo'
          ? 'El usuario ha sido inhabilitado.'
          : 'El usuario ha sido reactivado.',
    })
  }

  return (
    <Box>
      <UsuariosKpis kpis={kpis} />

      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <UsuariosToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoUsuario={() => setFormDialog({ mode: 'create' })}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen((p) => !p)}
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
          onEditar={(usuario) => setFormDialog({ mode: 'edit', usuario })}
          onInhabilitar={setUsuarioAInhabilitar}
        />

        <TablePaginationFooter
          page={page}
          pageCount={pageCount}
          totalItems={totalFiltrados}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Paper>

      <UsuarioFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode}
        initialData={formDialog?.usuario}
        onClose={() => setFormDialog(null)}
        onSubmit={handleSubmitForm}
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
        onClose={() => setUsuarioAInhabilitar(null)}
        onInhabilitar={handleInhabilitar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}