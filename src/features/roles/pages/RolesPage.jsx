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
import TablePaginationFooter from '@shared/components/TablePaginationFooter'

export default function RolesPage() {
  const {
    roles,
    totalFiltrados,
    page,
    pageCount,
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

  const handleSubmitForm = async (data) => {
    setSubmitting(true)
    try {
      if (formDialog.mode === 'create') {
        await agregarRol(data)
      } else {
        await editarRol(formDialog.rol.id, data)
      }
      setFormDialog(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'text.primary', mb: 0.5 }}>
        Gestión de roles
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2.5 }}>
        Activa, edita o elimina los roles disponibles en el sistema
      </Typography>

      <RolesKpis kpis={kpis} />
     

      <Paper variant="outlined" sx={{ borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <RolesInfoBanner />
        <RolesToolbar
          search={search}
          onSearchChange={setSearch}
          onNuevoRol={() => setFormDialog({ mode: 'create' })}
        />

        <RolesTable
          roles={roles}
          loading={loading}
          onToggleEstado={cambiarEstado}
          onVer={setRolDetalle}
          onEditar={(rol) => setFormDialog({ mode: 'edit', rol })}
          onEliminar={setRolAEliminar}
        />

        <TablePaginationFooter
          page={page}
          pageCount={pageCount}
          totalItems={totalFiltrados}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </Paper>

      <RoleFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode}
        initialData={formDialog?.rol}
        onClose={() => setFormDialog(null)}
        onSubmit={handleSubmitForm}
        submitting={submitting}
      />

      <RoleDetailDialog open={Boolean(rolDetalle)} rol={rolDetalle} onClose={() => setRolDetalle(null)} />

      <DeleteRoleDialog
        open={Boolean(rolAEliminar)}
        rol={rolAEliminar}
        onClose={() => setRolAEliminar(null)}
        onEliminar={eliminarRol}
      />
    </Box>
  )
}