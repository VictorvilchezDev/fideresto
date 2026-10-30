# Plan inicial

Versión 0.2 · 30 de octubre de 2026 · Propuesta de producto y calendario.
Fecha objetivo elegida por Víctor: **31 de enero de 2027**, para tener el piloto preparado. Las fechas intermedias, reglas y funcionalidades son propuestas revisables.

## Objetivo

Ayudar a comercios en España a convertir clientes ocasionales en recurrentes mediante una tarjeta digital de recompensas y comunicaciones útiles. Evaluar adopción, repetición y costes antes de escalar.

El piloto debe demostrar que el personal puede operarlo y que los clientes lo entienden. El plazo no promete rentabilidad demostrada ni lanzamiento masivo.

## Primer alcance propuesto

Un establecimiento piloto; arquitectura preparada para aislar varios comercios. Cafeterías como hipótesis inicial. Programa de sellos por visita validada por personal, con una recompensa configurable y acceso desde el navegador móvil.

Cliente, empleado y propietario disponen de recorridos separados. El acceso público del comercio solo permite descubrir/registrarse; no permite añadir sellos.

Desarrollar primero el recorrido completo con datos ficticios. Añadir Wallet y mensajería mediante proveedores oficiales antes de las pruebas reales de esas integraciones. No etiquetar funciones simuladas como operativas.

Las reglas del premio, visitas elegibles, caducidad, correcciones y acceso del consumidor siguen pendientes de concretar.

## Fases propuestas y entregables

| Fase | Fecha de referencia | Entregable y criterio de cierre |
| --- | --- | --- |
| 01 · Producto, arquitectura y seguridad | 06/11/2026 | Alcance, flujos, reglas del programa, amenazas, matriz de permisos y arquitectura de trabajo revisados. |
| 02 · Experiencia y diseño propio | 13/11/2026 | Prototipo de cliente, empleado y propietario; dirección visual propia revisada, sin heredar apariencia de Nexo. |
| 03 · Primera versión funcional segura | 04/12/2026 | Alta, tarjeta web, visitas, canje, equipo y panel funcionando con datos ficticios; pruebas de permisos y consistencia. |
| 04 · Wallet y comunicaciones | 08/01/2027 | Emisión/actualización de tarjetas, WhatsApp y automatizaciones comprobados con cuentas/dispositivos reales; NFC opcional. |
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

## Ampliaciones posteriores

Referidos, varios locales y reglas de franquicia, programas por gasto, integración con caja, IA de ayuda para campañas, reservas y pedidos. Se priorizan según el piloto, no forman parte del compromiso del núcleo inicial.

## Trabajo paralelo de validación comercial

Elegir comercio y persona responsable; conocer cómo atiende; estimar coste de premios; observar uso del personal; acordar soporte y propuesta de cuota con costes reales.

Medir registros, visitas repetidas, canjes, bajas y gasto. Separar visitas vinculadas a una campaña de visitas adicionales causadas por ella; una comparación con un grupo sin campaña puede ayudar a estimar ese efecto.

## Siguiente paso

Concretar el programa de ejemplo y sus reglas con Víctor, cerrar matriz de permisos y presentar pantallas propias. Ver [[Pantallas y flujos]], [[Seguridad desde el inicio]] y [[Seguimiento Nexo]].
