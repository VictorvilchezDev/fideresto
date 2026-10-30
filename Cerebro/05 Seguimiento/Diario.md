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

## 2026-10-30 · Ronda 3: agenda propia y premio ya ganado

- Víctor responde sí a la combinación de agenda propia básica con solicitudes WhatsApp y registro/confirmación del personal. También confirma conservar el premio ya ganado para canjear cuando cambia la temporada.
- Registrados FID-023/024 y actualizados requisitos, reglas, producto, pantallas, plan y estado. No se amplía el acuerdo a disponibilidad automática o asignación de mesas.
- NEXO: tarea de agenda añadida y siete tareas ajustadas, conservando estados; hito del piloto depende de la agenda. Revisión 7/30 tareas leída y descripción actualizada. Nota de reglas cargada y leída de vuelta con contenido coincidente; índice documental actualizado.

Siguiente: datos y acceso del consumidor, emisor WhatsApp del comercio, dispositivos del personal y detalles de validación/vencimiento. Sin aplicación ejecutable todavía.

## 2026-10-30 · Ronda 4: datos y accesos

Víctor confirma nombre/móvil obligatorios y cumpleaños opcional día/mes, WhatsApp del negocio como emisor y dispositivo del establecimiento o personal con acceso dedicado individual. Registrados FID-025–027. Requisitos, flujo y estado actualizados.

NEXO: cinco tareas ajustadas; revisión 8/30 tareas comprobada, sin marcar desarrollo realizado. Requisitos consolidados cargados y leídos con contenido coincidente; índice actualizado por hash. Próximo: verificar acceso del consumidor, registrar una cuenta sin duplicados y acordar permisos de corrección. No hay aplicación ejecutable.

## 2026-10-30 · Ronda 5: verificación y correcciones

Víctor confirma verificación del móvil al registrarse, cuenta pagada confirmada inicialmente por el empleado y correcciones mediante solicitud con mensaje de motivo y autorización. Registrados FID-028–030; método de verificación, cuentas partidas y detalles de permisos pendientes. Actualizados requisitos, reglas, flujos, seguridad y estado. Sin aplicación ni controles implementados; comprobación documental y sincronización registradas en [[Seguimiento Nexo]].

## 2026-10-30 · Ronda 6: simplificación del premio

Víctor confirma importe mínimo por local incluido 0, premio en un campo de texto libre y caducidades separadas/desactivables: sellos por inactividad y premios desde obtención. Corrige la propuesta innecesaria de enumerar/modelar descuentos; se elimina esa complejidad de requisitos, flujos y planificación. FID-031–033. Se conservan reglas estacionales y canjes trazables. Documentación actualizada, sin código ni controles implementados; sincronización y comprobaciones en [[Seguimiento Nexo]].

## 2026-10-30 · Propuesta de arquitectura y NFC

Víctor plantea web principalmente móvil, administración Fideresto y comercio con dueño/camarero. Aclara que verificar móvil activa afiliación sin aprobación manual y que camarero puede registrar canjes. FID-034–037 separan propuesta de usuario, aclaraciones confirmadas y recomendación técnica. Se documentan arquitectura v0.1, matriz de permisos, PWA/backend modular/stack candidato, NFC URL estable y alternativas de grabación Android/iPhone. Fuentes oficiales consultadas; no se probó hardware ni se implementó aplicación. Agenda del camarero y flujo NFC cotidiano pendientes de validar. Plan y copia NEXO según [[Seguimiento Nexo]].

## 2026-10-30 · Primera base de aplicación

Víctor pide comenzar, se propone como piloto y elige Supabase. Se conecta Supabase MCP, se consulta organización/proyectos y se elige Victor Vilchez/París. Intento de creación no completado por confirmación caducada; coste consultado 10 USD/mes. Víctor decide aplazar creación. No se crea infraestructura ni se aplica migración a proyectos ajenos. FID-038–040.

Implementada web Next.js/TypeScript con acceso Supabase SSR, permisos servidor, configuración, NFC/QR, administración inicial y demo ficticia separada. Migración con RLS/grants/auditoría y pruebas locales PGlite. Tests, tipos y build superados; revisión visual de escritorio y composición móvil estática. No hay autenticación alojada ni operaciones reales de consumidor/sellos/Wallet/WhatsApp todavía. Guía de desarrollo y estado actual actualizados; NEXO según [[Seguimiento Nexo]].

## 2026-10-30 · Revisión visual Crystal Clear

Víctor indica que la demo se ve bien, pero insiste en eliminar colores/estilo de Nexo y pide cristal claro. FID-041. Se sustituyen verdes/oliva y énfasis serif por vidrio blanco, azul hielo y tipografía de sistema; barra flotante, reflejos, tarjetas, acceso, formularios, marca/icono inicial y manifest coherentes. Ejecución concreta por revisar, sin dar marca final por aprobada.

Cinco pruebas existentes, tipos y build superados. El primer chequeo detecta tipos generados duplicados en .next; se eliminan únicamente esos duplicados de caché. Al reaparecer copias numeradas se excluyen del análisis las copias con espacios en nombre dentro de .next, conservando los tipos originales y validadores. Se verifica de nuevo sin cambiar permisos ni modelo. Revisión visual de escritorio/acceso/formulario y composición móvil estática a 390 px. Muestras de contraste y alternativas sin desenfoque/reducción de transparencia documentadas en [[Identidad e interfaz]]. NEXO y publicación según [[Seguimiento Nexo]].

## 2026-10-30 · Referencia visual y siguiente entrega

Víctor recibe positivamente Crystal Clear y pide próximos pasos y mantener NEXO actualizado. FID-042: base visual adoptada para continuar, sin aprobar marca comercial final. Se propone completar núcleo persistente y recorrido cliente/camarero con pruebas locales, seguido de conexiones reales y preparación del piloto. No se implementan operaciones ni se autoriza creación de Supabase por esta planificación. [[Siguiente entrega]] recoge criterios y límites. Identidad, estado, plan e índice del vault actualizados; seguimiento NEXO según [[Seguimiento Nexo]].
