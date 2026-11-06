import { Modal } from '@shared/ui'
import { useFormularioCategoria } from '../hooks/useFormularioCategoria'
import FormularioCategoria from './formulario/FormularioCategoria'

export default function EditarCategoriaModal({ open, onClose, onSubmit, categoria }) {
  const { valores, cambiar, reiniciar, validar, tocarUrl } = useFormularioCategoria(categoria)
  const { esValido, errorUrl } = validar()

  const handleClose = () => {
    reiniciar()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validacion = validar()
    if (!validacion.esValido) {
      tocarUrl()
      return
    }
    onSubmit(categoria?.id, {
      nombre: valores.nombre.trim(),
      tipo: valores.tipo,
      estado: valores.estado,
      urlImagen: valores.urlImagen.trim(),
    })
    reiniciar()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Editar categoría" size="md" showDivider>
      <FormularioCategoria
        valores={valores}
        onCambio={cambiar}
        onSubmit={handleSubmit}
        onCancelar={handleClose}
        textoGuardar="Guardar cambios"
        esValido={esValido}
        errorUrl={errorUrl}
        onTocarUrl={tocarUrl}
      />
    </Modal>
  )
}
