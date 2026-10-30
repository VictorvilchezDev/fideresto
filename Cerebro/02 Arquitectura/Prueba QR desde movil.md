# Prueba QR desde móvil

30/10/2026 · Víctor informa de que el QR abre `127.0.0.1` en el teléfono y no carga. Esa dirección apunta al propio dispositivo que abre el enlace; el servidor existente solo escuchaba en loopback.

## Corrección implementada

Origen separado `FIDERESTO_DEMO_QR_ORIGIN` para QR ficticio. Se permite una dirección HTTP IPv4 privada únicamente con `FIDERESTO_LAN_PREVIEW=1`, o HTTPS. No altera `NEXT_PUBLIC_APP_URL` ni relaja el origen de autenticación/NFC reales. Configuración e IP efectiva de esta sesión solo en `.env.local`, ignorado por Git.

La demo genera QR hacia `/prueba-qr`, página pública puntual de comprobación de conexión. Indica que alta/verificación/emisión Wallet siguen pendientes, sin pedir datos ni volver a introducir una vista del consumidor. No es el flujo completo del piloto.

Si el origen es loopback (`localhost`, 127/8, ::1 o direcciones no especificadas), el botón no genera el QR y explica el motivo. Se descartan QR en pantalla creados con el origen anterior; los QR ya descargados/impresos deben regenerarse.

Para esta prueba se inicia una segunda instancia de la compilación de producción, puerto 3019, vinculada solo a la IPv4 privada del ordenador. El servidor de desarrollo sigue en `127.0.0.1:3017`. El móvil debe estar en la misma red/Wi-Fi, con acceso entre dispositivos; el ordenador y la instancia deben permanecer encendidos. No se ha abierto un túnel público ni creado alojamiento o recursos de pago.

## Reproducir

1. Obtener la IPv4 privada activa del ordenador.
2. Configurar en `.env.local`: `FIDERESTO_LAN_PREVIEW=1` y `FIDERESTO_DEMO_QR_ORIGIN=http://IP_PRIVADA:3019`.
3. Ejecutar `npm run build` y `npm exec -- next start --hostname IP_PRIVADA --port 3019`.
4. Abrir `/demo`, NFC y QR, y generar un QR nuevo. Su destino es `http://IP_PRIVADA:3019/prueba-qr`.
5. Probar desde el teléfono en la misma Wi-Fi. Una IP distinta, aislamiento de clientes Wi-Fi o firewall pueden impedir acceso; no se han cambiado router ni firewall. Para pruebas fuera de esa red se necesita una URL de prueba HTTPS, todavía no configurada.

Si se recompila, reiniciar la instancia de previsualización para que sirva los nuevos artefactos. Esta instancia temporal no es el despliegue del piloto.

## Evidencia

30 comprobaciones automáticas contando subcasos; tipos y build superados. Pruebas nuevas de origen de demo privado/opt-in, rechazo de orígenes inseguros y detección/destinos de QR loopback. La app real conserva sus restricciones.

HTTP por la IP privada: `/prueba-qr` devuelve 200; `/laboratorio` y POST `/api/laboratorio` devuelven 404 en la instancia móvil, aunque el laboratorio del ordenador siga habilitado en desarrollo. Navegador confirma destino de QR nuevo y apertura de página de llegada por IP privada. QR/captura guardados como entregables fuera del repositorio. No se ha probado físicamente con el teléfono de Víctor ni verificado Wallet.

## Pendiente

Alta/verificación puntual, creación/actualización de pases Apple/Google Wallet, URL HTTPS de prueba fuera de Wi-Fi, Supabase alojado y el resto de integraciones/piloto. Esta corrección resuelve el destino de conexión del QR de la demo y no afirma que ya exista una tarjeta Wallet real.
