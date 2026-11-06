import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button, Input, Modal, Select } from '@shared/ui'
import { estadoOptions, formVacio } from '../constants/insumos.constants'
import { getCategorias, getUnidadesMedida } from '../services/insumosService'
import { formatoMoneda, unidadAbrev } from '../utils/insumosHelpers'
import { validarInsumo } from '../utils/insumosValidaciones'
import { Campo } from './Campo'

const gridSx = { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }
const anchoCompletoSx = { gridColumn: { sm: '1 / -1' } }

function CuerpoFormulario({ modo, insumo, onGuardar, onCancelar }) {
  const editando = modo === 'editar'

  // Valores con los que arranca el formulario (los de la BD al editar, vacíos al crear).
  const formInicial = insumo
    ? {
        nombre: insumo.nombre,
        idCategoria: insumo.idCategoria,
        idUnidadMedida: insumo.idUnidadMedida,
        stockMinimo: String(insumo.stockMinimo),
        estado: insumo.estado,
      }
    : formVacio

  const [form, setForm] = useState(formInicial)
  // Un campo se marca "tocado" al escribir, al cambiarlo o al salir de él;
  // al pulsar Guardar se marcan todos. El error solo se ve en campos tocados.
  const [tocados, setTocados] = useState({})
  const [intentoGuardar, setIntentoGuardar] = useState(false)

  const categorias = getCategorias()
  const unidades = getUnidadesMedida()

  const errores = validarInsumo(form, { editando })
  const error = (campo) => (tocados[campo] || intentoGuardar ? errores[campo] ?? '' : '')
  const tocar = (campo) => setTocados((p) => (p[campo] ? p : { ...p, [campo]: true }))
  const set = (campo, valor) => {
    setForm((p) => ({ ...p, [campo]: valor }))
    tocar(campo)
  }

  const reiniciar = () => {
    setForm(formInicial)
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
        {modo === 'editar' ? `Modificando: ${insumo?.nombre}` : 'Registrar nuevo insumo en el sistema'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Información general</Typography>
        <Box sx={gridSx}>
          <Campo label="ID">
            <Input
              disabled
              value={modo === 'editar' && insumo ? String(insumo.id) : 'Se asigna al guardar'}
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

          <Campo label="Nombre del insumo" required error={error('nombre')} onBlur={() => tocar('nombre')} sx={anchoCompletoSx}>
            <Input disabled={editando} placeholder="Ej: Harina de trigo fortificada" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </Campo>

          <Campo label="Categoría" required error={error('idCategoria')} sx={anchoCompletoSx}>
            <Select
              options={[
                { value: '', label: 'Seleccionar categoría…' },
                ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
              ]}
              value={form.idCategoria}
              onChange={(e) => set('idCategoria', e.target.value ? Number(e.target.value) : '')}
            />
          </Campo>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1">Inventario</Typography>
        <Box sx={gridSx}>
          <Campo label="Unidad de medida" required error={error('idUnidadMedida')}>
            {editando ? (
              // Al editar la unidad no se puede cambiar: se muestra en solo lectura.
              <Input disabled value={unidadAbrev(form.idUnidadMedida)} onChange={() => {}} />
            ) : (
              <Select
                options={[
                  { value: '', label: 'Seleccionar unidad…' },
                  ...unidades.map((u) => ({ value: u.id, label: u.abreviatura })),
                ]}
                value={form.idUnidadMedida}
                onChange={(e) => set('idUnidadMedida', e.target.value ? Number(e.target.value) : '')}
              />
            )}
          </Campo>
          <Campo label="Stock mínimo" required error={error('stockMinimo')} onBlur={() => tocar('stockMinimo')}>
            <Input disabled={editando} type="number" min={0} value={form.stockMinimo} onChange={(e) => set('stockMinimo', e.target.value)} />
          </Campo>
        </Box>

        {modo === 'editar' && insumo && (
          <Typography variant="body2" sx={{ color: 'text.dim' }}>
            Stock actual: <b>{insumo.stockActual} {unidadAbrev(insumo.idUnidadMedida)}</b> y costo promedio{' '}
            <b>{formatoMoneda(insumo.costoPromedio)}</b> — ambos los recalcula la BD al recibir compras, no se editan aquí.
          </Typography>
        )}
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="secondary" size="sm" onClick={reiniciar}>
          {editando ? 'Restablecer' : 'Limpiar campos'}
        </Button>
        <Button variant="primary" size="sm" onClick={guardar}>
          {modo === 'editar' ? 'Actualizar insumo' : 'Guardar insumo'}
        </Button>
      </Stack>
    </Box>
  )
}

/**
 * Formulario de insumo como modal flotante sobre la lista.
 * `open` controla la visibilidad; el estado interno se reinicia con la `key`.
 */
export function FormularioInsumo({ open, modo, insumo, onGuardar, onCancelar }) {
  return (
    <Modal open={open} onClose={onCancelar} title={modo === 'editar' ? 'Editar insumo' : 'Nuevo insumo'} size="lg" showDivider>
      <CuerpoFormulario
        key={`${modo}-${insumo?.id ?? 'nuevo'}`}
        modo={modo}
        insumo={insumo}
        onGuardar={onGuardar}
        onCancelar={onCancelar}
      />
    </Modal>
  )
}
