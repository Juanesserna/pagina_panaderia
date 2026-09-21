import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Input, Select, Button, Modal, ModalFooter, FormField } from '@shared/components'
import { formatoCodigo } from '../utils/proveedoresHelpers'

const formVacio = {
  nombre: '',
  nit: '',
  descripcion: '',
  nombreContacto: '',
  telefono: '',
  email: '',
  direccion: '',
  estado: true,
}

const seccionTituloSx = { fontSize: 14, fontWeight: 700, color: 'text.primary' }
const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

function CuerpoFormulario({ modo, proveedor, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    proveedor
      ? {
        nombre: proveedor.nombre ?? '',
        nit: proveedor.nit ?? '',
        descripcion: proveedor.descripcion ?? '',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ fontSize: 12, color: 'text.dim', mt: -1 }}>
        {modo === 'editar' ? `Modificando: ${proveedor?.nombre}` : 'Registrar nuevo proveedor en el sistema'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={seccionTituloSx}>Información general</Typography>
        <Box sx={gridSx}>
          <FormField label="Código">
            <Input
              disabled
              value={modo === 'editar' && proveedor ? formatoCodigo(proveedor.id) : 'Se asigna al guardar'}
              onChange={() => { }}
            />
          </FormField>
          <FormField label="Estado inicial">
            <Select
              options={[
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' },
              ]}
              value={form.estado ? 'true' : 'false'}
              onChange={(e) => set('estado', e.target.value === 'true')}
            />
          </FormField>

          <FormField label="Nombre empresa" required>
            <Input placeholder="Ej: Molinos El Trigal S.A." value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </FormField>
          <FormField label="NIT" required>
            <Input placeholder="900.123.456-7" value={form.nit} onChange={(e) => set('nit', e.target.value)} />
          </FormField>

          <FormField label="Descripción" sx={anchoCompletoSx}>
            <Input
              placeholder="Descripción del proveedor…"
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
            />
          </FormField>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={seccionTituloSx}>Contacto</Typography>
        <Box sx={gridSx}>
          <FormField label="Nombre contacto" required>
            <Input value={form.nombreContacto} onChange={(e) => set('nombreContacto', e.target.value)} />
          </FormField>
          <FormField label="Teléfono" required>
            <Input placeholder="+57 300 000 0000" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </FormField>
          <FormField label="Correo electrónico" required>
            <Input type="email" placeholder="correo@empresa.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </FormField>
          <FormField label="Dirección" required>
            <Input value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </FormField>
        </Box>
      </Box>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setForm(formVacio)}>
          Limpiar campos
        </Button>
        <Button variant="primary" size="sm" onClick={() => onGuardar(form)}>
          {modo === 'editar' ? 'Actualizar proveedor' : 'Guardar proveedor'}
        </Button>
      </ModalFooter>
    </Box>
  )
}

/**
 * Formulario de proveedor como modal flotante sobre la lista.
 * `open` controla la visibilidad; el estado interno se reinicia cada vez que se cierra.
 */
export function FormularioProveedor({ open, modo, proveedor, onGuardar, onCancelar }) {
  return (
    <Modal open={open} onClose={onCancelar} title={modo === 'editar' ? 'Editar proveedor' : 'Nuevo proveedor'} size="lg">
      <CuerpoFormulario key={`${modo}-${proveedor?.id ?? 'nuevo'}`} modo={modo} proveedor={proveedor} onGuardar={onGuardar} onCancelar={onCancelar} />
    </Modal>
  )
}
