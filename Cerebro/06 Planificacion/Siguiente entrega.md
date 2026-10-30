# Siguiente entrega

Propuesta de orden de trabajo · 30/10/2026. Víctor valora positivamente Crystal Clear y pide próximos pasos/actualización de NEXO. La base visual se adopta para continuar; el producto todavía necesita operaciones reales e integraciones.

## Prioridad inmediata: núcleo de fidelización

1. Completar modelo de consumidores afiliados a cada comercio, movimientos de sellos, premios obtenidos, canjes y solicitudes de corrección. Usar datos ficticios; el método real de verificación telefónica sigue pendiente.
2. Construir el recorrido del camarero: identificar la tarjeta → comprobar cuenta pagada y mínimo → confirmar sello → ver resultado. Preparar el canje de premio disponible y la solicitud de corrección con motivo, autorizada por dueño/encargado.
3. Tarjeta web del consumidor con progreso, premios pendientes e historial coherentes con esas operaciones; aplicar Crystal Clear. Concretar el gesto cotidiano NFC/QR sin dar por resuelta lectura NFC de Wallet entre móviles.
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

Después del núcleo, integrar y probar Apple Wallet, Google Wallet, NFC/QR y WhatsApp del negocio. Campañas/plantillas ampliables, agenda básica y configuración/formación asistida continúan dentro del alcance confirmado del piloto. Cerrar comprobaciones de móviles, MFA, límites, copias/restauración y operación antes de usar datos reales.

Primer comercio previsto: Víctor; nombre comercial, configuración concreta y equipo aún por facilitar. Objetivo revisable del piloto: 31/01/2027. No se han cambiado fechas intermedias, responsables o presupuesto por esta priorización.

## Estado

Plan priorizado, no entrega implementada. La demo actual conserva simulaciones de sellos/canjes y la base de datos alojada sigue pendiente. Ver [[Estado actual]] y [[Seguimiento Nexo]] para evidencia vigente.
