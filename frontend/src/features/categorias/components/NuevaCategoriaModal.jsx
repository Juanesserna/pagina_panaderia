import { Modal } from '@shared/ui'
import { useFormularioCategoria } from '../hooks/useFormularioCategoria'
import FormularioCategoria from './formulario/FormularioCategoria'

export default function NuevaCategoriaModal({ open, onClose, onSubmit }) {
  const { valores, cambiar, reiniciar } = useFormularioCategoria()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (valores.nombre.trim()) {
      onSubmit({ nombre: valores.nombre.trim(), tipo: valores.tipo, estado: valores.estado })
      reiniciar()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva categoría" size="md" showDivider>
      <FormularioCategoria
        valores={valores}
        onCambio={cambiar}
        onSubmit={handleSubmit}
        onCancelar={onClose}
        textoGuardar="Crear categoría"
      />
    </Modal>
  )
}