# SPEC.md — Mejoras y ajustes del módulo de Ventas

## 1. Contexto

**Proyecto:** Al Horno Panadería  
**Módulo:** Ventas  
**Tipo de desarrollo:** Mejoras funcionales, ajustes de interfaz e implementación de seguridad.

Este documento define los requisitos para realizar tres mejoras en el módulo de Ventas del sistema Al Horno Panadería.

La implementación debe realizarse sobre el código existente, respetando la arquitectura, las convenciones y las restricciones establecidas en `AGENTS.md`.

No se debe reconstruir el módulo ni reemplazar funcionalidades existentes que ya se encuentren operativas.

---

## 2. Objetivos

1. Mejorar la información presentada en el listado de ventas, incorporando el nombre del cliente asociado.
2. Mejorar el tamaño y la adaptación del modal de nueva venta, garantizando su compatibilidad con la estructura actualizada de la base de datos.
3. Implementar mecanismos de validación y autorización para garantizar que únicamente los usuarios autorizados puedan anular ventas.

---

# 3. Requerimientos funcionales

## RF01 — Mostrar el nombre del cliente en el listado de ventas

### Descripción

El listado principal de ventas debe incorporar el nombre del cliente asociado a cada registro, permitiendo identificar fácilmente quién realizó cada compra.

### Comportamiento esperado

- El listado debe mostrar el nombre del cliente asociado a cada venta.
- El nombre debe visualizarse junto con los demás datos principales de la venta.
- Se debe mantener la información que actualmente presenta el listado.
- Si no existe información del nombre del cliente, se debe mostrar una identificación alternativa, como el documento del cliente, cuando esté disponible.
- Si tampoco existe una identificación alternativa, se debe mostrar un indicador como "No disponible".
- La información debe corresponder al cliente realmente asociado a cada venta, sin mezclar registros.

### Información esperada en el listado

- Identificador de venta.
- Cliente.
- Fecha de venta.
- Estado.
- Monto total.

### Consideraciones técnicas

- Analizar cómo se relacionan actualmente las entidades Venta y Usuario/Cliente.
- Revisar el repositorio, caso de uso, presenter y servicio que alimentan el listado.
- Si es necesario, adaptar la respuesta del backend para proporcionar la información del cliente.
- Evitar realizar consultas individuales por cada venta (problema N+1).
- No duplicar información que ya pueda obtenerse mediante las relaciones existentes.
- Mantener compatibilidad con los filtros, búsqueda y paginación actuales.

---

## RF02 — Modificación del modal de nueva venta

### Descripción

Modificar las dimensiones y la estructura del modal de creación de ventas para mejorar la visualización de la información y garantizar que los campos del formulario correspondan con la estructura actualizada de la base de datos.

### Comportamiento esperado

**A. Ajuste de dimensiones**

- Incrementar el tamaño del modal actual.
- Proporcionar un espacio de trabajo más amplio para visualizar los campos y la información relacionada con la venta.
- Evitar que los campos, selectores, tablas o botones queden comprimidos.
- Garantizar que el modal se adapte correctamente a diferentes resoluciones de pantalla.
- En resoluciones pequeñas, permitir desplazamiento interno cuando sea necesario, evitando que el modal exceda el espacio disponible.

**B. Adaptación a la estructura de datos**

- Inspeccionar la estructura actual de las tablas relacionadas con las ventas.
- Identificar los cambios realizados en los campos de las tablas y sus relaciones.
- Adaptar los campos del formulario a la estructura vigente.
- Actualizar los nombres, tipos de datos, validaciones y valores enviados al backend cuando corresponda.
- Garantizar que los productos, cantidades y demás datos relacionados se registren correctamente.
- Evitar enviar propiedades obsoletas o incompatibles con el modelo actual.

**C. Integridad de la información**

- Mantener las validaciones actuales que continúen siendo aplicables.
- Evitar registros incompletos o inconsistentes.
- Garantizar que la información enviada por el frontend corresponda con el esquema de validación del backend.
- Mantener el funcionamiento de los cálculos y procesos asociados a la creación de ventas.

### Consideraciones técnicas

- Revisar el componente actual del modal.
- Revisar sus hooks y servicios asociados.
- Inspeccionar los esquemas Zod y casos de uso relacionados con la creación de ventas.
- Revisar las entidades y repositorios correspondientes.
- Utilizar exclusivamente los componentes compartidos de `@shared/ui` para los elementos base.
- Mantener la separación entre presentación, estado y lógica de negocio.
- No modificar la estructura de la base de datos por iniciativa propia: primero identificar los cambios que ya existen y adaptar el sistema a ellos.

