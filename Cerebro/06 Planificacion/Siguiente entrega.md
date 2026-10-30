# Siguiente entrega

Orden de trabajo y avance · 30/10/2026. Víctor valora positivamente Crystal Clear y pide próximos pasos/actualización de NEXO. La base visual se adopta para continuar; el producto todavía necesita operaciones reales e integraciones.

## Prioridad inmediata: núcleo de fidelización

1. Completar modelo de consumidores afiliados a cada comercio, movimientos de sellos, premios obtenidos, canjes y solicitudes de corrección. Usar datos ficticios; el método real de verificación telefónica sigue pendiente.
2. Construir el recorrido del camarero: identificar la tarjeta → comprobar cuenta pagada y mínimo → confirmar sello → ver resultado. Preparar el canje de premio disponible y la solicitud de corrección con motivo, autorizada por dueño/encargado.
3. Pase Apple/Google Wallet del consumidor con sellos; sin vista en la app. El historial y gestión de premios se consultan por el personal del comercio; aplicar Crystal Clear al panel. Concretar el gesto cotidiano NFC/QR sin dar por resuelta lectura NFC de Wallet entre móviles.
4. Ejecutar pruebas de permisos por comercio, reintentos, operaciones concurrentes y reglas de temporadas/caducidad sobre el modelo real local. El desarrollo/prueba local no demuestra conexión o funcionamiento de Supabase alojado.

## Criterios de la entrega

- La operación autorizada queda registrada con actor, comercio y momento; doble clic/reintento de la misma operación no duplica el movimiento.
- Un premio solo se canjea una vez, incluso con dos peticiones simultáneas.
- El empleado confirma inicialmente que la cuenta se ha pagado; no se presume verificación independiente de ticket.
- Al completar objetivo se obtiene el premio descrito en texto libre; seguir acumulando no bloquea premios pendientes.
- Premios ya ganados conservan su texto/condiciones al cambiar la temporada; el progreso incompleto adopta el premio vigente.
- Correcciones con motivo y autorización conservan la operación original y su trazabilidad.
- Un comercio no accede a afiliaciones ni movimientos de otro. La verificación de teléfono real no se sustituye por un botón de simulación de producción.
- La siguiente revisión muestra recorrido funcional y evidencia de pruebas; no solo cambios visuales.

## Conexiones y piloto después del núcleo

Supabase sigue sin crear: cotización consultada 10 USD/mes y creación aplazada por Víctor. Avanzar modelo, interfaz y pruebas locales sin recursos de pago. Cuando se autorice: aplicar migraciones al proyecto dedicado, provisionar cuentas, probar Auth/RLS y conectar el canal de verificación del móvil.

Con la aclaración de cliente solo Wallet, priorizar la emisión/actualización de pases tras alta/verificación. Integrar y probar Apple Wallet, Google Wallet, NFC/QR y WhatsApp del negocio. Campañas/plantillas ampliables, agenda básica y configuración/formación asistida continúan dentro del alcance confirmado del piloto. Cerrar comprobaciones de móviles, MFA, límites, copias/restauración y operación antes de usar datos reales.

Primer comercio previsto: Víctor; nombre comercial, configuración concreta y equipo aún por facilitar. Objetivo revisable del piloto: 31/01/2027. No se han cambiado fechas intermedias, responsables o presupuesto por esta priorización.

## Estado

Núcleo implementado y comprobado localmente: [[Nucleo de fidelizacion]]. Laboratorio persistente, interfaz profesional preparada, RPC y 22 comprobaciones automáticas, tipos/build. La prueba real de dos sesiones concurrentes, Auth/PostgREST alojados y registro por teléfono siguen pendientes; no se da por alcanzado el hito completo. La demo visual sigue siendo efímera. Prioridad siguiente: registro/acceso verificado del consumidor y recorrido de identificación QR/NFC, sin crear recursos de pago mientras Víctor no lo autorice. Ver [[Estado actual]] y [[Seguimiento Nexo]].

## Corrección vigente · Consumidor solo Wallet y fichas por comercio

[[Clientes por establecimiento]] prevalece sobre propuestas anteriores: no hay vista del consumidor dentro de la app. Se ha retirado `/tarjeta/[merchantId]` y el rol ficticio de cliente; consulta profesional restringida a pertenencia activa. Dueño/camarero buscan por nombre/teléfono y editan ficha. Número normalizado único por establecimiento (no global); ficha/tarjeta/ledger estables, cambios aislados de otros negocios y de Auth. Edición controlada por versión, duplicados rechazados y auditoría sin valores de contacto. 28 comprobaciones locales, tipos/build y recorrido de navegador. Wallet real, alta/verificación puntual y conexiones siguen pendientes.
