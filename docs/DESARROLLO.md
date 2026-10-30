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

Sin Supabase configurado están disponibles la demo visual ficticia y, si se habilita expresamente, el laboratorio local; las rutas profesionales redirigen al acceso. No existe usuario/contraseña de prueba oculto ni bypass de autorización. La demo conserva cambios únicamente en memoria y no graba chips físicos.

## Supabase: creación pendiente

Víctor elige Supabase, organización Victor Vilchez y región París. Consulta de coste del 30/10/2026: 10 USD/mes. El usuario decide aplazar la creación; no se ha creado el proyecto ni aplicado SQL a otros proyectos.

Cuando se autorice su creación:

1. Crear un proyecto dedicado a Fideresto. Inspeccionar tablas existentes y confirmar el proyecto antes de aplicar migraciones.
2. Aplicar ambas migraciones de `supabase/migrations/` en orden: fundación y núcleo de fidelización. Nunca aplicar `supabase/tests/bootstrap-local.sql` al servicio alojado: es solo un sustituto de Auth para una base temporal de pruebas.
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

El núcleo de sellos/canjes/correcciones e historial/caducidad ya está implementado y probado localmente. Faltan clientes reales, recorrido de verificación/acceso por móvil, comprobación alojada/multisesión, imagen de tarjeta, Wallet, WhatsApp, agenda y colas. El piloto exige estas integraciones reales; no dar la demo por producto terminado.

## Comprobaciones

```sh
npm test
npm run typecheck
npm run build
```

Las pruebas de SQL ejecutan la migración real en PostgreSQL WASM/PGlite con un esquema Auth mínimo ficticio. Cubren aislamiento entre comercios, límites dueño/camarero, escalada de permisos, publicación mínima y revocación de etiquetas. No prueban Supabase Auth, PostgREST o el despliegue remoto. Los fixtures se revierten y la base está en memoria.

El manifest permite preparar el uso como web instalada. No hay soporte de operaciones sin conexión. Alojamiento, integración de mensajería y presupuestos siguen pendientes.

## Laboratorio persistente

En `.env.local`, añadir `FIDERESTO_LOCAL_LAB=1` y arrancar `npm run dev`. Abrir `/laboratorio`: Alex/Mar ficticios, búsqueda por nombre/teléfono y roles dueño/camarero de prueba, pago → sello → premio → canje → solicitud motivada → autorización del dueño. Tres sellos por premio al arrancar el fixture; dueño puede cambiar ese programa independiente de `/demo`. Al recargar se mantiene el historial.

PGlite guarda en `.data/loyalty-lab-v1/` fuera de Git. No introducir datos reales ni publicar el servidor de desarrollo. Para reiniciar el dataset, detener el servidor y mover esa carpeta a un respaldo local; al arrancar se reconstruye con fixtures. El bootstrap y los fixtures NUNCA se ejecutan en Supabase alojado. La inicialización del laboratorio v1 es de una vez; futuras migraciones necesitarán adaptar/recrear ese dataset ficticio, no se aplican silenciosamente sobre él.

La API del laboratorio exige desarrollo + bandera explícita + host loopback + Origin coincidente. En producción `/laboratorio` y su API devuelven 404, incluso con la bandera: comprobado mediante solicitudes HTTP a `next start` local. La cola/transacción aísla los actores de prueba. El adaptador profesional usa Supabase Auth/RPC y nunca acepta `persona` como autorización.

`/api/loyalty`: POST JSON con comercio, código opaco de tarjeta y comando opcional (acción, clave UUID idempotente y payload); origen de aplicación y usuario validado en servidor. RPC aplican permisos incluso si se llama directamente a PostgREST. La antigua ruta `/tarjeta/[merchantId]` se ha retirado: consumidor solo Wallet; alta/verificación y emisión puntual pendientes. Alta RPC solo tras `phone_confirmed_at` real; no enviar un «verified=true» inventado.

