import { Box, Stack } from '@mui/material'
import { Button, Input, Select } from '@shared/ui'
import { estadoOptions } from '../constants/proveedores.constants'
import { Campo } from './Campo'

/**
 * Filtros en línea, debajo del toolbar de la tabla.
 * Aplica en vivo: cada cambio actualiza filtrosActivos directamente,
 * sin botón "Aplicar" intermedio.
 */
export function FiltrosProveedoresPanel({ filtrosActivos, onChange, onLimpiar }) {
  const set = (campo) => (e) => onChange({ ...filtrosActivos, [campo]: e.target.value })

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{ gap: 2.5, px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
    >
      <Box sx={{ flex: '1 1 130px', minWidth: 110 }}>
        <Campo label="Estado">
          <Select
            options={[{ value: '', label: 'Todos' }, ...estadoOptions]}
            value={filtrosActivos.estado}
            onChange={set('estado')}
          />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 170px', minWidth: 140 }}>
        <Campo label="Empresa">
          <Input placeholder="Buscar empresa…" value={filtrosActivos.nombre} onChange={set('nombre')} />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 150px', minWidth: 120 }}>
        <Campo label="NIT">
          <Input placeholder="Buscar NIT…" value={filtrosActivos.nit} onChange={set('nit')} />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 170px', minWidth: 140 }}>
        <Campo label="Contacto">
          <Input placeholder="Nombre contacto…" value={filtrosActivos.nombreContacto} onChange={set('nombreContacto')} />
        </Campo>
      </Box>

      <Box sx={{ flex: '1 1 190px', minWidth: 160 }}>
        <Campo label="Correo">
          <Input type="email" placeholder="correo@empresa.com" value={filtrosActivos.email} onChange={set('email')} />
        </Campo>
      </Box>

      <Button variant="ghost" size="sm" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </Stack>
  )
}
