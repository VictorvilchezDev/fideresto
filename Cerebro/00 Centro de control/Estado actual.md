# Estado actual

Actualizado: 30 de octubre de 2026.

## Contexto confirmado

Proyecto de fidelización para comercios, con primer mercado en España. Víctor considera que hay cafeterías/restaurantes disponibles para mostrarlo; aún no se ha elegido uno concreto. Nombre de trabajo: Fideresto, a partir del repositorio indicado; marca final pendiente.

Método: Nexo como referencia para el cerebro y la seguridad. Diseño visual independiente; «CristalWhite» solo como posibilidad. Fuente vigente: [[Decisiones]].

## Existe realmente

- Carpeta local `outputs/fideresto` dentro del espacio de este chat.
- Repositorio Git local en `main`, documentos iniciales, instrucciones `AGENTS.md` y este vault.
- Proyecto Fideresto creado por MCP en NEXO, ID `c16a8d9e-b397-4a52-be44-2c0fbac1b95d`: seis fases y 29 tareas comprobadas en revisión 2. Base documental completada, definición de alcance en curso y resto pendiente. Ver [[Seguimiento Nexo]].
- Fecha objetivo del piloto elegida por Víctor: 31/01/2027. Fechas intermedias y alcance detallado son propuestas revisables.
- Propuesta de [[Pantallas y flujos]] v0.1 y [[Plan inicial]] v0.2 redactadas; no hay aceptación final del diseño o reglas del programa.
- Consulta de `git ls-remote` completada sin referencias: el repositorio remoto estaba vacío al comprobarlo.

## No implementado

No hay aplicación ejecutable, base de datos, autenticación, tarjetas Wallet, mensajería ni despliegue. Ningún control de seguridad está implementado por el hecho de estar documentado.

## Sincronización

Destino autorizado: `https://github.com/VictorvilchezDev/fideresto.git`. Base documental publicada en `main`: commit inicial `7240fddf2603146466d00787e17f623c67f12e7e`, comprobado contra `git ls-remote`. La rama local sigue `origin/main`. El historial de Git es la referencia para el último commit; esta nota registra la primera publicación verificada.

Verificaciones: 11 notas con enlaces internos resueltos, `git diff --cached --check` correcto y exclusiones de `.env`, secretos y archivos privados comprobadas. Son verificaciones documentales y de Git, no pruebas de una aplicación.

## Siguiente trabajo

1. Concretar flujos de cliente, empleado y propietario.
2. Diseñar el modelo de amenazas y matriz de permisos antes de implementar operaciones.
3. Preparar una propuesta visual propia, explorando «CristalWhite» sin darla por aceptada.
4. Elegir stack y desarrollar una demo local con datos ficticios y funciones externas simuladas de forma explícita.

No se ha creado un proyecto registrado en la barra lateral de Codex ni un chat nuevo; la carpeta está disponible desde este chat. El proyecto de seguimiento en NEXO sí está creado. No hay sincronización automática entre NEXO y GitHub.
