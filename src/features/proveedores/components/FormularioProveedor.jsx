import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button, Input, Modal, Select } from '@shared/ui'
import { estadoOptions, formVacio } from '../constants/proveedores.constants'
import { formatoCodigo } from '../utils/proveedoresHelpers'
import { Campo } from './Campo'

const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }

function CuerpoFormulario({ modo, proveedor, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    proveedor
      ? {
          nombre: proveedor.nombre ?? '',
          nit: proveedor.nit ?? '',
          nombreContacto: proveedor.nombreContacto ?? '',
          telefono: proveedor.telefono ?? '',
          email: proveedor.email ?? '',
          direccion: proveedor.direccion ?? '',
          estado: proveedor.estado ?? true,
        }
      : formVacio
  )

  const set = (campo, valor) => setForm((p) => ({ ...p, [campo]: valor }))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      <Typography variant="body2" sx={{ color: 'text.dim', mt: -1 }}>
        {modo === 'editar' ? `Modificando: ${proveedor?.nombre}` : 'Registrar nuevo proveedor en el sistema'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Información general</Typography>
        <Box sx={gridSx}>
          <Campo label="Código">
            <Input
              disabled
              value={modo === 'editar' && proveedor ? formatoCodigo(proveedor.id) : 'Se asigna al guardar'}
              onChange={() => {}}
            />
          </Campo>
          <Campo label="Estado">
            <Select
              options={estadoOptions}
              value={form.estado ? 'true' : 'false'}
              onChange={(e) => set('estado', e.target.value === 'true')}
            />
          </Campo>

          <Campo label="Nombre empresa" required>
            <Input placeholder="Ej: Molinos El Trigal S.A." value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </Campo>
          <Campo label="NIT" required>
            <Input placeholder="900.123.456-7" value={form.nit} onChange={(e) => set('nit', e.target.value)} />
          </Campo>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Contacto</Typography>
        <Box sx={gridSx}>
          <Campo label="Nombre contacto" required>
            <Input value={form.nombreContacto} onChange={(e) => set('nombreContacto', e.target.value)} />
          </Campo>
          <Campo label="Teléfono" required>
            <Input placeholder="+57 300 000 0000" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </Campo>
          <Campo label="Correo electrónico" required>
            <Input type="email" placeholder="correo@empresa.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Campo>
          <Campo label="Dirección" required>
            <Input value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </Campo>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setForm(formVacio)}>
          Limpiar campos
        </Button>
        <Button variant="primary" size="sm" onClick={() => onGuardar(form)}>
          {modo === 'editar' ? 'Actualizar proveedor' : 'Guardar proveedor'}
        </Button>
      </Stack>
    </Box>
  )
}

/**
 * Formulario de proveedor como modal flotante sobre la lista.
 * `open` controla la visibilidad; el estado interno se reinicia con la `key`.
 */
export function FormularioProveedor({ open, modo, proveedor, onGuardar, onCancelar }) {
  return (
    <Modal open={open} onClose={onCancelar} title={modo === 'editar' ? 'Editar proveedor' : 'Nuevo proveedor'} size="lg" showDivider>
      <CuerpoFormulario
        key={`${modo}-${proveedor?.id ?? 'nuevo'}`}
        modo={modo}
        proveedor={proveedor}
        onGuardar={onGuardar}
        onCancelar={onCancelar}
      />
    </Modal>
  )
}
