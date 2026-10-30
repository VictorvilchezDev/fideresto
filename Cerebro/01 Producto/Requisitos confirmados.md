# Requisitos confirmados

Rondas 1–6 · 30 de octubre de 2026 · Respuestas expresas de Víctor. Reglas detalladas en [[Reglas de sellos y premios]].

## Acuerdos

| Aspecto | Confirmado |
| --- | --- |
| Público inicial | Bares y cafeterías en España. |
| Programa | El comercio configura el número de sellos, la imagen de la tarjeta y el premio. |
| Premio | Campo de texto libre donde el comercio escribe lo que ofrece al alcanzar X sellos. Sin catálogo ni tipos de premio estructurados; sin cálculo automático de descuentos. |
| Importe mínimo | Configurable por el local para obtener sello; admite 0 (sin mínimo de consumo). |
| Caducidad | Sellos: tras un plazo sin actividad. Premios ganados: plazo desde su obtención. Configuración separada y opción de desactivar la caducidad. |
| Temporadas | El comercio cambia el premio por temporada; las tarjetas en curso pasan al nuevo. Los premios ya ganados se conservan para canjear. |
| Tecnologías | NFC y QR, para ofrecer alternativas según compatibilidad del dispositivo. |
| Núcleo del piloto | Tarjeta en Wallet tanto en iOS como en Android y mensajes de WhatsApp. Una demo web parcial puede ayudar al desarrollo, pero no equivale al producto piloto confirmado. |
| Comunicaciones | Todas las planteadas: cumpleaños, inactividad, promociones, experiencia/reseñas y comunicaciones de reservas; creación/adaptación de nuevas plantillas según demanda del comercio. |
| Puesta en marcha | Nuestro equipo instala el sistema, forma al personal y ayuda con la configuración inicial. |
| Alta del consumidor | Nombre y móvil obligatorios; cumpleaños opcional con día y mes. Activación al verificar el móvil, sin aprobación manual del personal; método, acceso y recuperación por diseñar. |
| Emisor WhatsApp | Mensajes desde el WhatsApp del negocio. Número actual o dedicado y conexión por concretar; compatibilidad todavía no comprobada. |
| Validación inicial de cuenta | El empleado confirma la cuenta pagada; verificación adicional de la cuenta se estudiará posteriormente. |
| Correcciones | Solicitud con mensaje explicando el motivo y autorización del encargado/propietario; conservar trazabilidad. |
| Canjes por personal | El camarero/dependiente puede registrar el canje, además de confirmar sellos y solicitar correcciones con motivo. |
| Dispositivos del personal | Del establecimiento o personales, con acceso individual dedicado y permisos del comercio. |

«Cliente» al configurar el programa se refiere al comercio que contrata Fideresto; el consumidor acumula sellos y recibe el premio.

## Consecuencias de producto

- El editor del programa incluye imagen, objetivo de sellos, texto libre del premio, importe mínimo (incluido 0), caducidades separadas y cambios estacionales.
- El núcleo se prueba de extremo a extremo con ambos Wallet, NFC, QR y WhatsApp reales antes del piloto.
- Las campañas admiten una biblioteca ampliable de plantillas y activación según las necesidades del comercio.
- El proceso de implantación debe incluir configuración, comprobación y formación, sin dar por elegido un alta comercial por autoservicio.
- Reservas confirmadas: solicitudes por WhatsApp y agenda propia básica con registro/confirmación del personal. No se incluye disponibilidad o asignación automática de mesas.

## Reglas todavía abiertas

1. Un sello por cuenta confirmado por el empleado al inicio. Faltan tratamiento de cuentas partidas y controles adicionales de verificación; no exigir número de ticket en esta primera modalidad. Los reintentos técnicos deben evitar duplicados igualmente.
2. Tarjetas en curso pasan al premio nuevo; premios ya ganados mantienen su recompensa para canjear. Reglas confirmadas.
3. Se sigue acumulando con recompensas pendientes; detalles operativos del ciclo por diseñar.
4. Caducidades separadas confirmadas: sellos por inactividad y premios desde obtención, con opción de desactivar. Plazos concretos los configura el local; efectos de cambios y casos límite se resolverán en diseño técnico.
5. Agenda básica propia apoyada en solicitudes por WhatsApp confirmada; detalles de operación/permisos por diseñar.
6. Datos mínimos y necesidad de verificar móvil confirmados; quedan método de verificación, acceso/recuperación del consumidor. El premio ya se define en texto libre.

La configuración concreta no está decidida por el ejemplo previo de ocho visitas. No hay aplicación implementada por registrar estos requisitos.

## Aclaraciones de arquitectura

Víctor propone web centrada en móvil con administración de Fideresto y área de comercio con roles dueño/camarero. Se confirman activación tras verificar móvil y canjes por camarero. Evaluación técnica, matriz propuesta y límites NFC en [[Arquitectura y entornos]]. Stack y flujo NFC diario pendientes de validación.
