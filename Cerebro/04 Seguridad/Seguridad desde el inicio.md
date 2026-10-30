# Seguridad desde el inicio

## Confirmado y procedencia

Víctor exige adoptar el método de trabajo de seguridad de Nexo desde el comienzo. Se reutilizan principios y lecciones, no credenciales, permisos operativos, infraestructura ni afirmaciones de seguridad de otra aplicación.

**Estado real:** requisitos documentados; aplicación y controles todavía no implementados. Los siguientes controles son una propuesta técnica de adaptación a Fideresto, pendiente de concretar en arquitectura y pruebas.

## Activos y límites de confianza

Clientes y datos de contacto; identidad de empleados y propietarios; visitas, sellos y recompensas; consentimientos y bajas; costes de mensajería; claves de Wallet e integraciones; información de cada comercio.

Tratar navegador, QR/NFC públicos y mensajes externos como entradas no confiables. Separar clientes, empleados, propietarios, comercios, aplicación, proveedor de mensajes y servidor.

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
