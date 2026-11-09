import { Modal } from '@shared/ui'
import { useFormularioCategoria } from '../hooks/useFormularioCategoria'
import FormularioCategoria from './formulario/FormularioCategoria'

export default function NuevaCategoriaModal({ open, onClose, onSubmit }) {
  const { valores, cambiar, reiniciar, validar, tocarUrl } = useFormularioCategoria()
  const { esValido, errorUrl } = validar()

  const handleSubmit = (e) => {
    e.preventDefault()
    const validacion = validar()
    if (!validacion.esValido) {
      tocarUrl()
      return
    }
    onSubmit({
      nombre: valores.nombre.trim(),
      tipo: valores.tipo,
      estado: valores.estado,
      urlImagen: valores.urlImagen.trim(),
    })
    reiniciar()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva categoría" size="md" showDivider>
      <FormularioCategoria
        valores={valores}
        onCambio={cambiar}
        onSubmit={handleSubmit}
        onCancelar={onClose}
        textoGuardar="Crear categoría"
        esValido={esValido}
        errorUrl={errorUrl}
        onTocarUrl={tocarUrl}
      />
    </Modal>
  )
}
