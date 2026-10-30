# Emision de tarjetas Wallet

Víctor pide ambos Wallet y confirma que no tiene cuentas emisoras. Se explican requisitos; ninguna cuenta, contratación o gasto autorizado por esa pregunta.

Generadores Apple `.pkpass` y Google REST/Save JWT implementados. Identidad estable por comercio/tarjeta; saldo/premio/QR sin contacto. Entrega puntual de 15 minutos por personal autenticado y teléfono verificado: token aleatorio de 256 bits, hash en base, máximo cinco enlaces vigentes y lectura mínima sin directorio de clientes. No es un panel del consumidor; se mantiene [[Clientes por establecimiento]].

Vista previa Crystal Clear `/prueba-qr`, accesible con el QR LAN existente. Botones desactivados sin configuración; muestra cerrada por defecto. Panel profesional incorpora preparación de entrega; laboratorio solo enlaza a muestra, sin emitir fichas ficticias mediante credenciales reales.

39 comprobaciones contando subcasos, tipos/build. Firma PKCS7/manifest Apple con CA temporal ficticia; JWT Google firmado/verificado y REST simulado. Cuatro migraciones PGlite: autorización, teléfono, ámbito, caducidad, límite y ausencia de acceso anónimo a tablas/helpers. No comprueba confianza Apple, aprobación de proveedor, Supabase alojado, multisesión ni instalación en teléfono.

Pendientes: cuentas propias, HTTPS, Supabase, alta/verificación/recuperación e imagen configurables. Actualización automática pendiente: Apple servicio/dispositivos/APNs y Google cola tras movimientos. Reemitir mantiene identidad y toma saldo actual, no es sincronización. Wallet y WhatsApp siguen siendo núcleo exigido del piloto.

Configuración, controles antes de publicación y fuentes: `docs/WALLET.md`. Claves fuera de Git/vault; no reutilizar infraestructura ajena. [[Seguridad desde el inicio]] y [[Siguiente entrega]] conservan esos pendientes.
