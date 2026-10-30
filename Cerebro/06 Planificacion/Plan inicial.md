# Plan inicial

Versión 0.3 · 30 de octubre de 2026 · Propuesta de producto y calendario.
Fecha objetivo elegida por Víctor: **31 de enero de 2027**, para tener el piloto preparado. Las fechas intermedias, reglas y funcionalidades son propuestas revisables.

## Objetivo

Ayudar a comercios en España a convertir clientes ocasionales en recurrentes mediante una tarjeta digital de recompensas y comunicaciones útiles. Evaluar adopción, repetición y costes antes de escalar.

El piloto debe demostrar que el personal puede operarlo y que los clientes lo entienden. El plazo no promete rentabilidad demostrada ni lanzamiento masivo.

## Primer alcance propuesto

Primer público confirmado: bares y cafeterías en España. El comercio configura número de sellos, imagen de tarjeta y premio de producto/servicio gratuito o descuento, que puede cambiar por temporada. Nuestro equipo instala, ayuda en la configuración inicial y forma al personal. Un establecimiento para comenzar; arquitectura preparada para aislar comercios.

Cliente, empleado y propietario disponen de recorridos separados. El acceso público del comercio solo permite descubrir/registrarse; no permite añadir sellos.

Wallet en iOS y Android, WhatsApp, NFC y QR son núcleo obligatorio del piloto. Durante desarrollo se pueden revisar partes con datos ficticios; una demo web o integraciones simuladas no cumplen el piloto. Las comunicaciones incluyen todas las planteadas y nuevas plantillas configurables según demanda. Ver [[Requisitos confirmados]].

Las reglas del premio, visitas elegibles, caducidad, correcciones y acceso del consumidor siguen pendientes de concretar.

## Fases propuestas y entregables

| Fase | Fecha de referencia | Entregable y criterio de cierre |
| --- | --- | --- |
| 01 · Producto, arquitectura y seguridad | 06/11/2026 | Alcance, flujos, reglas del programa, amenazas, matriz de permisos y arquitectura de trabajo revisados. |
| 02 · Experiencia y diseño propio | 13/11/2026 | Prototipo de cliente, empleado y propietario; dirección visual propia revisada, sin heredar apariencia de Nexo. |
| 03 · Primera versión funcional segura | 04/12/2026 | Alta, tarjeta web, visitas, canje, equipo y panel funcionando con datos ficticios; pruebas de permisos y consistencia. |
| 04 · Wallet y comunicaciones | 08/01/2027 | Emisión/actualización de tarjetas, WhatsApp y automatizaciones comprobados con cuentas/dispositivos reales; NFC y QR obligatorios. |
| 05 · Verificación y preparación operativa | 22/01/2027 | Aislamiento, fraude, límites, recuperación y uso móvil verificados; versión candidata con riesgos pendientes visibles. |
| 06 · Piloto y validación comercial | 31/01/2027 | Comercio configurado y formado; piloto preparado e iniciado si supera los criterios; primeras incidencias y costes registrados. |

La seguridad se diseña e implementa en todas las fases. La fase 05 comprueba el conjunto, no es el momento de empezar a protegerlo.

NEXO contiene seis fases y 29 tareas con dependencias y puntos relativos, no horas. La base documental figura completada; la definición del producto está en curso. Los responsables están pendientes de asignación; no se han invitado personas.

## Criterios del núcleo funcional

1. Un cliente se registra y recupera acceso a su tarjeta sin revelar datos de otra persona.
2. Solo personal autorizado valida visitas de su comercio.
3. Repetir una solicitud no duplica la operación.
4. Dos canjes concurrentes no consumen dos veces el mismo premio.
5. Cambios y correcciones dejan trazabilidad; las reglas del programa se versionan.
6. Cliente y empleado ven el resultado coherente después de la operación.
7. Un comercio no consulta ni modifica clientes, movimientos o campañas de otro.
8. Los indicadores provienen de actividad real registrada.
9. El núcleo es utilizable en móvil y distingue errores, carga, falta de conexión y confirmaciones.
10. Una función externa no integrada se identifica como simulada.
11. El piloto incorpora Apple Wallet, Google Wallet, WhatsApp, NFC y QR reales y comprobados.
12. El comercio puede configurar imagen, número de sellos y tipo de premio, preservando historial y la política estacional que se acuerde.
13. Las comunicaciones admiten plantillas ampliables, preferencias, bajas y límites.
14. Nuestro equipo completa configuración y formación antes de abrir el piloto.

## Ampliaciones posteriores

Referidos, varios locales y reglas de franquicia, programas por gasto, integración con caja, IA de ayuda y pedidos son ampliaciones posteriores. Las comunicaciones de reservas están confirmadas; gestionar disponibilidad, horarios y mesas dentro de Fideresto sigue por aclarar. No confundir plantillas configurables con aprobación automática por WhatsApp.

## Trabajo paralelo de validación comercial

Modelo confirmado de implantación asistida: nosotros instalamos el sistema, ayudamos a configurar y formamos al equipo. Elegir comercio y persona responsable; conocer cómo atiende; estimar coste de premios; observar uso; acordar soporte y propuesta de cuota con costes reales.

Medir registros, visitas repetidas, canjes, bajas y gasto. Separar visitas vinculadas a una campaña de visitas adicionales causadas por ella; una comparación con un grupo sin campaña puede ayudar a estimar ese efecto.

## Siguiente paso

Concretar el programa de ejemplo y sus reglas con Víctor, cerrar matriz de permisos y presentar pantallas propias. Ver [[Pantallas y flujos]], [[Seguridad desde el inicio]] y [[Seguimiento Nexo]].
