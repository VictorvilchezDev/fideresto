# Identidad e interfaz

## Dirección vigente: Crystal Clear

El 30/10/2026 Víctor vuelve a corregir la propuesta inicial: «no quiero los colores y estilo de Nexo. Quiero un estilo cristalclear o algo así». Dirección clara y cristalina confirmada. Tras verla, Víctor responde «OH!! mucho mejor!»; se toma esta base visual como referencia para continuar. La primera interfaz verde/oliva queda sustituida.

Nexo aporta exclusivamente el método del cerebro y seguridad. No es referencia de paleta, tipografía, logotipo o composición. La elección anterior «Nexo: Espacio claro» fue corregida antes de diseñar y no autoriza a recuperarla.

## Interpretación implementada

- Fondo blanco frío con luces suaves azul hielo y lavanda; texto azul noche.
- Superficies blancas translúcidas, desenfoque y saturación contenidos, bordes luminosos y sombras suaves con reflejos interiores.
- Barra lateral flotante y tarjetas claras; el bloque destacado usa vidrio claro en lugar de una gran superficie oscura.
- Tipografía de sistema sin remates, sin el énfasis editorial en Georgia/cursiva de la primera propuesta.
- Botones azul frío con texto blanco y menú seleccionado visible. Sellos azules con reflejo suave.
- Símbolo de cristal en marca/icono inicial, tarjeta y manifest; el nombre y la identidad comercial final siguen abiertos.

Archivos: `src/app/globals.css`, `src/components/brand.tsx`, icono/manifest/tema y símbolo de la tarjeta. El flujo y los permisos mantienen su implementación previa.

## Legibilidad y adaptación

Texto principal `#18253d`, secundario `#5c6c83`, botón con parada más clara `#4268d9`. Comprobación de pares de referencia: blanco sobre botón 4,98:1; texto principal sobre `#edf4ff` 13,85:1; secundario sobre ese fondo 4,83:1. Son muestras concretas, no una auditoría completa de accesibilidad.

Se conservan foco visible y diseño adaptable. Sin soporte de backdrop-filter hay superficies opacas; prefers-reduced-transparency también reduce el efecto. Prefers-reduced-motion conserva sus controles. No añadir animación constante ni permitir que reflejos decorativos interfieran con texto o botones.

## Comprobaciones y alcance

Revisión por navegador del panel, formulario y acceso; composición móvil mediante captura estática a 390 px. Cinco pruebas existentes, tipos y build superados. No se ha probado un dispositivo físico. Ajuste cosmético de la base local; no completa integraciones, datos alojados ni funciones pendientes del piloto.

Base actual bien recibida por Víctor y adoptada como referencia de continuidad. La tarea de identidad/tokens permanece en curso hasta cerrar la definición de alcance de la que depende; marca comercial definitiva, modo oscuro y componentes futuros siguen abiertos.