---

## RF03 — Implementar medidas de seguridad para la anulación de ventas

### Descripción

Implementar un mecanismo de seguridad que garantice que únicamente los usuarios con rol `admin` puedan anular ventas. Antes de ejecutar la operación, el sistema deberá solicitar la contraseña del administrador autenticado y validar su identidad.

### A. Restricción por roles

- Únicamente los usuarios con rol `admin` podrán anular ventas.
- Los usuarios con rol `vendedor`, `panadero` o `cliente` no podrán realizar esta operación.
- La autorización debe verificarse obligatoriamente en el backend.
- Ocultar o deshabilitar la opción de anulación para usuarios no autorizados en el frontend.
- No confiar exclusivamente en las restricciones visuales del frontend.

### B. Validación mediante contraseña

Cuando un administrador intente anular una venta:

1. El sistema debe mostrar un modal de seguridad.
2. El modal debe solicitar la contraseña de la cuenta del administrador autenticado.
3. La contraseña debe enviarse al backend mediante una comunicación segura.
4. El backend debe verificarla utilizando el mecanismo de hashing existente (`bcryptjs`) y el hash almacenado para ese usuario.
5. La validación debe realizarse sobre la identidad autenticada mediante JWT, sin confiar en identificadores enviados por el frontend.
6. Si la contraseña es incorrecta, se debe rechazar la operación y mostrar un mensaje de error.
7. La contraseña no debe almacenarse en texto plano, registrarse en logs ni persistirse en el sistema.

### C. Confirmación de anulación

Una vez validada correctamente la contraseña:

1. El sistema debe solicitar una confirmación explícita de la anulación.
2. Si el administrador cancela, la venta debe conservar su estado anterior.
3. Si confirma, el backend debe ejecutar la operación de anulación.
4. El estado de la venta debe actualizarse a `Anulado`.
5. El frontend debe reflejar el nuevo estado y mostrar una notificación de éxito.

### D. Manejo de errores y seguridad

- Usuario sin rol `admin`: operación rechazada.
- Contraseña incorrecta: operación rechazada.
- Sesión inválida o expirada: operación rechazada.
- Error durante la operación: conservar el estado anterior.
- Cancelación de la confirmación: no ejecutar cambios.
- No permitir transiciones de estado inválidas.
- Evitar intentos ilimitados de validación de contraseña; aplicar medidas de limitación de intentos cuando corresponda.
- La validación de contraseña y la anulación deben ejecutarse en el backend.
- La operación debe garantizar que una venta no quede parcialmente modificada.

### E. Criterios de aceptación adicionales

- [ ] Solo los administradores pueden visualizar y ejecutar la acción de anulación.
- [ ] Un usuario que no sea administrador no puede anular mediante solicitudes directas a la API.
- [ ] El sistema solicita la contraseña antes de permitir continuar.
- [ ] La contraseña se valida contra la cuenta del administrador autenticado.
- [ ] Una contraseña incorrecta impide la operación.
- [ ] Una contraseña correcta permite continuar con la confirmación.
- [ ] Cancelar la confirmación conserva el estado original.
- [ ] Confirmar la operación actualiza el estado a `Anulado`.
- [ ] Ningún error de autorización o validación modifica el estado de la venta.

### Consideraciones técnicas

- Revisar el middleware `auth.middleware.js`.
- Revisar el caso de uso responsable de actualizar el estado de las ventas.
- Revisar las transiciones de estado permitidas en la entidad `Venta`.
- Revisar el enrutador `ventas.routes.js`.
- Implementar la autorización en el backend utilizando las convenciones existentes.
- Mantener la separación entre reglas de dominio, casos de uso e infraestructura.
- Evitar implementar la seguridad exclusivamente mediante condiciones en componentes React.
- Respetar el manejador centralizado de errores.
- Evitar que la operación permita transiciones de estado inválidas.

---

# 4. Reglas de negocio y restricciones

1. Una venta debe conservar su relación con el cliente correspondiente.
2. La ausencia del nombre del cliente no debe impedir la visualización del registro de venta.
3. El formulario de nueva venta debe utilizar la estructura vigente de los datos.
4. No se deben introducir campos ficticios ni propiedades que no existan en el modelo actual.
5. Únicamente los usuarios autorizados pueden anular ventas.
6. Una operación de anulación no debe modificar el estado si falla la validación de permisos.
7. La anulación debe respetar las transiciones de estado permitidas por el dominio.
8. El frontend no constituye un mecanismo suficiente de seguridad.
9. Las funcionalidades existentes de ventas deben continuar operativas.

