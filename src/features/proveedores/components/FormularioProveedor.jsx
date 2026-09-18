import { useState } from 'react'
import { Box, Stack, Typography, IconButton } from '@mui/material'
import { IconArrowLeft } from '@tabler/icons-react'
import { Input } from '@features/produccion/components/Input'
import { Select } from '@features/produccion/components/Select'
import { Button } from '@features/produccion/components/Button'
import { Campo, dimLabelSx } from './Campo'
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

const panelSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: 2.5,
  p: 2.5,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
}

export function FormularioProveedor({ modo, proveedor, onGuardar, onCancelar }) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconButton onClick={onCancelar} sx={{ color: 'text.secondary' }}>
          <IconArrowLeft size={18} />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
            {modo === 'editar' ? 'Editar proveedor' : 'Nuevo proveedor'}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
            {modo === 'editar' ? `Modificando: ${proveedor?.nombre}` : 'Registrar nuevo proveedor en el sistema'}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Información general</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Código">
                <Input
                  disabled
                  value={modo === 'editar' && proveedor ? formatoCodigo(proveedor.id) : 'Se asigna al guardar'}
                  onChange={() => {}}
                />
              </Campo>
              <Campo label="Estado inicial">
                <Select
                  options={[
                    { value: 'true', label: 'Activo' },
                    { value: 'false', label: 'Inactivo' },
                  ]}
                  value={form.estado ? 'true' : 'false'}
                  onChange={(e) => set('estado', e.target.value === 'true')}
                />
              </Campo>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Nombre empresa" required>
                <Input placeholder="Ej: Molinos El Trigal S.A." value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
              </Campo>
              <Campo label="NIT" required>
                <Input placeholder="900.123.456-7" value={form.nit} onChange={(e) => set('nit', e.target.value)} />
              </Campo>
            </Box>

            <Campo label="Descripción">
              <Input
                placeholder="Descripción del proveedor…"
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
              />
            </Campo>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Contacto</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
        </Box>

        <Box sx={panelSx}>
          <Typography sx={dimLabelSx}>Acciones</Typography>
          <Button variant="primary" size="sm" onClick={() => onGuardar(form)}>
            {modo === 'editar' ? 'Actualizar proveedor' : 'Guardar proveedor'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setForm(formVacio)}>
            Limpiar campos
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancelar}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
