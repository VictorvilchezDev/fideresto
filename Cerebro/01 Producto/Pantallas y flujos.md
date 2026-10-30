# Pantallas y flujos

Versión 0.1 · Propuesta del 30 de octubre de 2026. No son pantallas implementadas ni diseños aprobados.

## Organización del producto

Una plataforma para varios comercios, con datos aislados y un programa independiente por comercio. No se propone una tarjeta universal que mezcle recompensas de negocios ajenos.

El consumidor utiliza el navegador móvil y, cuando se integre, su cartera digital. La aplicación propia que tendría que descargarse no es un requisito de la propuesta inicial.

## Pantallas propuestas

| Área | Pantallas | Función |
| --- | --- | --- |
| Cliente | Bienvenida del comercio | Identidad, reglas, recompensa y acceso al registro o a su tarjeta. |
| Cliente | Registro y acceso | Alta mínima, condiciones del programa, elección de comunicaciones y recuperación segura. |
| Cliente | Mi tarjeta | Sellos, objetivo, premio disponible, reglas y acceso a Wallet cuando esté integrado. |
| Cliente | Mis recompensas y actividad | Premio pendiente/canjeado, movimientos y resultado del canje. |
| Cliente | Preferencias | Comunicaciones, baja y opciones de datos/acceso según política definida. |
| Empleado | Acceso | Identificación, comercio y permisos; recuperación/revocación. |
| Empleado | Validar visita | Leer código personal de la tarjeta o localizar mediante un mecanismo autorizado; confirmar operación. |
| Empleado | Canjear premio | Comprobar elegibilidad, confirmar, resolver reintentos y mostrar resultado. |
| Empleado | Actividad de trabajo | Consultar operaciones permitidas y solicitar/realizar correcciones según su rol. |
| Propietario | Inicio | Actividad, clientes recurrentes, premios y campañas; distinguir datos registrados de estimaciones. |
| Propietario | Clientes y ficha | Historial, estado del programa y preferencias, con datos mínimos. |
| Propietario | Programa y recompensas | Reglas, visitas elegibles, umbral, premio, límites y versiones. |
| Propietario | Equipo y permisos | Altas, roles, revocación y acceso al comercio. |
| Propietario | Campañas | Segmentos, automatizaciones, vista previa, límites, consentimiento y resultados. |
| Propietario | Actividad y configuración | Trazabilidad, incidencias, perfil del negocio e integraciones. |

Estas funciones pueden compartir vistas y diálogos; la tabla no obliga a construir 15 páginas independientes.

La operación de Fideresto requerirá provisionar comercios y gestionar incidencias con privilegios mínimos. No se presupone acceso general del soporte a datos personales ni un panel de administración completo para el primer MVP.

## Flujo 1 · Alta

1. El comercio ofrece un QR o enlace público.
2. El cliente consulta el programa antes de registrarse.
3. Aporta los datos mínimos acordados; comunicaciones y participación se presentan de forma diferenciada.
4. El servidor crea su afiliación al comercio.
5. Accede a su tarjeta mediante un mecanismo privado y recuperable por definir.
6. Puede añadirla a Wallet si la integración está operativa.

No se pide información de cumpleaños si no se va a utilizar; valorar día/mes frente a fecha completa según la finalidad. No se obtiene acceso a WhatsApp o a contactos por acercar NFC.

## Flujo 2 · Visita y sello

1. El cliente muestra su tarjeta personal.
2. Un empleado autenticado identifica la tarjeta y confirma una visita elegible.
3. El servidor verifica empleado, comercio, tarjeta y reglas.
4. Registra un movimiento único y actualiza el progreso.
5. Cliente y empleado reciben el resultado.

Escanear el QR público del comercio no añade sellos. La identificación de la tarjeta y la autorización para modificarla son cosas distintas.

## Flujo 3 · Premio y canje

1. Al alcanzar el objetivo, la tarjeta muestra una recompensa disponible.
2. El cliente la solicita en el establecimiento.
3. El empleado verifica y confirma el canje.
4. El servidor consume el premio una sola vez, incluso con doble clic o peticiones simultáneas.
5. Se registra quién, cuándo y en qué comercio; el siguiente ciclo se aplica según las reglas.

## Flujo 4 · Recuperación de cliente

1. Una regla detecta inactividad según un umbral configurable.
2. Se comprueban permiso para recibir comunicaciones, baja, frecuencia y presupuesto.
3. Se prepara un mensaje con plantilla e incentivo, cuando proceda.
4. Se envía por el canal integrado y se registra su resultado sin duplicados.
5. Un canje posterior puede vincularse a la campaña; eso no demuestra por sí solo un incremento causal de ventas.

Cumpleaños sigue un flujo equivalente con los datos y preferencias pertinentes.

## Flujo 5 · Puesta en marcha del comercio

Definir programa → configurar comercio y equipo → revisar QR/registro/tarjeta → probar visita y canje → formar al personal → abrir piloto → revisar incidencias y costes.

Las reservas, pedidos e integración con caja son ampliaciones posteriores. NFC es una alternativa de acceso que se validará en dispositivos, no un requisito para demostrar el núcleo.

## Diseño

Identidad propia. CristalWhite es una dirección por explorar. Priorizar legibilidad, contraste, foco, resultados claros y rapidez para el empleado. Nexo solo aporta el método del cerebro y la seguridad.

## Decisiones de producto por cerrar

- Qué cuenta como visita y si se exige compra mínima.
- Umbral, premio, coste, caducidad y reglas al cambiar de programa.
- Quién corrige operaciones y con qué trazabilidad.
- Datos mínimos y mecanismo de acceso/recuperación del cliente.
- Comercio piloto y responsable; presupuesto y proveedores.

