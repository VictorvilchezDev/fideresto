# Estado actual

Actualizado: 30 de octubre de 2026. Núcleo persistente y emisión inicial Wallet preparada localmente.

## Decisiones vigentes

Fideresto para bares/cafeterías en España. Víctor será a priori el primer comercio piloto; datos de su negocio por concretar. Método Nexo para cerebro y seguridad, identidad visual independiente. Requisitos canónicos: [[Requisitos confirmados]], [[Reglas de sellos y premios]] y [[Decisiones]].

Web principalmente móvil, administración Fideresto y comercio con dueño/camarero; consumidor sin vista en la app: consulta su tarjeta/sellos en Wallet. Alta del consumidor al verificar móvil sin aprobación manual; camarero confirma sellos, canjea y solicita correcciones motivadas. Dueño configura y autoriza. NFC/QR, ambos Wallet y WhatsApp del negocio siguen siendo núcleo del piloto.

Supabase elegido para PostgreSQL. Organización Victor Vilchez y París seleccionadas, pero proyecto SIN CREAR: coste cotizado 10 USD/mes; Víctor pide dejar su creación pendiente. No se autoriza ese coste. No se usan proyectos Supabase de otras apps.

## Implementado localmente

- Next.js 16.4.3, React/TypeScript y SDK Supabase SSR; dependencias/lockfile publicados con el código.
- Login profesional preparado, verificación de usuario en servidor, selector de comercio y permisos dueño/camarero; panel de administración acotado para provisionar comercio.
- Formulario del programa: sellos, premio en texto libre, mínimo incluido 0 y caducidades independientes/desactivables.
- Gestión de etiquetas por dueño, enlace estable, QR descargable y escritura Web NFC condicionada a compatibilidad. Entrada pública mínima por etiqueta; no suma sellos.
- Migración versionada de comercios, pertenencias, programa, NFC y auditoría; RLS/grants y funciones administrativas sin clave de servicio en runtime.
- Demo `/demo` con datos ficticios y estado efímero: roles, configuración y sellos/canje simulados. No es acceso real ni almacena clientes. Visual Crystal Clear aplicado tras nueva corrección de Víctor: vidrio blanco/frío y azul, sin verde/oliva. Víctor la valora positivamente y se adopta como referencia para continuar; ver [[Identidad e interfaz]].

- Núcleo local persistente: afiliaciones con verificación exigida por SQL, sellos, premios con condiciones guardadas, canjes, correcciones motivadas/autorizadas e historial. Laboratorio ficticio `/laboratorio`, componente profesional/API preparados para Supabase y gestión profesional de fichas por nombre/teléfono. Vista y ruta de consumidor retiradas. Detalles y límites en [[Nucleo de fidelizacion]].

## Avance Wallet vigente

Generadores Apple `.pkpass`, Google REST/Save JWT y entrega puntual de 15 minutos implementados. Identidad estable por comercio/tarjeta, sin contacto en pase; personal autorizado y teléfono verificado exigidos en SQL. `/prueba-qr` ahora muestra tarjeta ficticia con opciones cerradas sin credenciales. Víctor confirma que no tiene cuentas emisoras; ninguna contratación. 39 comprobaciones contando subcasos (cuatro migraciones PGlite), tipos/build superados. Firma Apple con CA ficticia y JWT Google verificados, REST simulado. Vista previa revisada en navegador y servidor LAN actualizado. Sin instalación real ni actualización automática. Ver [[Emision de tarjetas Wallet]] y `docs/WALLET.md`.

## Comprobaciones anteriores

`npm test`: 30 comprobaciones contando subcasos SQL; tres migraciones reales en PGlite. Tipos/build superados. Se añaden búsqueda y edición por dueño/camarero, teléfonos equivalentes/duplicados, mismo teléfono en dos negocios, aislamiento, versiones y evolución del dataset anterior sin perder historial. Navegador: nombre/teléfono, selección, edición, duplicado rechazado y propio número permitido. Ver [[Clientes por establecimiento]]; las pruebas locales no validan Supabase alojado, carreras multisesión o Wallet reales.

Corrección del QR de demo: origen de prueba separado y acceso por IP privada en instancia de producción del puerto 3019, con laboratorio cerrado. Navegador/HTTP comprobados desde el ordenador; móvil físico aún no probado. El destino ahora muestra la vista previa Wallet del avance anterior; sin alta ni instalación reales. Ver [[Prueba QR desde movil]].

## Pendiente

Crear/conectar Supabase cuando Víctor decida, aplicar migración y comprobar Auth/RLS en el servicio real. MFA, invitaciones/revocación desde panel, imagen de tarjeta, recorrido puntual de alta/verificación y emisión/recuperación de pase Wallet, comprobación de operaciones en el servicio alojado y de concurrencia multisesión, Wallet, WhatsApp, agenda, trabajos en segundo plano, alojamiento web, copias y piloto real. El flujo NFC cotidiano sigue por validar; ninguna prueba con chips físicos aún.

## Aclaración de fichas

Dueño y camarero buscan por nombre/teléfono y editan datos, incluido móvil. Teléfono único por establecimiento, repetible en otros negocios con tarjeta/datos independientes. La identidad interna estable conserva sellos al cambiarlo. Ver [[Clientes por establecimiento]].

## Prioridad siguiente

[[Siguiente entrega]]: cuentas emisoras propias y HTTPS cuando Víctor decida, instalación en ambos Wallet y actualización automática. Alta/verificación puntual y Supabase cuando se autorice su creación; comprobar proveedor/concurrencia. QR/NFC cotidiano, WhatsApp, agenda y preparación del piloto siguen en alcance. No se autoriza gasto por este avance.

## Ubicación y continuidad

Repositorio `outputs/fideresto`; remoto autorizado `https://github.com/VictorvilchezDev/fideresto.git`, rama `main`. Git contiene código y cerebro; NEXO la planificación, sin sincronización automática. Ver [[Seguimiento Nexo]] para revisión/IDs actuales. Objetivo revisable de piloto 31/01/2027.

Previsualización de esta sesión: `http://127.0.0.1:3017/laboratorio` (núcleo ficticio persistente) y `http://127.0.0.1:3017/demo` (visual efímera). No es un despliegue y necesita que el servidor local siga activo. Reproducción/conexión en `docs/DESARROLLO.md`. No se ha registrado un proyecto en la barra lateral de Codex ni creado otro chat.
