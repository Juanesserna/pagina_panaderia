import { Stack, Box } from '@mui/material'
import { Select } from '@features/produccion/components/Select'
import { Input } from '@features/produccion/components/Input'
import { Button } from '@features/produccion/components/Button'
import { Campo } from './Campo'

export function FiltrosProveedoresPanel({ filtrosActivos, onChange, onLimpiar }) {
  const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value })

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{
        px: 2.5,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.alt',
        gap: 3.5,
        columnGap: 3.5,
        rowGap: 2,
      }}
    >
      <Campo label="Estado">
        <Box sx={{ width: 144 }}>
          <Select
            options={[
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
            value={filtrosActivos.estado}
            onChange={set('estado')}
          />
        </Box>
      </Campo>

      <Campo label="Empresa">
        <Box sx={{ width: 176 }}>
          <Input placeholder="Buscar empresa…" value={filtrosActivos.nombre} onChange={set('nombre')} />
        </Box>
      </Campo>

      <Campo label="NIT">
        <Box sx={{ width: 144 }}>
          <Input placeholder="Buscar NIT…" value={filtrosActivos.nit} onChange={set('nit')} />
        </Box>
      </Campo>

      <Campo label="Contacto">
        <Box sx={{ width: 176 }}>
          <Input placeholder="Nombre contacto…" value={filtrosActivos.nombreContacto} onChange={set('nombreContacto')} />
        </Box>
      </Campo>

      <Campo label="Correo">
        <Box sx={{ width: 192 }}>
          <Input type="email" placeholder="correo@empresa.com" value={filtrosActivos.email} onChange={set('email')} />
        </Box>
      </Campo>

      <Button variant="ghost" size="sm" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </Stack>
  )
}
