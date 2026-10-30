# Como mantener el cerebro

## Principio

Guardar el conocimiento que permite continuar: requisitos, decisiones y motivos, arquitectura, diseño, seguridad, pruebas, incidencias y próximos pasos. Notas específicas como referencia principal, índice para orientarse y estado breve para retomar.

## Estados de la información

- **Confirmado:** instrucción o respuesta explícita del usuario, con origen en [[Decisiones]].
- **Propuesto:** recomendación del asistente, todavía sin aceptación.
- **Pendiente:** información desconocida o elección abierta.
- **Sustituido:** acuerdo reemplazado; conservar fecha, motivo y nueva decisión.

Separar también documentado, implementado, probado y desplegado. No describir una intención como un resultado.

## Inicio de sesión

Leer [[Estado actual]], consultar [[Inicio]] y revisar [[Decisiones]]. Abrir solo las notas relevantes. Ante contradicción, la instrucción actual de Víctor prevalece y se registra la sustitución.

## Cierre de sesión relevante

1. Actualizar la nota temática afectada.
2. Registrar nuevas decisiones y sus motivos, o mantenerlas como propuestas.
3. Actualizar pendientes y planificación.
4. Añadir al [[Diario]] cambios, verificaciones, límites y siguiente paso.
5. Resumir el estado sin copiar toda la conversación.
6. Preparar un commit coherente y push al remoto autorizado cuando corresponda; comprobar el resultado.

## Higiene documental

Usar nombres de nota únicos y enlaces internos. Mantener una fuente principal por asunto. Las referencias conservan procedencia, sin copiar indiscriminadamente otros proyectos o el historial de sus chats.

No guardar contraseñas, tokens, claves privadas, credenciales de otras apps ni datos personales de clientes. Git no respalda los secretos excluidos ni la futura base de datos. No se ha configurado copia externa ni sincronización de Obsidian.
