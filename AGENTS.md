# Fideresto: protocolo de trabajo

La memoria del proyecto es el vault Markdown `Cerebro/`, compatible con Obsidian.

## Al retomar

1. Leer `Cerebro/00 Centro de control/Estado actual.md`.
2. Consultar `Cerebro/00 Centro de control/Inicio.md`.
3. Revisar `Cerebro/05 Seguimiento/Decisiones.md` y las notas relevantes antes de asumir requisitos.

## Método confirmado por Víctor

- Usar Nexo como referencia de mantenimiento del cerebro y de trabajo de seguridad, no como identidad visual ni como autorización para acceder a su infraestructura.
- Diseñar la seguridad desde el inicio: analizar riesgos, definir controles, implementar y comprobar. No aplazar el aislamiento o los permisos hasta después de la demo.
- Núcleo confirmado: bares/cafeterías; número de sellos, imagen y premio estacional configurables por comercio; NFC y QR; Wallet iOS/Android y WhatsApp reales para el piloto. Nuestro equipo realiza implantación, configuración inicial y formación. Consultar `Cerebro/01 Producto/Requisitos confirmados.md`; no rebajar el piloto a una demo web parcial.
- El estilo visual es propio: dirección Crystal Clear confirmada por Víctor, con blancos fríos, vidrio translúcido y acento azul discreto. La interfaz verde/oliva queda sustituida. Consultar `Cerebro/03 Diseno/Identidad e interfaz.md`; base actual aceptada como referencia de continuidad; marca final y componentes futuros por concretar. La elección anterior «Nexo: Espacio claro» quedó expresamente corregida.
- Repositorio autorizado para commits y pushes: `https://github.com/VictorvilchezDev/fideresto.git`. Publicar cambios coherentes y comprobados; nunca force-push por defecto.

## Al cerrar trabajo relevante

Actualizar la nota temática, las decisiones y pendientes, el diario y el estado actual. Registrar qué se comprobó y qué no. Separar confirmado, propuesto, pendiente y sustituido; conservar motivos y fuentes sin duplicar especificaciones.

## Seguimiento en NEXO

Proyecto `c16a8d9e-b397-4a52-be44-2c0fbac1b95d`, creado por petición de Víctor. Fecha objetivo revisable del piloto: 31/01/2027. Consultar `Cerebro/06 Planificacion/Seguimiento Nexo.md` y el proyecto/tareas por MCP antes de actualizar; usar la revisión vigente y conservar cambios/comentarios ajenos. NEXO contiene planificación; el vault conserva las razones y el código vive en GitHub. No existe sincronización automática.

## Desarrollo y seguridad

- Consultar `Cerebro/04 Seguridad/Seguridad desde el inicio.md` antes de diseñar datos, acceso, sellos, canjes o integraciones.
- Aislar comercios y comprobar permisos en el servidor; QR y NFC públicos no conceden permisos de empleado.
- Probar con datos ficticios y recursos independientes. No reutilizar conexiones, secretos, bases ni autorizaciones operativas de otras aplicaciones.
- Mantener credenciales, claves de Wallet, datos personales y evidencias privadas fuera de Git y del vault.
- Documentar controles propuestos, implementados, probados y desplegados como estados diferentes. Una prueba local no verifica producción.
- Base implementada con Next.js/TypeScript y Supabase Auth/PostgreSQL preparado. El proyecto alojado de Supabase no se ha creado: Víctor aplaza el coste cotizado de 10 USD/mes. Alojamiento web, presupuesto, precio y marca final siguen pendientes. No crear recursos de pago sin autorización.

Este archivo orienta el trabajo; el vault contiene los detalles. No garantiza memoria automática: hay que leerlo y mantenerlo.

## Verificación del código

Ejecutar `npm test`, `npm run typecheck` y `npm run build` tras cambios relevantes. Las pruebas SQL usan PGlite con identidades ficticias y la migración real; no equivalen a comprobar Supabase alojado. Nunca ejecutar `supabase/tests/bootstrap-local.sql` en un proyecto real. La demo `/demo` es pública, ficticia y no persiste: no usarla como acceso ni respaldo de autorización. Las rutas reales aplican sesión validada y RLS.

## Laboratorio del núcleo

`/laboratorio` es una prueba local persistente con clientes ficticios; solo desarrollo, `FIDERESTO_LOCAL_LAB=1`, loopback y origen coincidente. Nunca introducir datos reales ni publicar el servidor de desarrollo. Dataset `.data/loyalty-lab-v1/` ignorado por Git. La API real usa sesión Supabase y RPC; jamás aceptar `persona` del laboratorio como autorización profesional. Ver `Cerebro/02 Arquitectura/Nucleo de fidelizacion.md`.

Las dos migraciones se prueban con PGlite. Tiene una sola conexión: no presentar reintentos/doble canje secuencial como prueba real de concurrencia entre sesiones. Validar esa carrera y asesores/Auth/PostgREST en el proyecto dedicado cuando se cree; no usar otro proyecto para suplir la creación aplazada.
