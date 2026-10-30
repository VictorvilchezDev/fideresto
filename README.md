# Fideresto

Nombre de trabajo según el repositorio · Inicio: 30 de octubre de 2026

Espacio de trabajo local para desarrollar un servicio de fidelización y recuperación de clientes para comercios en España.

## Estado

Proyecto preparado para definición y prototipo. Todavía no hay una aplicación ejecutable, servicios contratados ni integraciones activadas.

## Objetivo

Ayudar al comercio a conseguir más visitas recurrentes y evaluar si el beneficio adicional justifica el coste del servicio.

## Contexto confirmado

- Mercado inicial: España.
- Víctor indica que hay numerosas cafeterías y restaurantes disponibles para mostrar una demo; aún no se ha seleccionado un establecimiento piloto.
- Referencia: https://www.instagram.com/reels/Ddm8LVdAB_W/
- La propuesta de referencia combina tarjeta de sellos digital, registro de clientes y campañas por WhatsApp.
- Se quiere estudiar y ejecutar una versión propia con mejoras; las funciones y la marca se concretarán durante el desarrollo.

## Punto de partida propuesto

Comenzar con cafeterías y un programa de sellos por visita. Es una hipótesis de producto para validar, no una elección definitiva de sector, precio o marca.

El primer entregable será una demo con datos ficticios que permita recorrer:

1. Registro desde un QR o enlace del comercio.
2. Consulta de una tarjeta digital con sellos y recompensa.
3. Validación de una visita desde la vista del empleado.
4. Canje de la recompensa una sola vez.
5. Consulta de clientes, visitas y canjes desde el panel del propietario.

Las campañas se mostrarán como simulaciones identificadas. Los mensajes reales, Apple Wallet y Google Wallet se integrarán en una etapa posterior del piloto.

## Documentos

- [Plan inicial y criterios de aceptación](docs/PLAN-INICIAL.md).
- [Segundo cerebro: empezar aquí](Cerebro/00%20Centro%20de%20control/Inicio.md).
- [Estado actual](Cerebro/00%20Centro%20de%20control/Estado%20actual.md).
- [Decisiones y sus motivos](Cerebro/05%20Seguimiento/Decisiones.md).
- [Seguridad desde el inicio](Cerebro/04%20Seguridad/Seguridad%20desde%20el%20inicio.md).
- [Identidad visual propia](Cerebro/03%20Diseno/Identidad%20e%20interfaz.md).
- [Protocolo para asistentes](AGENTS.md).

Nexo es referencia del método de mantenimiento del cerebro y de seguridad. El diseño visual será distinto; «CristalWhite» es una posibilidad por explorar. La interpretación anterior de usar «Espacio claro» quedó corregida por Víctor.

## Organización del trabajo

- Código, documentación y recursos del producto permanecerán dentro de esta carpeta.
- El historial de cambios se gestiona con Git y pushes al remoto autorizado: `https://github.com/VictorvilchezDev/fideresto.git`.
- La tecnología se elegirá al preparar la demo, considerando el despliegue, mantenimiento y presupuesto.
- Las credenciales se guardarán fuera de Git mediante variables de entorno.
- Los datos ficticios permitirán enseñar la demo antes de incorporar datos de clientes reales.
- La separación de comercios, permisos y reglas de sellos/canjes se diseñará desde el inicio. Los controles documentados todavía no están implementados.

## Próxima decisión útil

Seleccionar un comercio concreto y conocer cómo atiende, qué incentivo podría ofrecer y quién validaría las visitas. No hace falta cerrar marca o dominio para construir la demo.
