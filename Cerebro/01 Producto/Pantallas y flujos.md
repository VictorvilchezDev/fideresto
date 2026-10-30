# Pantallas y flujos

Versión 0.2 · Ajustada a la ronda 1 del 30 de octubre de 2026. No son pantallas implementadas ni diseños aprobados.

Reglas de fidelización actualizadas en [[Reglas de sellos y premios]]; datos de alta, WhatsApp emisor y dispositivos del personal en [[Requisitos confirmados]]. Estas decisiones prevalecen sobre las cuestiones abiertas de la propuesta inicial.

## Organización del producto

Una plataforma para varios comercios, con datos aislados y un programa independiente por comercio. No se propone una tarjeta universal que mezcle recompensas de negocios ajenos.

Público confirmado: bares y cafeterías. La tarjeta en Wallet iOS/Android y WhatsApp forman el núcleo; NFC y QR son ambos obligatorios. El navegador apoya el registro y recuperación. No se exige una app propia de Fideresto para el consumidor. Ver [[Requisitos confirmados]].

## Pantallas propuestas

| Área | Pantallas | Función |
| --- | --- | --- |
| Cliente | Bienvenida del comercio | Identidad, reglas, recompensa y acceso al registro o a su tarjeta. |
| Cliente | Registro y acceso | Alta mínima, condiciones del programa, elección de comunicaciones y recuperación segura. |
| Cliente | Mi tarjeta | Sellos, objetivo, premio disponible, reglas y acceso a Apple Wallet o Google Wallet. |
| Cliente | Mis recompensas y actividad | Premio pendiente/canjeado, movimientos y resultado del canje. |
| Cliente | Preferencias | Comunicaciones, baja y opciones de datos/acceso según política definida. |
| Empleado | Acceso | Identificación, comercio y permisos; recuperación/revocación. |
| Empleado | Validar visita | Leer código personal de la tarjeta o localizar mediante un mecanismo autorizado; confirmar operación. |
| Empleado | Canjear premio | Comprobar elegibilidad, confirmar, resolver reintentos y mostrar resultado. |
| Empleado | Actividad de trabajo | Consultar operaciones permitidas y solicitar correcciones con mensaje de motivo; autorización del encargado/propietario antes de aplicarlas. |
| Propietario | Inicio | Actividad, clientes recurrentes, premios y campañas; distinguir datos registrados de estimaciones. |
| Propietario | Clientes y ficha | Historial, estado del programa y preferencias, con datos mínimos. |
| Propietario | Programa y recompensas | Número de sellos, imagen de tarjeta, premio en texto libre, importe mínimo (admite 0), caducidades separadas/desactivables y cambios de temporada. |
| Propietario | Equipo y permisos | Altas, roles, revocación y acceso al comercio. |
| Propietario | Campañas | Cumpleaños, inactividad, promociones, experiencia/reseñas y comunicaciones de reservas; biblioteca ampliable de plantillas, vista previa, límites y resultados. |
| Personal y propietario | Agenda de reservas | Fecha/hora, nombre, personas y estado; registro y confirmación manual de solicitudes recibidas por WhatsApp. |
| Propietario | Actividad y configuración | Trazabilidad, incidencias, perfil del negocio e integraciones. |

Estas funciones pueden compartir vistas y diálogos; la tabla no obliga a construir 15 páginas independientes.

La operación de Fideresto requerirá provisionar comercios y gestionar incidencias con privilegios mínimos. No se presupone acceso general del soporte a datos personales ni un panel de administración completo para el primer MVP.

## Flujo 1 · Alta

1. El comercio ofrece acceso por QR, NFC o enlace, con alternativas según compatibilidad.
2. El cliente consulta el programa antes de registrarse.
3. Aporta nombre y móvil obligatorios y cumpleaños opcional (día/mes); comunicaciones y participación se presentan de forma diferenciada. Debe verificar el móvil al registrarse; método de verificación, acceso y recuperación por definir.
4. El servidor activa su afiliación al comercio tras verificar el móvil, sin aprobación manual del personal.
5. Accede a su tarjeta mediante un mecanismo privado y recuperable por definir.
6. Añade su tarjeta a Apple Wallet o Google Wallet. Esta integración es requisito del piloto.

