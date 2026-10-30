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
