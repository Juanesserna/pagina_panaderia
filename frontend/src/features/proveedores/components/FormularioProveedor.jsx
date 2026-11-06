import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button, Input, Modal, Select } from '@shared/ui'
import { estadoOptions, formVacio } from '../constants/proveedores.constants'
import { validarProveedor } from '../utils/proveedoresValidaciones'
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

  // Un campo se marca "tocado" al escribir o al salir de él; al pulsar Guardar
  // se marcan todos. El error solo se ve en campos tocados.
  const [tocados, setTocados] = useState({})
  const [intentoGuardar, setIntentoGuardar] = useState(false)

  const errores = validarProveedor(form)
  const error = (campo) => (tocados[campo] || intentoGuardar ? errores[campo] ?? '' : '')
  const tocar = (campo) => setTocados((p) => (p[campo] ? p : { ...p, [campo]: true }))
  const set = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: valor }))
    tocar(campo)
  }

  const limpiar = () => {
    setForm(formVacio)
    setTocados({})
    setIntentoGuardar(false)
  }
  const guardar = () => {
    setIntentoGuardar(true)
    if (Object.keys(errores).length > 0) return
    onGuardar(form)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      <Typography variant="body2" sx={{ color: 'text.dim', mt: -1 }}>
        {modo === 'editar' ? `Modificando: ${proveedor?.nombre}` : 'Registrar nuevo proveedor en el sistema'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Información general</Typography>
        <Box sx={gridSx}>
          <Campo label="ID">
            <Input
              disabled
              value={modo === 'editar' && proveedor ? String(proveedor.id) : 'Se asigna al guardar'}
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

          <Campo label="Nombre empresa" required error={error('nombre')} onBlur={() => tocar('nombre')}>
            <Input placeholder="Ej: Molinos El Trigal S.A." value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </Campo>
          <Campo label="NIT" required error={error('nit')} onBlur={() => tocar('nit')}>
            <Input placeholder="900.123.456-7" value={form.nit} onChange={(e) => set('nit', e.target.value)} />
          </Campo>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Contacto</Typography>
        <Box sx={gridSx}>
          <Campo label="Nombre contacto" required error={error('nombreContacto')} onBlur={() => tocar('nombreContacto')}>
            <Input value={form.nombreContacto} onChange={(e) => set('nombreContacto', e.target.value)} />
          </Campo>
          <Campo label="Teléfono" required error={error('telefono')} onBlur={() => tocar('telefono')}>
            <Input placeholder="+57 300 000 0000" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </Campo>
          <Campo label="Correo electrónico" required error={error('email')} onBlur={() => tocar('email')}>
            <Input type="email" placeholder="correo@empresa.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Campo>
          <Campo label="Dirección" required error={error('direccion')} onBlur={() => tocar('direccion')}>
            <Input value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </Campo>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="secondary" size="sm" onClick={limpiar}>
          Limpiar campos
        </Button>
        <Button variant="primary" size="sm" onClick={guardar}>
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
