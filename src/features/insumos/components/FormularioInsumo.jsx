import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Input, Select, Button, Modal, ModalFooter, FormField } from '@shared/components'
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

const seccionTituloSx = { fontSize: 14, fontWeight: 700, color: 'text.primary' }
const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

function CuerpoFormulario({ modo, insumo, onGuardar, onCancelar }) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ fontSize: 12, color: 'text.dim', mt: -1 }}>
        {modo === 'editar' ? `Modificando: ${insumo?.nombre}` : 'Registrar nuevo insumo en el sistema'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={seccionTituloSx}>Información general</Typography>
        <Box sx={gridSx}>
          <FormField label="Código">
            <Input
              disabled
              value={modo === 'editar' && insumo ? formatoCodigo(insumo.id) : 'Se asigna al guardar'}
              onChange={() => { }}
              sx={{
                bgcolor: 'transparent',
                '&.Mui-disabled': { bgcolor: 'transparent' },
                '& .MuiOutlinedInput-notchedOutline': { borderStyle: 'dashed' },
                '& .MuiOutlinedInput-input.Mui-disabled': {
                  WebkitTextFillColor: 'currentColor',
                  color: 'text.dim',
                },
              }}
            />
          </FormField>
          <FormField label="Estado">
            <Select
              options={[
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' },
              ]}
              value={form.estado ? 'true' : 'false'}
              onChange={(e) => set('estado', e.target.value === 'true')}
            />
          </FormField>

          <FormField label="Nombre del insumo" required sx={anchoCompletoSx}>
            <Input
              placeholder="Ej: Harina de trigo fortificada"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
            />
          </FormField>

          <FormField label="Categoría" required sx={anchoCompletoSx}>
            <Select
              options={[
                { value: '', label: 'Seleccionar categoría…' },
                ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
              ]}
              value={form.idCategoria}
              onChange={(e) => set('idCategoria', e.target.value ? Number(e.target.value) : '')}
            />
          </FormField>

          <FormField label="Descripción" sx={anchoCompletoSx}>
            <Input
              placeholder="Descripción del insumo…"
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
            />
          </FormField>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={seccionTituloSx}>Inventario</Typography>
        <Box sx={gridSx}>
          <FormField label="Unidad de medida" required>
            <Select
              options={[
                { value: '', label: 'Seleccionar unidad…' },
                ...unidades.map((u) => ({ value: u.id, label: u.abreviatura })),
              ]}
              value={form.idUnidadMedida}
              onChange={(e) => set('idUnidadMedida', e.target.value ? Number(e.target.value) : '')}
            />
          </FormField>
          <FormField label="Stock mínimo" required>
            <Input type="number" min={0} value={form.stockMinimo} onChange={(e) => set('stockMinimo', e.target.value)} />
          </FormField>
        </Box>

        {modo === 'editar' && insumo && (
          <Typography sx={{ fontSize: 12, color: 'text.dim' }}>
            Stock actual: <strong>{insumo.stockActual} {unidadAbrev(insumo.idUnidadMedida)}</strong> y costo promedio{' '}
            <strong>{formatoMoneda(insumo.costoPromedio)}</strong> — ambos los recalcula la BD al recibir compras, no se
            editan aquí.
          </Typography>
        )}
      </Box>

      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setForm(formVacio)}>
          Limpiar campos
        </Button>
        <Button variant="primary" size="sm" onClick={() => onGuardar(form)}>
          {modo === 'editar' ? 'Actualizar insumo' : 'Guardar insumo'}
        </Button>
      </ModalFooter>
    </Box>
  )
}

/**
 * Formulario de insumo como modal flotante sobre la lista.
 * `open` controla la visibilidad; el estado interno se reinicia cada vez que se cierra.
 */
export function FormularioInsumo({ open, modo, insumo, onGuardar, onCancelar }) {
  return (
    <Modal open={open} onClose={onCancelar} title={modo === 'editar' ? 'Editar insumo' : 'Nuevo insumo'} size="lg">
      <CuerpoFormulario key={`${modo}-${insumo?.id ?? 'nuevo'}`} modo={modo} insumo={insumo} onGuardar={onGuardar} onCancelar={onCancelar} />
    </Modal>
  )
}
