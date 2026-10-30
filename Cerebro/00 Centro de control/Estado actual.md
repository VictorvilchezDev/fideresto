# Estado actual

Actualizado: 30 de octubre de 2026. Primera base de aplicación local.

## Decisiones vigentes

Fideresto para bares/cafeterías en España. Víctor será a priori el primer comercio piloto; datos de su negocio por concretar. Método Nexo para cerebro y seguridad, identidad visual independiente. Requisitos canónicos: [[Requisitos confirmados]], [[Reglas de sellos y premios]] y [[Decisiones]].

Web principalmente móvil, administración Fideresto y comercio con dueño/camarero; consumidor con recorrido separado. Alta del consumidor al verificar móvil sin aprobación manual; camarero confirma sellos, canjea y solicita correcciones motivadas. Dueño configura y autoriza. NFC/QR, ambos Wallet y WhatsApp del negocio siguen siendo núcleo del piloto.

Supabase elegido para PostgreSQL. Organización Victor Vilchez y París seleccionadas, pero proyecto SIN CREAR: coste cotizado 10 USD/mes; Víctor pide dejar su creación pendiente. No se autoriza ese coste. No se usan proyectos Supabase de otras apps.

## Implementado localmente

- Next.js 16.4.3, React/TypeScript y SDK Supabase SSR; dependencias/lockfile publicados con el código.
- Login profesional preparado, verificación de usuario en servidor, selector de comercio y permisos dueño/camarero; panel de administración acotado para provisionar comercio.
- Formulario del programa: sellos, premio en texto libre, mínimo incluido 0 y caducidades independientes/desactivables.
- Gestión de etiquetas por dueño, enlace estable, QR descargable y escritura Web NFC condicionada a compatibilidad. Entrada pública mínima por etiqueta; no suma sellos.
- Migración versionada de comercios, pertenencias, programa, NFC y auditoría; RLS/grants y funciones administrativas sin clave de servicio en runtime.
- Demo `/demo` con datos ficticios y estado efímero: roles, configuración y sellos/canje simulados. No es acceso real ni almacena clientes. Visual Crystal Clear aplicado tras nueva corrección de Víctor: vidrio blanco/frío y azul, sin verde/oliva. Víctor la valora positivamente y se adopta como referencia para continuar; ver [[Identidad e interfaz]].

## Comprobado

`npm test`: cinco pruebas, incluida ejecución de migración y casos SQL de aislamiento/escalada entre dos comercios sobre PGlite. `npm run typecheck` y `npm run build` superados. Revisión de navegador de demo, configuración, obtención/canje ficticio, rol de camarero y redirección de administración sin configuración. Composición móvil comprobada con captura estática a 390 px; no se ha probado en móvil físico. Enlaces del vault y diff comprobados al publicar.

## Pendiente

Crear/conectar Supabase cuando Víctor decida, aplicar migración y comprobar Auth/RLS en el servicio real. MFA, invitaciones/revocación desde panel, imagen de tarjeta, consumidores con teléfono verificado, movimientos reales de sellos/canjes/correcciones y caducidad, Wallet, WhatsApp, agenda, trabajos en segundo plano, alojamiento web, copias y piloto real. El flujo NFC cotidiano sigue por validar; ninguna prueba con chips físicos aún.

## Prioridad siguiente

[[Siguiente entrega]]: modelo de consumidores/movimientos/premios y recorrido del camarero, con sellos/canjes/correcciones persistentes probados localmente con datos ficticios. Después, conectar y verificar Supabase cuando se autorice su creación, verificación telefónica y ambos Wallet/WhatsApp/NFC/QR, además de agenda y operación del piloto. La propuesta de orden no altera la fecha objetivo ni autoriza costes.

## Ubicación y continuidad

Repositorio `outputs/fideresto`; remoto autorizado `https://github.com/VictorvilchezDev/fideresto.git`, rama `main`. Git contiene código y cerebro; NEXO la planificación, sin sincronización automática. Ver [[Seguimiento Nexo]] para revisión/IDs actuales. Objetivo revisable de piloto 31/01/2027.

Previsualización de esta sesión: `http://127.0.0.1:3017/demo`. No es un despliegue y necesita que el servidor local siga activo. Reproducción/conexión en `docs/DESARROLLO.md`. No se ha registrado un proyecto en la barra lateral de Codex ni creado otro chat.