Pruebas: 22 comprobaciones contando subcasos SQL. Incluyen temporadas, expiración, reintentos/doble canje secuencial, correcciones, permisos y privacidad de motivos, ventana de historial, gate del laboratorio y límite de lectura JSON. PGlite tiene una conexión: la carrera de dos sesiones PostgreSQL sigue pendiente. No se han usado asesores de un proyecto ajeno. Validar asesores, Auth, PostgREST, concurrencia y carga cuando se cree el proyecto dedicado.

Los movimientos permanecen aunque se corrijan. Hay 60 movimientos recientes, hasta 100 premios y 100 solicitudes pendientes por tarjeta en la respuesta actual; paginación y bandeja global pendientes. El mínimo se comprueba mediante declaración del empleado, sin verificación independiente del ticket.

CLI Supabase fijada en 2.122.0. Para evitar escribir configuración en el home puede usarse `SUPABASE_HOME=/ruta/de/trabajo/cli` (sin credenciales en el repo). Crear futuras migraciones con `npm exec -- supabase migration new nombre`, previa consulta de `--help`. No hace falta arrancar Docker ni crear Supabase alojado para ejecutar estas pruebas.

## Aclaración: consumidor solo Wallet y fichas del local

No existe vista web del cliente ni ruta `/tarjeta/[merchantId]`; rol `consumer` retirado del laboratorio. El consumidor consultará su pase y sellos en Apple/Google Wallet cuando se integren. El alta/verificación/emisión será puntual. Las menciones anteriores de tarjeta propia web describen una propuesta sustituida.

Tercera migración `20261030122842_customer_phone_directory.sql`: teléfono normalizado y único por comercio, búsqueda profesional acotada, edición con versión/auditoría y acceso a tarjeta profesional exclusivo de miembros activos. Dueño y camarero pueden buscar y editar. `/api/loyalty` recibe `query` para búsqueda o `card` y `profile` para edición; no combina búsqueda/mutaciones en una petición. SQL aplica el aislamiento aunque se invoque directamente RPC.

El laboratorio evoluciona en sitio su dataset ficticio v1 con esta migración, sin reiniciar historial. Los mismos teléfonos pueden estar en otros comercios con ficha y tarjeta independientes. Editar no toca Auth global ni otros locales; nuevo número queda sin verificación de titularidad, sin impedir guardar ni otorgar acceso. No hay aún envío real.

28 comprobaciones automáticas, tipos y build. Pruebas de unicidad/formato, búsqueda por nombre/teléfono, perfil con versión, cumpleaños, permisos, repetición entre negocios y migración sobre ledger anterior. No se ha ensayado carrera real multisesión ni servicio alojado.

## Escanear el QR de demo desde un móvil

`127.0.0.1`/`localhost` apuntan al dispositivo que abre el QR. La demo ahora bloquea generar QR loopback. Para una prueba en la misma Wi-Fi, configurar `FIDERESTO_LAN_PREVIEW=1` y `FIDERESTO_DEMO_QR_ORIGIN=http://IP_PRIVADA:3019` en `.env.local`; ejecutar `npm run build` y `npm exec -- next start --hostname IP_PRIVADA --port 3019`. El desarrollo sigue en loopback; no publicar su laboratorio. Regenerar el QR en NFC y QR. Los anteriores impresos/descargados no cambian.

La instancia de producción devuelve 404 en laboratorio/API sintética; el QR ficticio abre `/prueba-qr`, solo una comprobación de conexión sin datos ni emisión Wallet. Mantener ordenador/servidor encendidos y teléfono en la misma red con acceso entre dispositivos. Si cambia la IP, ajustar origen, recompilar/reiniciar y regenerar QR. Para acceso fuera de esa Wi-Fi se requiere una URL HTTPS de prueba. No se ha configurado alojamiento público ni aceptado costes. Ver el cerebro para evidencias y límites.
