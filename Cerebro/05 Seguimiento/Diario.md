# Diario

## 2026-10-30 · Inicio y corrección de método

- Se investigó ArtCraft y se analizó la propuesta de fidelización del reel aportado.
- La grabación local no tenía pista de audio; se reconstruyó la explicación mediante subtítulos. No se interpreta el final incompleto.
- Se prepararon README, plan inicial y repositorio Git local bajo el nombre provisional fidelizacion.
- Víctor pidió recuperar el modo de trabajo con vault y seguridad de otros proyectos.
- Se consultaron notas de mantenimiento del cerebro, decisiones y seguridad de Nexo y referencias de CuentasCEE. No se modificaron esos proyectos ni se operó su infraestructura.
- Se corrigió una interpretación equivocada: Nexo no es referencia visual. El usuario lo aclaró antes de que se implementara ninguna interfaz.
- Se renombró la carpeta a fideresto y se preparó el vault, el protocolo AGENTS.md, notas de arquitectura/diseño/seguridad y registro de decisiones.
- `git ls-remote` sobre el repositorio indicado terminó correctamente sin referencias: estaba vacío al consultar. Se creó el commit inicial `7240fdd` y se publicó en `main`; consulta posterior del remoto coincide con el hash local.
- Se verificaron los enlaces internos de 11 notas, formato del diff y exclusión de secretos/archivos privados. No se ejecutaron pruebas de aplicación porque todavía no existe código ejecutable.

Siguiente: definir flujos y matriz de permisos, y preparar propuesta visual propia. No hay aplicación ejecutable ni controles de seguridad implementados todavía.

## 2026-10-30 · Proyecto y planificación en NEXO

- Víctor solicita crear el proyecto por MCP y empezar a explicar fases, objetivo, pantallas y flujos. Elige 31/01/2027 como estimación revisable del piloto.
- Se comprueba que Fideresto no estaba en los proyectos accesibles y se crea, ID `c16a8d9e-b397-4a52-be44-2c0fbac1b95d`.
- Plan inicial registrado y leído de vuelta: revisión 2, seis fases, 29 tareas, una completada (base documental), una en curso (concretar producto) y 27 pendientes. Sin asignar responsables ni invitar personas.
- Se redactan Plan inicial v0.2 y Pantallas y flujos v0.1. Se distinguen fechas propuestas, fecha objetivo confirmada y alcance todavía abierto. Seguridad transversal; reservas/pedidos/caja como ampliaciones.
- Ambos documentos se cargan en NEXO y se leen de vuelta con contenido coincidente. Se guarda mapa de IDs y protocolo de actualización en [[Seguimiento Nexo]].
- Comprobación documental: 13 notas con enlaces internos resueltos y enlaces locales README/plan correctos; diff sin errores de formato. No se han ejecutado pruebas de aplicación porque no hay código ejecutable.

Siguiente: revisar con Víctor el recorrido propuesto y concretar reglas de visita/premio, datos mínimos y acceso, antes de elegir tecnología e implementar.

## 2026-10-30 · Respuestas de producto, ronda 1

- Víctor confirma bares/cafeterías; configuración por comercio de número de sellos, imagen y premio estacional (producto/servicio gratis o descuento); NFC y QR; Wallet iOS/Android y WhatsApp como núcleo; todas las comunicaciones y plantillas ampliables; instalación/configuración/formación asistidas por nuestro equipo.
- Registrados FID-012 a FID-017 y nota principal [[Requisitos confirmados]]. Actualizados producto, planificación, pantallas, seguridad, instrucciones y estado. No se ha elegido regla para premios en curso, caducidad o ciclos.
- NEXO: descripción y 12 tareas ajustadas; revisión 4/29 tareas comprobadas, sin cambios de estados ni participantes. Se conserva trabajo existente y se exige NFC para el hito de piloto. Documentos vigentes e índice cargados y leídos de vuelta con contenido coincidente.
- El alcance de un motor propio de reservas sigue pendiente; los mensajes relacionados con reservas sí están confirmados. No hay código ejecutable todavía.

Siguiente ronda: visitas elegibles/límites, transición de temporada, ciclo de canje, caducidad y alcance de reservas. Después concretar datos, acceso y operación.

## 2026-10-30 · Respuestas de producto, ronda 2

- Un sello por cuenta; tarjeta en curso pasa al premio nuevo de temporada; seguir acumulando con premios pendientes; caducidad configurable por comercio. Registrados FID-018–021.
- Reservas: Víctor valora agenda propia o WhatsApp y no desea integrar cada sistema ajeno. Se propone agenda manual sencilla con solicitudes por WhatsApp, pendiente de elección. No se interpreta como aprobación de disponibilidad/mesas automáticas. FID-022.
- Se crea [[Reglas de sellos y premios]] y se actualizan requisitos, producto, flujos, plan y estado. Sigue pendiente aclarar recompensas ya ganadas ante cambio de temporada.
- NEXO: cinco tareas ajustadas, revisión 5/29 comprobada, sin cambiar estados de avance. Nota de ronda 2 cargada y leída de vuelta; índice actualizado con hash vigente.

Siguiente: aclarar premio ya ganado y elegir modalidad inicial de reservas. No hay aplicación ni controles implementados todavía.
