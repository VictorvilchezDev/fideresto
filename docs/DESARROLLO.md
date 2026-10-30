# Desarrollo de Fideresto

Primera entrega local. No es todavía un piloto operativo.

## Ejecutar

Node.js 20.9 o posterior. Se ha comprobado con Node 24.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Abrir `http://127.0.0.1:3000/demo`. Si se utiliza otro puerto, ajustar `NEXT_PUBLIC_APP_URL` al origen exacto antes de generar enlaces NFC. En esta sesión la demo está en el puerto 3017.

Sin Supabase configurado solo está disponible la demo pública ficticia; las rutas profesionales redirigen al acceso. No existe usuario/contraseña de prueba oculto ni bypass de autorización. La demo conserva cambios únicamente en memoria y no graba chips físicos.

## Supabase: creación pendiente

Víctor elige Supabase, organización Victor Vilchez y región París. Consulta de coste del 30/10/2026: 10 USD/mes. El usuario decide aplazar la creación; no se ha creado el proyecto ni aplicado SQL a otros proyectos.

Cuando se autorice su creación:

1. Crear un proyecto dedicado a Fideresto. Inspeccionar tablas existentes y confirmar el proyecto antes de aplicar migraciones.
2. Aplicar `supabase/migrations/202610300001_foundation.sql`. Nunca aplicar `supabase/tests/bootstrap-local.sql` al servicio alojado: es solo un sustituto de Auth para una base temporal de pruebas.
3. Configurar la URL y clave **publishable** en `.env.local`. No utilizar la clave secret/service_role en variables públicas ni en el runtime de esta base.
4. Crear las cuentas profesionales mediante Supabase Auth de forma controlada, con correo verificado. No hay alta pública de dueños/camareros ni invitaciones desde el panel todavía.
5. Asignar el primer administrador por SQL controlado, usando el UUID de esa cuenta verificada:

```sql
insert into private.platform_admins (user_id)
values ('UUID_REAL_DE_AUTH');
```

6. El administrador entra por `/app` y accede a `/admin`. Crea el comercio con el nombre y el correo verificado del dueño. Puede ser la misma cuenta de Víctor con pertenencia al comercio explícita; ser administrador global no concede esa pertenencia automáticamente.
7. Para esta primera etapa, agregar un camarero existente por SQL controlado:

```sql
insert into public.memberships (merchant_id, user_id, role)
values ('UUID_REAL_DEL_COMERCIO', 'UUID_REAL_DE_AUTH', 'staff');
```

8. Comprobar login/logout, propietarios y camareros, aislamiento de dos comercios, revocación de pertenencia, acceso público y políticas RLS contra Supabase real. Revisar avisos de seguridad. Preparar MFA antes de un piloto con datos reales.

No guardar UUID personales, contraseñas o claves reales en ejemplos, Git o cerebro. Las cuentas de consumidor y la verificación del teléfono se implementarán aparte; el acceso profesional por correo no sustituye ese requisito.

## Qué hace esta entrega

- Configurar programa y etiquetas como dueño, con autorización en servidor y RLS.
- Lista del equipo, sin invitaciones ni revocación desde UI aún.
- Administra el alta de comercios sin acceso operativo global por defecto.
- URL NFC estable, QR descargable, desactivación y escritura NDEF en navegadores compatibles. En iPhone se necesita una app de escritura compatible o instalación asistida. No se ha probado hardware NFC.
- Las páginas públicas de etiqueta muestran el programa y explican que el registro está pendiente.
- Demo interactiva para revisar interfaz, roles y flujo ficticio.

Faltan clientes reales, verificación de móvil, sellos/canjes/correcciones persistentes, historial de premios, caducidad aplicada, imagen de tarjeta, Wallet, WhatsApp, agenda y colas. El piloto exige estas integraciones reales; no dar la demo por producto terminado.

## Comprobaciones

```sh
npm test
npm run typecheck
npm run build
```

Las pruebas de SQL ejecutan la migración real en PostgreSQL WASM/PGlite con un esquema Auth mínimo ficticio. Cubren aislamiento entre comercios, límites dueño/camarero, escalada de permisos, publicación mínima y revocación de etiquetas. No prueban Supabase Auth, PostgREST o el despliegue remoto. Los fixtures se revierten y la base está en memoria.

El manifest permite preparar el uso como web instalada. No hay soporte de operaciones sin conexión. Alojamiento, integración de mensajería y presupuestos siguen pendientes.
