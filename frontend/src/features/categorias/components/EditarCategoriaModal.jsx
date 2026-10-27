import { Modal } from '@shared/ui'
import { useFormularioCategoria } from '../hooks/useFormularioCategoria'
import FormularioCategoria from './formulario/FormularioCategoria'

export default function EditarCategoriaModal({ open, onClose, onSubmit, categoria }) {
  const { valores, cambiar, reiniciar } = useFormularioCategoria(categoria)

  const handleClose = () => {
    reiniciar()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (valores.nombre.trim()) {
      onSubmit(categoria?.id, {
        nombre: valores.nombre.trim(),
        tipo: valores.tipo,
        estado: valores.estado,
      })
      reiniciar()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Editar categoría" size="md" showDivider>
      <FormularioCategoria
        valores={valores}
        onCambio={cambiar}
        onSubmit={handleSubmit}
        onCancelar={handleClose}
        textoGuardar="Guardar cambios"
      />
    </Modal>
  )
}