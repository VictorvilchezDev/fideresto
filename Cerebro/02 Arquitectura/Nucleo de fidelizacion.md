# Núcleo de fidelización

30/10/2026 · Implementación y verificación local tras «venga ok dale» de Víctor. Ver [[Reglas de sellos y premios]] para requisitos confirmados. No hay despliegue ni Supabase alojado.

## Implementado

Migración `20261030121021_loyalty_core.sql`, generada inicialmente con Supabase CLI 2.122.0. Afiliaciones por comercio/usuario, código opaco de tarjeta, sellos individuales, premios con condiciones guardadas al obtenerse y libro de operaciones. FKs compuestas mantienen comercio/cliente en las relaciones. RLS habilitada y acceso directo de clientes a las cuatro tablas revocado; lectura/escritura mediante RPC acotadas. No hay listado de teléfonos para el camarero.

`enroll_loyalty`: identidad de Auth actual y `auth.users.phone_confirmed_at`, nombre obligatorio, cumpleaños día/mes opcional y validado. No acepta una bandera «verificado» desde el navegador. Es idempotente por comercio/usuario. El servicio y pantallas de verificación telefónica siguen pendientes; los fixtures locales no son verificación real.

`loyalty_command`: cinco acciones permitidas (sello, canje, solicitar, autorizar, rechazar). Comprueba pertenencia activa al comercio y rol en la base de datos; solo dueño resuelve. Bloquea primero la fila de afiliación, después programa/premio/solicitud, para serializar operaciones de una tarjeta. Clave idempotente por comercio: el reintento conserva actor, tarjeta, acción y payload; no puede reutilizarse con otros datos. Devuelve el identificador de la operación registrada. La UI deshabilita acciones en vuelo y conserva la clave de un reintento mientras está abierta. Si se recarga tras una respuesta incierta hay que consultar historial; no se identifican tickets ni se verifica por otra fuente el pago.

Cada cuenta confirmada añade un sello. El empleado declara pago y mínimo; no hay campo obligatorio de ticket ni motor de descuentos. Al alcanzar objetivo, se crea un premio con texto, objetivo y vencimiento propios. Se permite seguir acumulando. Canje comprobado/transaccional; un premio usado, anulado o caducado se rechaza. La clave evita duplicación técnica; no demuestra que dos operaciones nuevas no correspondan a la misma cuenta física.

Corrección: solicitud motivada (4–500 caracteres), dueño autoriza/rechaza, nueva operación y original conservada. Si el sello formó un premio ya canjeado, se exige corregir primero ese canje. Corregir un sello invalida el premio asociado y devuelve los otros sellos sin renovar sus fechas; corregir canje restaura el premio sin cambiar su fecha de caducidad. Una solicitud resuelta no se autoriza dos veces. El rol adicional de encargado y una regla de doble persona diferente no se han implementado.

`loyalty_card`: consumidor solo su tarjeta; personal del comercio puede consultar por código opaco. Devuelve progreso, programa, hasta 100 premios, 60 movimientos recientes y, al dueño, hasta 100 solicitudes pendientes de esa tarjeta independientemente de la ventana de historial. Oculta teléfonos, UUID de actores y motivos internos al consumidor. Paginación y bandeja global del dueño pendientes.

## Criterios técnicos elegidos para esta entrega

No son requisitos nuevos confirmados por Víctor:

- Una visita válida renueva los sellos vigentes sin consumir con la caducidad actual; los caducados nunca reviven. Cambiar la configuración no modifica por sí solo sus fechas ya guardadas. Los premios ganados no cambian de texto ni de fecha.
- Si se baja el objetivo, los premios derivados del progreso se materializan en el siguiente sello confirmado, con máximo 100 premios por operación y rollback si lo supera. No se conceden premios desde la pantalla de configuración.
- Las correcciones no cuentan como nueva actividad pagada y conservan vencimientos; un premio restaurado puede estar ya caducado.
- Una solicitud necesita dueño, pero puede solicitarla y autorizarla la misma persona si posee ese rol. Separación obligatoria entre dos personas aún no acordada.

## Pantallas y entornos

`/demo`: conserva la propuesta visual efímera; enlace «Probar con historial». Su programa y simulaciones son independientes del laboratorio.

`/laboratorio`: interfaz Crystal Clear con Alex/Mar ficticios; probar como camarero/dueño/cliente Alex, confirmar pago, sello, premios, canjes, corrección motivada y autorización. Dueño configura el programa de pruebas. PostgreSQL WASM/PGlite guarda en `.data/loyalty-lab-v1/` (ignorado por Git). No introducir datos reales. Solo desarrollo, opt-in `FIDERESTO_LOCAL_LAB=1`, loopback y origen coincidente para API. No disponible en producción aunque la bandera esté activa: página y API comprobadas con HTTP 404 al ejecutar la compilación de producción. Cola de conexión y transacción por petición aíslan las identidades sintéticas. Este adaptador nunca autoriza las rutas reales.

Panel profesional: componente conectado a RPC mediante `/api/loyalty`, sesión Supabase validada en servidor. Consulta por código de tarjeta, sin lista de contactos. `/tarjeta/[merchantId]` prepara consulta propia del consumidor autenticado; todavía no existe su recorrido de entrada por teléfono. Autorización final en SQL aunque se invoque directamente PostgREST. JSON acotado mientras se lee (8192 bytes), sin confiar en Content-Length; no equivale a disponer ya de protección de tasa o gasto.

## Comprobado y límites

22 comprobaciones automáticas contadas por Node (incluye los subcasos SQL), tipos y build superados. Se ejecutan ambas migraciones reales en PGlite con Auth ficticio. Casos: identidad/alta, cumpleaños, anonimato, cruce de comercios, rol, tablas sin escritura directa, idempotencia/reuso de claves, doble canje secuencial, temporadas, acumulación, caducidad, correcciones/aprobación/rechazo, premio usado, motivos privados, solicitudes fuera de historial reciente, comercio desactivado, límite JSON y cierre del laboratorio por entorno/origen.

En navegador: cuatro sellos de prueba, obtención, canje, solicitud, autorización, restauración del premio y consulta como consumidor. Recarga conserva historial y se sigue acumulando con premio pendiente. Datos sintéticos persistentes en este equipo; sin envío de mensajes ni chip físico.

PGlite usa una conexión: no se ha ensayado una carrera real entre dos sesiones PostgreSQL. Se implementan bloqueo/atomicidad/clave única, pero esa aceptación permanece pendiente de verificar con PostgreSQL multisesión/Supabase. No se han ejecutado asesores remotos: no existe proyecto Fideresto; revisar allí cuando se cree. Tampoco se han probado Auth/PostgREST alojados, proveedor telefónico, Wallet, WhatsApp, hardware, móvil físico, carga, recuperación de copias o despliegue. Este bloque no completa el piloto.

## Siguiente bloque

Registro/acceso del consumidor por teléfono verificado y gesto operativo de identificación QR/NFC; después conexión real de Supabase cuando Víctor autorice crear su proyecto, ambas Wallet y WhatsApp. Mantener seguridad y pruebas de proveedor, sesiones concurrentes, paginación, MFA y recuperación antes del piloto. Supabase de pago continúa aplazado; no se ha creado ningún recurso alojado.
