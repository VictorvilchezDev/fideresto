# Estado actual

Actualizado: 30 de octubre de 2026.

## Contexto confirmado

Proyecto de fidelización para bares y cafeterías en España; aún no hay piloto concreto. Nombre de trabajo Fideresto; marca final pendiente. Ronda 1 confirmada en [[Requisitos confirmados]]: tarjeta personalizable, premio estacional configurable, NFC y QR, Wallet iOS/Android y WhatsApp como núcleo; implantación/configuración/formación asistidas por nuestro equipo.

Método: Nexo como referencia para el cerebro y la seguridad. Diseño visual independiente; «CristalWhite» solo como posibilidad. Fuente vigente: [[Decisiones]].

Ronda 2: un sello por cuenta; tarjeta en curso pasa al premio estacional vigente; acumulación continua con premios pendientes; caducidad configurable. Ronda 3 confirma agenda propia básica apoyada en solicitudes WhatsApp, registro/confirmación por personal, y conservación de premios ya ganados para canjear. Ver [[Reglas de sellos y premios]].

Ronda 4: nombre y móvil obligatorios, cumpleaños opcional (día/mes); WhatsApp emisor del negocio; dispositivo del local o personal con acceso individual dedicado. Ronda 5: verificar móvil al registrarse (método pendiente); el empleado confirma la cuenta pagada inicialmente; correcciones por solicitud con motivo y autorización del encargado/propietario. Verificación adicional de cuentas se estudiará después.

## Existe realmente

- Carpeta local `outputs/fideresto` dentro del espacio de este chat.
- Repositorio Git local en `main`, documentos iniciales, instrucciones `AGENTS.md` y este vault.
- Proyecto Fideresto en NEXO, ID `c16a8d9e-b397-4a52-be44-2c0fbac1b95d`: seis fases y 30 tareas; ronda 3 añade agenda básica y conserva premios ganados, sin marcar desarrollo completado. Revisión final de esta actualización en [[Seguimiento Nexo]]. Ver [[Seguimiento Nexo]].
- Fecha objetivo del piloto elegida por Víctor: 31/01/2027. Fechas intermedias y alcance detallado son propuestas revisables.
- [[Requisitos confirmados]] de ronda 1; [[Pantallas y flujos]] v0.2 y [[Plan inicial]] v0.3 ajustados y disponibles en NEXO. Diseño visual y reglas detalladas todavía pendientes.
- Consulta de `git ls-remote` completada sin referencias: el repositorio remoto estaba vacío al comprobarlo.

## No implementado

No hay aplicación ejecutable, base de datos, autenticación, tarjetas Wallet, mensajería ni despliegue. Ningún control de seguridad está implementado por el hecho de estar documentado.

## Sincronización

Destino autorizado: `https://github.com/VictorvilchezDev/fideresto.git`. Base documental publicada en `main`: commit inicial `7240fddf2603146466d00787e17f623c67f12e7e`, comprobado contra `git ls-remote`. La rama local sigue `origin/main`. El historial de Git es la referencia para el último commit; esta nota registra la primera publicación verificada.

Verificaciones: 11 notas con enlaces internos resueltos, `git diff --cached --check` correcto y exclusiones de `.env`, secretos y archivos privados comprobadas. Son verificaciones documentales y de Git, no pruebas de una aplicación.

## Siguiente trabajo

1. Concretar método de verificación/acceso del consumidor, cuentas partidas, modalidades de descuento y detalle del vencimiento. Confirmación inicial por empleado y correcciones mediante solicitud motivada/autorización ya acordadas.
2. Diseñar el modelo de amenazas y matriz de permisos antes de implementar operaciones.
3. Preparar una propuesta visual propia, explorando «CristalWhite» sin darla por aceptada.
4. Elegir stack y desarrollar una demo local con datos ficticios y funciones externas simuladas de forma explícita.

No se ha creado un proyecto registrado en la barra lateral de Codex ni un chat nuevo; la carpeta está disponible desde este chat. El proyecto de seguimiento en NEXO sí está creado. No hay sincronización automática entre NEXO y GitHub.
