import { useState } from 'react'
import { Box, Stack, Typography, IconButton } from '@mui/material'
import { IconArrowLeft } from '@tabler/icons-react'
import { Input } from '@features/produccion/components/Input'
import { Select } from '@features/produccion/components/Select'
import { Button } from '@features/produccion/components/Button'
import { Campo, dimLabelSx } from './Campo'
import { getCategorias, getUnidadesMedida } from '../services/insumosService'
import { formatoCodigo, formatoMoneda, unidadAbrev } from '../utils/insumosHelpers'

const formVacio = {
  nombre: '',
  descripcion: '',
  idCategoria: '',
  idUnidadMedida: '',
  stockMinimo: '',
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

export function FormularioInsumo({ modo, insumo, onGuardar, onCancelar }) {
  const [form, setForm] = useState(
    insumo
      ? {
          nombre: insumo.nombre,
          descripcion: insumo.descripcion,
          idCategoria: insumo.idCategoria,
          idUnidadMedida: insumo.idUnidadMedida,
          stockMinimo: String(insumo.stockMinimo),
          estado: insumo.estado,
        }
      : formVacio
  )

  const categorias = getCategorias()
  const unidades = getUnidadesMedida()
  const set = (campo, valor) => setForm((p) => ({ ...p, [campo]: valor }))

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconButton onClick={onCancelar} sx={{ color: 'text.secondary' }}>
          <IconArrowLeft size={18} />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
            {modo === 'editar' ? 'Editar insumo' : 'Nuevo insumo'}
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
            {modo === 'editar' ? `Modificando: ${insumo?.nombre}` : 'Registrar nuevo insumo en el sistema'}
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
                  value={modo === 'editar' && insumo ? formatoCodigo(insumo.id) : 'Se asigna al guardar'}
                  onChange={() => {}}
                />
              </Campo>
              <Campo label="Estado">
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

            <Campo label="Nombre del insumo" required>
              <Input
                placeholder="Ej: Harina de trigo fortificada"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
              />
            </Campo>

            <Campo label="Categoría" required>
              <Select
                options={[
                  { value: '', label: 'Seleccionar categoría…' },
                  ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
                ]}
                value={form.idCategoria}
                onChange={(e) => set('idCategoria', e.target.value ? Number(e.target.value) : '')}
              />
            </Campo>

            <Campo label="Descripción">
              <Input
                placeholder="Descripción del insumo…"
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
              />
            </Campo>
          </Box>

          <Box sx={panelSx}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>Inventario</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Unidad de medida" required>
                <Select
                  options={[
                    { value: '', label: 'Seleccionar unidad…' },
                    ...unidades.map((u) => ({ value: u.id, label: u.abreviatura })),
                  ]}
                  value={form.idUnidadMedida}
                  onChange={(e) => set('idUnidadMedida', e.target.value ? Number(e.target.value) : '')}
                />
              </Campo>
              <Campo label="Stock mínimo" required>
                <Input type="number" min={0} value={form.stockMinimo} onChange={(e) => set('stockMinimo', e.target.value)} />
              </Campo>
            </Box>

            {modo === 'editar' && insumo && (
              <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
                Stock actual: <strong>{insumo.stockActual} {unidadAbrev(insumo.idUnidadMedida)}</strong> y costo promedio{' '}
                <strong>{formatoMoneda(insumo.costoPromedio)}</strong> — ambos los recalcula la BD al recibir compras, no se
                editan aquí.
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography sx={dimLabelSx}>Acciones</Typography>
          <Button variant="primary" size="sm" onClick={() => onGuardar(form)}>
            {modo === 'editar' ? 'Actualizar insumo' : 'Guardar insumo'}
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
