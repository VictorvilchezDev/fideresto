# Fideresto: protocolo de trabajo

La memoria del proyecto es el vault Markdown `Cerebro/`, compatible con Obsidian.

## Al retomar

1. Leer `Cerebro/00 Centro de control/Estado actual.md`.
2. Consultar `Cerebro/00 Centro de control/Inicio.md`.
3. Revisar `Cerebro/05 Seguimiento/Decisiones.md` y las notas relevantes antes de asumir requisitos.

## Método confirmado por Víctor

- Usar Nexo como referencia de mantenimiento del cerebro y de trabajo de seguridad, no como identidad visual ni como autorización para acceder a su infraestructura.
- Diseñar la seguridad desde el inicio: analizar riesgos, definir controles, implementar y comprobar. No aplazar el aislamiento o los permisos hasta después de la demo.
- El estilo visual es propio. «CristalWhite» es una posibilidad sugerida, todavía sin especificación ni diseño aprobado. La elección anterior «Nexo: Espacio claro» quedó expresamente corregida por Víctor.
- Repositorio autorizado para commits y pushes: `https://github.com/VictorvilchezDev/fideresto.git`. Publicar cambios coherentes y comprobados; nunca force-push por defecto.

## Al cerrar trabajo relevante

Actualizar la nota temática, las decisiones y pendientes, el diario y el estado actual. Registrar qué se comprobó y qué no. Separar confirmado, propuesto, pendiente y sustituido; conservar motivos y fuentes sin duplicar especificaciones.

## Desarrollo y seguridad

- Consultar `Cerebro/04 Seguridad/Seguridad desde el inicio.md` antes de diseñar datos, acceso, sellos, canjes o integraciones.
- Aislar comercios y comprobar permisos en el servidor; QR y NFC públicos no conceden permisos de empleado.
- Probar con datos ficticios y recursos independientes. No reutilizar conexiones, secretos, bases ni autorizaciones operativas de otras aplicaciones.
- Mantener credenciales, claves de Wallet, datos personales y evidencias privadas fuera de Git y del vault.
- Documentar controles propuestos, implementados, probados y desplegados como estados diferentes. Una prueba local no verifica producción.
- El stack, alojamiento, presupuesto, precio y marca final siguen pendientes; no convertir recomendaciones anteriores en decisiones.

Este archivo orienta el trabajo; el vault contiene los detalles. No garantiza memoria automática: hay que leerlo y mantenerlo.
