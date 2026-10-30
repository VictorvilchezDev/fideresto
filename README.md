# Fideresto

Fidelización para bares y cafeterías en España. Web pensada primero para móvil, con administración de plataforma y roles de dueño y camarero por comercio.

Primera base local en Next.js/TypeScript. Supabase elegido para datos y preparado para acceso profesional; proyecto alojado pendiente de creación por decisión de aplazar su coste. Sin despliegue ni clientes reales.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Demo: `http://127.0.0.1:3000/demo`. En esta sesión se usa `http://127.0.0.1:3017/demo`.

## Esta entrega

Acceso profesional preparado, permisos de servidor, configuración del programa, etiquetas NFC/QR y alta administrativa del comercio. Migración Supabase con RLS, auditoría y pruebas locales. Demo ficticia separada para revisar la interfaz; sus sellos/canjes son simulados y no se guardan.

El premio es un campo de texto libre. El mínimo admite 0 y las caducidades de sellos/premios se configuran por separado. NFC/QR, Wallet de iOS/Android y WhatsApp siguen siendo núcleo del piloto; las integraciones Wallet/WhatsApp y la verificación telefónica aún no están implementadas.

## Documentación

- [Guía de desarrollo y conexión Supabase](docs/DESARROLLO.md).
- [Estado actual](Cerebro/00%20Centro%20de%20control/Estado%20actual.md).
- [Inicio del cerebro](Cerebro/00%20Centro%20de%20control/Inicio.md).
- [Arquitectura](Cerebro/02%20Arquitectura/Arquitectura%20y%20entornos.md).
- [Seguridad](Cerebro/04%20Seguridad/Seguridad%20desde%20el%20inicio.md).
- [Plan y NEXO](Cerebro/06%20Planificacion/Seguimiento%20Nexo.md).

```sh
npm test
npm run typecheck
npm run build
```

Repositorio autorizado: https://github.com/VictorvilchezDev/fideresto.git. Método de Nexo para mantener el cerebro y diseñar seguridad desde el inicio; diseño visual propio, todavía por revisar. Fecha objetivo revisable del piloto: 31/01/2027.
