# Clientes por establecimiento

30/10/2026 · Aclaración expresa de Víctor. Esta nota sustituye la propuesta de vista del consumidor dentro de la aplicación y la búsqueda basada solo en código de tarjeta.

## Confirmado

- El consumidor no tiene vista, panel ni cuenta de uso cotidiano en la app. Consulta su tarjeta digital y sus sellos en Apple Wallet o Google Wallet. Las integraciones reales de ambos Wallet siguen pendientes; no presentar el laboratorio como un Wallet funcional.
- Dueño y camarero buscan clientes de su establecimiento por nombre o número de teléfono, seleccionan su ficha y operan con sus sellos/premios.
- Ambos pueden editar los datos de la ficha seleccionada, incluido el teléfono. Nombre/móvil obligatorios y cumpleaños día/mes opcional siguen vigentes. No se añaden campos innecesarios.
- El teléfono identifica al cliente dentro del establecimiento y no puede compartirlo con otra ficha de ese mismo local. Comprobar antes de guardar y hacer cumplir la unicidad en base de datos.
- El mismo número puede pertenecer a clientes de otros establecimientos, cada uno con su propia ficha, tarjeta, sellos, premios e historial. Un cambio en un local no modifica los datos de otro.

## Implementado localmente

Retirados selector «Cliente Alex», vista de consumidor y ruta `/tarjeta/[merchantId]`. Proyección operativa SQL accesible únicamente por personal con pertenencia activa; también se revoca el acceso directo al helper anterior. El alta/verificación y futura emisión/recuperación del pase son recorridos puntuales separados, aún pendientes, y no un área de cliente.

Buscador por nombre o teléfono con espera breve al escribir y máximo 20 resultados del comercio autenticado. Dos caracteres para nombres; teléfonos desde tres cifras. No interpreta `%`/`_` como comodines. Admite nombres sin acento para encontrar su variante acentuada. El personal ya tiene acceso a nombre y teléfono de sus clientes, autorizado por esta aclaración; no se extiende a otras pertenencias/comercios ni a listados globales.

Ficha: nombre, teléfono y cumpleaños día/mes. Número normalizado: nueve cifras sin prefijo se interpretan como España (+34); se aceptan +prefijo, 00prefijo y separadores habituales. Es validación de formato, no una prueba de titularidad o de que el número exista.

Unicidad `(merchant_id, phone)` para todas las fichas, incluidas las inactivas; no se sobrescribe ni fusiona automáticamente una ficha existente. Comprobación previa y constraint único protegen también la escritura competidora. Se admite el mismo número de la ficha que se está editando. Versión de ficha evita que una edición antigua pise cambios guardados por otro empleado.

Se conserva un UUID interno estable para relaciones y tarjeta; el teléfono sigue siendo la referencia de búsqueda/identificación del negocio. Cambiarlo no mueve sellos, premios ni historial. La vinculación a Auth es solo evidencia de verificación, no un perfil global de cliente compartido. Editar un número no cambia Auth ni fichas de otros establecimientos; su nueva titularidad queda sin verificar, sin bloquear el guardado ni regalar permisos de acceso. La verificación y futura mensajería deberán usar esa condición; no existe todavía envío real.

Cambios auditados con comercio, actor, ficha y campos modificados, sin copiar los valores de contacto al log. SQL acotado/RLS y sin escritura directa desde navegador. Migración nueva `20261030122842_customer_phone_directory.sql`; el laboratorio aplica esta evolución sobre el dataset ficticio existente sin reiniciarlo.

## Evidencia y pendientes

28 comprobaciones automáticas contando subcasos: se mantienen reglas de fidelización y se añaden búsqueda/edición, formatos/duplicados, versiones, cumpleaños, aislamiento y mismo teléfono en dos negocios; actualización de la base anterior con su historial conservado. Tipos y build superados. Navegador: búsqueda por nombre y teléfono, selección, edición como camarero, duplicado rechazado sin guardar, propio teléfono permitido, acceso del dueño y ausencia de vista de cliente.

No se han probado dos sesiones concurrentes PostgreSQL reales, Auth/PostgREST alojados, teléfonos reales ni Wallet/WhatsApp. Supabase sigue sin crear por aplazamiento de su coste. Próximo bloque: alta/verificación y emisión/actualización de pases Wallet, más identificación QR/NFC y conexiones autorizadas. Historial y gestión de premios permanecen en el panel profesional.
