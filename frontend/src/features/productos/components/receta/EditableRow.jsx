import { useState } from 'react'
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { IconCheck, IconX } from '@tabler/icons-react'
import { CELL_SX } from '../comunes/tablaEstilos'
import SelectorReceta from './SelectorReceta'

// MUI puede entregar el elemento hijo en vez del valor: toma el valor real
const valorSeleccionado = (value) =>
  value && typeof value === 'object' && 'props' in value ? value.props.value : value

// Fila editable: sirve para agregar un insumo nuevo o editar uno existente.
// "insumosUsados" son los ids de insumos que ya están en la receta (no se pueden repetir).
export default function EditableRow({
  fila,
  onChange,
  onConfirm,
  onCancel,
  insumosCatalogo,
  unidadesMedida,
  loading,
  showActions,
  isNew,
  insumosUsados = [],
}) {
  const theme = useTheme()
  // La cantidad solo muestra error después de salir del campo
  const [cantidadTocada, setCantidadTocada] = useState(false)

  // Al elegir un insumo guarda su id y nombre, y autocompleta su unidad por defecto (editable)
  const handleInsumoChange = (event, value) => {
    const insumoId = String(valorSeleccionado(value))
    const insumoSeleccionado = insumosCatalogo.find((i) => String(i.id) === insumoId)
    if (!insumoSeleccionado) {
      onChange('insumoId', '')
      onChange('insumoNombre', '')
      return
    }
    onChange('insumoId', insumoSeleccionado.id)
    onChange('insumoNombre', insumoSeleccionado.nombre)
    if (insumoSeleccionado.idUnidadMedida) {
      const unidad = unidadesMedida.find(
        (u) => String(u.id) === String(insumoSeleccionado.idUnidadMedida)
      )
      if (unidad) {
        onChange('unidadId', String(unidad.id))
        onChange('unidadNombre', unidad.abreviatura)
      }
    }
  }

  // Al elegir una unidad guarda su id y su abreviatura
  const handleUnidadChange = (event, value) => {
    const unidadId = String(valorSeleccionado(value))
    const unidad = unidadesMedida.find((u) => String(u.id) === unidadId)
    if (unidad) {
      onChange('unidadId', String(unidad.id))
      onChange('unidadNombre', unidad.abreviatura)
    }
  }

  // Solo acepta vacío o un número positivo (sin signo negativo)
  const handleCantidadChange = (e) => {
    const { value } = e.target
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange('cantidad', value)
    }
  }

  const cantidadValida = Number(fila.cantidad) > 0
  const esDuplicado = insumosUsados.includes(String(fila.insumoId))
  // La fila es válida si hay insumo (no repetido), unidad y una cantidad mayor que cero
  const isValid =
    Boolean(fila.insumoId) && Boolean(fila.unidadId) && cantidadValida && !esDuplicado
  const mostrarErrorCantidad = Boolean(fila.unidadId) && cantidadTocada && !cantidadValida

  const opcionesInsumo = insumosCatalogo.map((i) => ({
    value: String(i.id),
    etiqueta: i.nombre,
    disabled: insumosUsados.includes(String(i.id)),
  }))
  // Si el insumo de la fila ya no está activo, se muestra igual para no dejar el selector vacío
  if (
    !loading &&
    fila.insumoId &&
    !opcionesInsumo.some((o) => o.value === String(fila.insumoId))
  ) {
    opcionesInsumo.unshift({
      value: String(fila.insumoId),
      etiqueta: `${fila.insumoNombre || fila.insumoId} (inactivo)`,
      disabled: false,
    })
  }
  const opcionesUnidad = unidadesMedida.map((u) => ({
    value: String(u.id),
    etiqueta: `${u.nombre} (${u.abreviatura})`,
    disabled: false,
  }))

  return (
    <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
      {/* Id (o NUEVO si es fila nueva sin id) */}
      <TableCell sx={CELL_SX}>
        <Typography variant="subtitle1" component="p" sx={{ color: theme.palette.text.primary }}>
          {isNew ? (fila.idTemp || 'NUEVO') : fila.id}
        </Typography>
      </TableCell>
      {/* Selector de insumo (los ya usados salen deshabilitados) */}
      <TableCell sx={CELL_SX}>
        <SelectorReceta
          valor={String(fila.insumoId || '')}
          onChange={handleInsumoChange}
          opciones={opcionesInsumo}
          placeholder="Seleccionar insumo"
          minWidth={200}
          disabled={loading}
          cargando={loading}
        />
      </TableCell>
      {/* Selector de unidad de medida (va antes que la cantidad) */}
      <TableCell sx={CELL_SX}>
        <SelectorReceta
          valor={String(fila.unidadId || '')}
          onChange={handleUnidadChange}
          opciones={opcionesUnidad}
          placeholder="Unidad"
          minWidth={120}
          disabled={loading}
        />
      </TableCell>
      {/* Cantidad alineada a la derecha; se habilita al elegir la unidad */}
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <TextField
          size="small"
          type="number"
          value={fila.cantidad || ''}
          onChange={handleCantidadChange}
          onBlur={() => setCantidadTocada(true)}
          variant="outlined"
          disabled={!fila.unidadId}
          title={fila.unidadId ? undefined : 'Elige primero la unidad'}
          placeholder={fila.unidadId ? '0' : '—'}
          error={mostrarErrorCantidad}
          helperText={mostrarErrorCantidad ? 'Debe ser mayor a 0' : ' '}
          inputProps={{ inputMode: 'decimal', min: 0.01, step: '0.01', 'aria-label': 'Cantidad' }}
          sx={{
            width: '100%',
            '& .MuiInputBase-input': { textAlign: 'right' },
          }}
        />
      </TableCell>
      {/* Acciones: confirmar y cancelar */}
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            <IconButton
              size="small"
              onClick={onConfirm}
              disabled={!isValid || loading}
              sx={{
                color: theme.palette.success.main,
                '&:hover': { bgcolor: theme.palette.success.light },
              }}
              aria-label={isNew ? 'Agregar' : 'Confirmar'}
            >
              <IconCheck size={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onCancel}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
              aria-label="Cancelar"
            >
              <IconX size={18} />
            </IconButton>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}