---

# 5. Criterios de aceptación

## CA01 — Listado de ventas

- [ ] Cada venta muestra el nombre del cliente asociado.
- [ ] Se visualizan correctamente los demás datos principales.
- [ ] Cuando falta el nombre, se muestra una identificación alternativa si existe.
- [ ] Cuando no existe información identificable, se muestra "No disponible".
- [ ] Los filtros y la paginación siguen funcionando correctamente.
- [ ] La información corresponde al cliente correcto.

## CA02 — Modal de nueva venta

- [ ] El modal presenta dimensiones mayores a las actuales.
- [ ] Los campos se visualizan correctamente.
- [ ] El modal se adapta a diferentes resoluciones.
- [ ] Los campos corresponden con la estructura actualizada de los datos.
- [ ] Las validaciones del formulario funcionan correctamente.
- [ ] La creación de ventas continúa funcionando.
- [ ] Los datos enviados al backend son compatibles con sus esquemas de validación.

## CA03 — Seguridad de anulación

- [ ] El sistema solicita confirmación antes de anular una venta.
- [ ] Se valida la autorización del usuario en el backend.
- [ ] Un usuario autorizado puede completar la anulación.
- [ ] Un usuario no autorizado no puede anular la venta.
- [ ] Una solicitud no autorizada no modifica el estado.
- [ ] Si el usuario cancela la operación, se conserva el estado anterior.
- [ ] Si la operación es exitosa, el estado cambia a `Anulado`.
- [ ] Se muestran mensajes adecuados de éxito y error.
- [ ] No se permiten transiciones de estado inválidas.

---

# 6. Requisitos no funcionales

- Mantener la arquitectura actual del frontend y backend.
- Mantener la compatibilidad con React 19, Material UI 9 y Node.js.
- Respetar las convenciones de `AGENTS.md`.
- Reutilizar componentes y servicios existentes.
- Mantener la compatibilidad con el tema claro y oscuro.
- No introducir dependencias adicionales sin justificación.
- Mantener la seguridad y consistencia de los datos.
- Evitar duplicación de código y lógica de negocio.
- Mantener un código legible, modular y mantenible.

---

# 7. Estrategia de implementación

La implementación debe realizarse por etapas:

### Etapa 1. Análisis

- Inspeccionar el módulo de Ventas en frontend y backend.
- Identificar los componentes, hooks, servicios y casos de uso involucrados.
- Revisar las entidades y relaciones de datos.
- Identificar los cambios actuales en los campos de las tablas relacionadas.
- Identificar el mecanismo de autorización existente.

### Etapa 2. Planificación

- Definir los archivos que requieren modificaciones.
- Identificar las modificaciones necesarias en frontend y backend.
- Identificar posibles impactos sobre funcionalidades existentes.
- Definir las pruebas necesarias para cada requerimiento.

### Etapa 3. Implementación

Desarrollar los requerimientos de manera independiente y ordenada:

1. Incorporación del nombre del cliente en el listado.
2. Modificación del modal de nueva venta.
3. Implementación de seguridad para la anulación de ventas.

### Etapa 4. Validación

- Ejecutar las pruebas automatizadas del backend.
- Ejecutar las validaciones de ESLint.
- Ejecutar la compilación del frontend.
- Validar los criterios de aceptación.
- Comprobar que no se hayan afectado funcionalidades existentes.

---

# 8. Restricciones para el agente de IA

- No comenzar a modificar código sin realizar primero el análisis.
- No asumir que la documentación refleja necesariamente el estado más reciente del código.
- Verificar la implementación real antes de proponer cambios.
- No modificar módulos ajenos a Ventas, salvo que sea estrictamente necesario.
- No alterar la arquitectura para resolver problemas puntuales.
- No reemplazar funcionalidades existentes por implementaciones simplificadas.
- No modificar la base de datos ni sus estructuras sin identificar previamente las modificaciones existentes y justificar cualquier cambio adicional.
- No inventar relaciones, campos, permisos o reglas de negocio.
- Si algún requisito presenta ambigüedad, solicitar aclaración antes de implementarlo.
- Presentar un plan técnico con los archivos que se modificarán antes de comenzar el desarrollo.
- Esperar aprobación del plan de implementación.

**Resultado esperado:** Un módulo de Ventas con información más completa, un formulario de creación adaptado a la estructura vigente y un proceso de anulación seguro, manteniendo la integridad y estabilidad del sistema Al Horno Panadería.