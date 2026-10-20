import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Button, Input, Modal, Select } from '@shared/ui'
import { categoriaOptions, estadoDotColor } from '../constants/compras.constants'
import { opcionesEstadoParaFila, opcionesProveedor, recalcularTotal } from '../utils/comprasHelpers'
import { Campo } from './Campo'

const COLUMNAS_ITEM = 'repeat(4, 1fr)'

// El formulario se monta cada vez que el modal abre, así parte siempre de la orden actual.
function EditarCompraForm({ compra, proveedores, onGuardar, onClose }) {
  const [proveedorId, setProveedorId] = useState(compra.proveedorId)
  const [categoria, setCategoria] = useState(compra.categoria)
  const [estado, setEstado] = useState(compra.estado)
  const [solicitante, setSolicitante] = useState(compra.solicitante)
  const [notas, setNotas] = useState(compra.notas)
  const [detalle, setDetalle] = useState(() => compra.detalle.map((d) => ({ ...d })))

  const cambiarDetalle = (idx, campo, valor) =>
    setDetalle((prev) => prev.map((d, i) => (i === idx ? { ...d, [campo]: valor } : d)))

  const numero = (texto, minimo) => Math.max(minimo, parseInt(texto, 10) || minimo)

  const guardar = () => {
    const editada = { ...compra, proveedorId, categoria, estado, solicitante, notas, detalle }
    onGuardar({ ...editada, total: recalcularTotal(editada) })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Campo label="Proveedor">
          <Select options={opcionesProveedor(proveedores)} value={proveedorId} onChange={(e) => setProveedorId(e.target.value)} />
        </Campo>
        <Campo label="Categoría">
          <Select options={categoriaOptions} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </Campo>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Campo label="Estado">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, bgcolor: estadoDotColor[estado] }} />
            <Select options={opcionesEstadoParaFila(compra.estado)} value={estado} onChange={(e) => setEstado(e.target.value)} />
          </Box>
        </Campo>
        <Campo label="Solicitante">
          <Input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
        </Campo>
      </Box>

      <Campo label="Ítems">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {detalle.map((item, idx) => (
            <Box key={item.lote} sx={{ display: 'grid', gridTemplateColumns: COLUMNAS_ITEM, gap: 1 }}>
              <Input placeholder="Insumo" value={item.nombre} onChange={(e) => cambiarDetalle(idx, 'nombre', e.target.value)} />
              <Input
                type="number"
                min={1}
                placeholder="Cant."
                value={item.cantidad}
                onChange={(e) => cambiarDetalle(idx, 'cantidad', numero(e.target.value, 1))}
              />
              <Input placeholder="Unidad" value={item.unidad} onChange={(e) => cambiarDetalle(idx, 'unidad', e.target.value)} />
              <Input
                type="number"
                min={0}
                placeholder="Subtotal ($)"
                value={item.subtotal}
                onChange={(e) => cambiarDetalle(idx, 'subtotal', numero(e.target.value, 0))}
              />
            </Box>
          ))}
        </Box>
      </Campo>

      <Campo label="Observaciones">
        <Box
          component="textarea"
          rows={2}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas internas…"
          sx={{
            width: '100%',
            p: 1.25,
            typography: 'body1',
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.alt',
            outline: 'none',
            resize: 'none',
            color: 'text.primary',
            '&:hover': { borderColor: 'primary.main' },
            '&:focus': { borderColor: 'primary.main' },
          }}
        />
      </Campo>

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', pt: 1 }}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button size="sm" onClick={guardar}>
          Guardar cambios
        </Button>
      </Stack>
    </Box>
  )
}

export function EditarCompraModal({ open, compra, proveedores, onClose, onGuardar }) {
  return (
    <Modal open={open} onClose={onClose} title={`Editar orden ${compra?.id ?? ''}`} size="md" showDivider>
      {compra && <EditarCompraForm compra={compra} proveedores={proveedores} onGuardar={onGuardar} onClose={onClose} />}
    </Modal>
  )
}