No se pide información de cumpleaños si no se va a utilizar; valorar día/mes frente a fecha completa según la finalidad. No se obtiene acceso a WhatsApp o a contactos por acercar NFC.

## Flujo 2 · Visita y sello

1. El cliente muestra su tarjeta personal.
2. Un empleado autenticado identifica la tarjeta y confirma la cuenta pagada; se concede un sello por cuenta. El empleado comprueba el mínimo configurado por el local (0 significa sin mínimo). Inicialmente no se exige número de ticket; se estudiará verificación adicional posteriormente.
3. El servidor verifica empleado, comercio, tarjeta y reglas.
4. Registra un movimiento único y actualiza el progreso.
5. Cliente y empleado reciben el resultado.

Escanear el QR público del comercio no añade sellos. La identificación de la tarjeta y la autorización para modificarla son cosas distintas.

## Flujo 3 · Premio y canje

1. Al alcanzar el objetivo, la tarjeta muestra una recompensa disponible.
2. El cliente la solicita en el establecimiento.
3. El empleado verifica y confirma el canje.
4. El servidor consume el premio una sola vez, incluso con doble clic o peticiones simultáneas.
5. Se registra quién, cuándo y en qué comercio; el cliente sigue acumulando en otro ciclo aunque tenga premios pendientes de canjear.

## Flujo 4 · Recuperación de cliente

1. Una regla detecta inactividad según un umbral configurable.
2. Se comprueban permiso para recibir comunicaciones, baja, frecuencia y presupuesto.
3. Se prepara un mensaje con plantilla e incentivo, cuando proceda.
4. Se envía por el canal integrado y se registra su resultado sin duplicados.
5. Un canje posterior puede vincularse a la campaña; eso no demuestra por sí solo un incremento causal de ventas.

Cumpleaños sigue un flujo equivalente con los datos y preferencias pertinentes.

## Flujo 5 · Puesta en marcha del comercio

Nuestro equipo instala el sistema, ayuda con la configuración inicial y forma al personal: definir programa e imagen → configurar comercio y equipo → comprobar NFC/QR, registro y ambos Wallet → probar visita/canje/WhatsApp → formar → abrir piloto → revisar incidencias y costes.

NFC y QR son requisitos del piloto. Agenda básica propia apoyada en solicitudes WhatsApp confirmada: el personal registra y confirma. No se presupone disponibilidad ni asignación automática de mesas. Pedidos e integración con caja son ampliaciones posteriores.

## Diseño

Identidad propia. CristalWhite es una dirección por explorar. Priorizar legibilidad, contraste, foco, resultados claros y rapidez para el empleado. Nexo solo aporta el método del cerebro y la seguridad.

## Decisiones de producto por cerrar

- Un sello por cuenta confirmado; falta identificación de la cuenta y tratamiento de cuentas partidas.
- El comercio configura umbral, imagen, premio y caducidad. La tarjeta en curso adopta el premio nuevo; los premios ganados se conservan para canjear. Caducidades separadas: sellos por inactividad y premios desde obtención, con opción de desactivar. Premio como texto libre; sin tipos estructurados ni cálculo automático de descuentos.
- Solicitud de corrección con motivo y autorización del encargado/propietario confirmada; falta concretar estados y permisos detallados.
- Datos mínimos y verificación de móvil al registrarse confirmados; falta elegir mecanismo de verificación/acceso/recuperación del cliente.
- Comercio piloto y responsable; presupuesto y proveedores.

## Revisión de arquitectura v0.1

Dos áreas profesionales planteadas por Víctor: administración Fideresto y comercio; dentro del comercio, dueño y camarero/dependiente. El recorrido público del consumidor es separado. Camarero confirma sellos, registra canjes y solicita correcciones con motivo; dueño configura y autoriza. No se requiere aprobar altas tras verificar móvil. Acceso del camarero a agenda pendiente ante la restricción de funciones planteada. Propuesta de uso cotidiano NFC/QR y alternativa QR personal en [[Arquitectura y entornos]]; no prometer lectura Wallet por acercar dos móviles.
