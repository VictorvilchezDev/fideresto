# Seguridad desde el inicio

## Confirmado y procedencia

Víctor exige adoptar el método de trabajo de seguridad de Nexo desde el comienzo. Se reutilizan principios y lecciones, no credenciales, permisos operativos, infraestructura ni afirmaciones de seguridad de otra aplicación.

**Estado real:** primera base local implementada. Sesión profesional validada en servidor, acceso por pertenencia/rol, RLS y privilegios de columna para configuración/NFC, funciones administrativas acotadas y auditoría de cambios. Pruebas SQL locales con PGlite y usuarios ficticios superadas. Supabase alojado no creado; no se ha probado autenticación real ni producción. Los controles transaccionales de sellos/canjes ya están implementados y probados localmente; ver el avance del núcleo al final. MFA, comunicaciones, backups, carga y concurrencia multisesión real siguen pendientes. La tabla siguiente conserva el diseño previsto del producto completo.

## Activos y límites de confianza

Clientes y datos de contacto; identidad de empleados y propietarios; visitas, sellos y recompensas; consentimientos y bajas; costes de mensajería; claves de Wallet e integraciones; información de cada comercio.

Tratar navegador, QR/NFC públicos y mensajes externos como entradas no confiables. Separar clientes, empleados, propietarios, comercios, aplicación, proveedor de mensajes y servidor.

Ronda 1: las imágenes de tarjeta configurables por comercio añaden una entrada de archivos que validar y limitar (formato real, dimensiones, tamaño y renderizado sin contenido activo). Las transiciones de premios estacionales requieren conservar reglas e historial según el acuerdo aún pendiente, sin alterar retroactivamente operaciones. Las plantillas ampliables no eliminan permisos, controles del proveedor, consentimiento, bajas ni límites de gasto.

## Riesgos y controles propuestos

| Riesgo | Diseño previsto | Evidencia que habrá que obtener |
| --- | --- | --- |
| Acceso a datos o acciones de otro comercio | Autorización y ámbito comprobados por servidor; consultas y relaciones acotadas | Pruebas negativas entre dos comercios para lectura, modificación y exportación |
| Sellos añadidos por un enlace público | Validación por personal autenticado; el alta pública no autoriza visitas | Intentos desde QR público y cuenta de cliente rechazados |
| Canjes duplicados o carreras | Operaciones transaccionales e idempotentes, reglas de integridad | Reintentos y dos canjes concurrentes consumen una recompensa una sola vez |
| Robo de sesiones o abuso de acceso | Autenticación, recuperación, caducidad/revocación y límites; sesiones protegidas | Pruebas de acceso, expiración, revocación y protección de acciones sensibles |
| Uso indebido de datos y comunicaciones | Datos mínimos, permisos, consentimiento/baja y acceso acotado | Baja efectiva y ausencia de envíos a destinatarios no habilitados |
| Facturas o carga descontrolada | Presupuestos por comercio/identidad, colas y salidas acotadas, cancelación real | Comprobaciones locales de límites, reintentos y trabajos cancelados |
| Exposición de secretos o contenido inyectado | Secretos en servidor, validación y renderizado seguro; logs minimizados | Revisión de paquetes, configuración y registros sin credenciales/datos innecesarios |
| Daño a otros servicios del servidor | Cuenta y recursos propios, mínimos privilegios y separación de entornos | Verificación específica del alojamiento elegido |
| Pérdida de datos o claves | Copias consistentes y recuperación probada de datos/configuración/claves | Restauración ensayada en un entorno independiente |

## Lecciones de Nexo aplicables

- Revisar primero, priorizar hallazgos y conservar evidencia reproducible.
- Comprobar permisos en backend; ocultar botones no es protección suficiente.
- Limitar coste del trabajo real, no solo número de peticiones o tamaño del JSON.
- Cancelar o acotar trabajos y colas; cerrar una conexión no demuestra que el trabajo haya terminado.
- Separar runtime, migraciones y administración; evitar permisos globales innecesarios.
- Distinguir pruebas locales, revisión de configuración y comprobaciones reales del despliegue.
- Mantener histórico de correcciones y límites; no afirmar blindaje absoluto.

## Pendientes antes de un piloto real

Modelo de amenazas detallado; matriz de permisos; política de datos/consentimiento/retención para España; autenticación y recuperación; arquitectura de aislamiento; elección de alojamiento; costes/plantillas de WhatsApp; gestión de claves de Wallet; copias y recuperación.

Revisar las reglas vigentes de cada integración al implementarla. No seleccionar únicamente clientes satisfechos para solicitar reseñas públicas.

## Ronda 5 · Requisitos operativos confirmados

Verificar móvil al registrarse, con método/canal pendiente. Diseñar códigos/enlaces con expiración, un solo uso y límites sin enumeración de clientes. Al principio el empleado confirma la cuenta pagada: esto no aporta verificación independiente del ticket; permisos, auditoría e idempotencia siguen siendo necesarios. Correcciones solo tras solicitud con motivo y autorización del encargado/propietario. Proponer registro de solicitud/autorización/resultado y pruebas de rechazo a operaciones directas de empleado sin autorización. Son controles por diseñar e implementar, no pruebas realizadas.

## Revisión de arquitectura

Matriz inicial y límites en [[Arquitectura y entornos]]. Administración Fideresto y dueño requieren autenticación reforzada propuesta; acceso de soporte acotado y trazable, sin lectura/modificación global de clientes por defecto. El camarero no configura programa, WhatsApp ni etiquetas ni autoriza sus propias correcciones. Altas se activan al verificar móvil; canje por camarero confirmado. El NFC público contiene una URL copiable, sin claves ni datos personales: no prueba presencia ni autoriza sellos. Verificar ámbito de comercio en cada operación y trabajo en segundo plano. Ninguno de estos controles se ha implementado todavía.

## Evidencia de la primera base

`npm test`: validación de programa (mínimo 0, premio libre, caducidad independiente) y ejecución de migración/pruebas SQL contra PostgreSQL WASM/PGlite. Casos: aislamiento de dos negocios, intento de cambio de ámbito, cambios de programa rechazados a camarero, autopromoción y creación de NFC rechazadas, administración con listado acotado y sin lectura operativa global, entrada pública mínima y etiqueta desactivada. `npm run typecheck` y compilación de producción superadas. Dependencias auditadas sin vulnerabilidades reportadas en instalación.

UI revisada por navegador: demo, simulación de sello/premio/canje, configuración y cambio a rol camarero; administración sin Supabase redirige al acceso y no expone panel. Composición móvil revisada mediante captura estática a 390 px, no dispositivo real ni NFC físico. Credenciales/cookies no se registran en vault. No reutilizar fixtures ficticios como cuenta de producción.

## Controles del núcleo implementados y probados localmente · 30/10/2026

[[Nucleo de fidelizacion]] recoge el estado vigente: sellos/canjes/correcciones persistentes, premios con condiciones guardadas, autorización SQL por comercio y laboratorio ficticio independiente de la demo visual. Crystal Clear continúa en tarjeta, operación del camarero e historial. 22 comprobaciones locales, tipos/build y recorrido de navegador superados. Las afirmaciones anteriores de movimientos pendientes describen la primera base y quedan sustituidas por este avance local; no se ha creado ni probado Supabase alojado, verificación real del móvil o concurrencia multisesión.
