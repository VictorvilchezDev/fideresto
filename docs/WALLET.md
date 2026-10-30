# Emisión Apple Wallet y Google Wallet

30/10/2026: generadores y entrega implementados; ningún pase instalado en un dispositivo real. Víctor confirma que no tiene cuentas emisoras. No se ha contratado ni creado ninguna. Supabase continúa aplazado por coste.

## Implementado

- Apple: `storeCard` firmado en `.pkpass`, icono/logo/imagen de sellos, saldo, premio libre, número de premios disponibles y QR. Identidad estable por comercio/tarjeta; reemitir sustituye el mismo pase. Sin teléfono, nombre del consumidor o cumpleaños en el pase.
- Google: OAuth de cuenta de servicio, clase por comercio, creación o PATCH del mismo objeto y Save to Wallet JWT RS256 de cinco minutos. JWT de referencia, sin datos de contacto.
- Personal autenticado del negocio prepara una entrega de 15 minutos para ficha activa con móvil verificado. Token aleatorio de 256 bits, solo hash SHA-256 en base; máximo cinco entregas vigentes por ficha. Cambiar teléfono revoca la entrega hasta verificarlo de nuevo.
- `/wallet/<token>` es entrega puntual sin cuenta/panel del consumidor. Proyección mínima: comercio, identificador opaco, sellos y premio. No concede sello/canje. El QR del pase identifica; no autentica personal ni prueba presencia.
- `/prueba-qr`: muestra ficticia de 5/8. `/api/wallet/sample/*` cerrada por defecto; exige `FIDERESTO_WALLET_SAMPLE=1` y credenciales auténticas propias. Botones desactivados sin configuración. No distribuir pases con los certificados ficticios de los tests.

## Configurar cuentas propias

1. Apple Developer: registrar Pass Type ID, crear CSR y certificado Pass Type ID y obtener el WWDR correspondiente. El titular gestiona identidad, términos y pagos. No reutilizar cuentas/claves de otras apps.
2. Guardar PEM de certificado, clave y WWDR fuera de Git/vault, con lectura limitada al emisor. Configurar `APPLE_WALLET_PASS_TYPE_ID`, `APPLE_WALLET_TEAM_ID`, `APPLE_WALLET_SIGNER_CERT_FILE`, `APPLE_WALLET_SIGNER_KEY_FILE`, `APPLE_WALLET_WWDR_FILE`; `APPLE_WALLET_KEY_PASSPHRASE` si procede. Se comprueban vigencia, clave/certificado, IDs y firma por el intermedio configurado; eso no certifica confianza Apple ni aceptación del dispositivo.
3. Google Wallet: cuenta emisora, proyecto Google Cloud propio con Wallet API y cuenta de servicio autorizada en el emisor. El titular acepta condiciones. Empezar con usuarios de prueba; solicitar acceso de publicación antes de emitir al público.
4. JSON de cuenta de servicio como secreto externo al repositorio; `GOOGLE_WALLET_ISSUER_ID` y `GOOGLE_WALLET_CREDENTIALS_FILE`. Solo permisos de Wallet necesarios; no Editor global.
5. HTTPS público con logo accesible: `WALLET_PUBLIC_ORIGIN=https://dominio-propio`. No se ha desplegado/registrado dominio. `NEXT_PUBLIC_APP_URL` debe coincidir con el origen profesional real. Apple/Google adaptan el diseño a su formato nativo.
6. Supabase dedicado: aplicar todas las migraciones en orden, incluida `20261030125042_wallet_issuance.sql`. Nunca bootstrap/fixtures en alojado. Verificar RLS/grants/RPC y que `private` siga sin exponerse en PostgREST. Runtime sin service_role.
7. Reiniciar, comprobar `/api/wallet/status` (estado mínimo sin secretos) y probar instalación iPhone/Safari y Android con usuario Google de prueba. Revisar sustitución sin duplicado, QR profesional, aislamiento, caducidad y recuperación.

Arquitectura preparada para emisores de Fideresto y clases por comercio. Comprobar aprobación comercial/identidad de marcas con proveedores al configurar; no se ha impuesto alta técnica al consumidor ni creado cuentas por cada bar.

## Pendiente antes de piloto/publicación

Actualización automática NO implementada: falta registro de dispositivos, servicio de actualizaciones y APNs Apple; cola de sincronización Google tras movimientos/cambios del programa. Reemisión manual toma saldo actual, no equivale a sincronización. También alta/verificación/recuperación reales, imagen configurable y prueba física de ambos sistemas.

Antes de exponer emisión: límites distribuidos de peticiones/trabajo, caché de generación, limpieza/retención de entregas, secretos del alojamiento y renovación/rotación. Muestra cerrada por defecto. No registrar tokens/rutas de entrega en proxy, analítica, errores o referer; respuestas privadas/no-store/no-referrer. Un pase/enlace Google ya entregado es compartible; no concede operaciones ni acredita titularidad permanente.

## Evidencia

39 comprobaciones contando subcasos, tipos/build. Cuatro migraciones reales en PGlite, no Supabase alojado ni carrera multisesión. OpenSSL verifica firma PKCS7/manifest Apple con CA ficticia temporal, hashes/imágenes y rechazo de alteración: no aceptación Apple. JWT Google firmado/verificado con RSA temporal; REST simulado (crear, actualizar, rechazo de proveedor/clase distinta), sin llamadas con credenciales reales. SQL: autorización, teléfono, proyección mínima, tablas/helpers privados, caducidad y límite de enlaces.

`passkit-generator` 3.7.0, `sharp` 0.35.5 y `jose` 6.2.14. Override Joi 17.13.8 corrige dependencia transitiva vulnerable, con firma/paquete probados. Auditoría npm sin vulnerabilidades reportadas en la instalación.

## Fuentes oficiales

- [Apple: identificadores/certificados](https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates/).
- [Apple: construir un pase](https://developer.apple.com/documentation/walletpasses/building-a-pass).
- [Apple: diseño e identidad estable](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html).
- [Google: emisión web y modo de prueba](https://developers.google.com/wallet/retail/loyalty-cards/web).
- [Google: objeto y saldo](https://developers.google.com/wallet/reference/rest/v1/loyaltyobject).
- [Google: JWT](https://developers.google.com/wallet/retail/loyalty-cards/use-cases/jwt).
- [Google: configuración](https://codelabs.developers.google.com/add-to-wallet-web).
