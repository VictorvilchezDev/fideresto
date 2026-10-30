# Arquitectura y entornos

## Estado

No hay stack, base de datos ni alojamiento elegidos. React/Node de Nexo y .NET de CuentasCEE no se heredan automáticamente por tomar su método como referencia.

## Propuesta técnica por concretar

Interfaz web adaptable a móvil, servicio que aplique las reglas y almacenamiento transaccional. Integraciones externas detrás de servicios separados para Wallet y mensajería. Elegir tecnologías cuando estén definidos los flujos y restricciones de operación.

## Límites desde el diseño

- El servidor verifica identidad, rol y pertenencia al comercio en cada operación.
- Identificadores enviados por navegador no demuestran autorización.
- Visitas, saldo de sellos y canjes necesitan reglas de concurrencia e idempotencia.
- Registro público y acceso del personal son recorridos distintos.
- Desarrollo y pruebas usan datos ficticios y recursos propios, independientes de otras aplicaciones.
- Migraciones, cuenta de ejecución y almacenamiento tendrán responsabilidades separadas.

## Alojamiento pendiente

Decidir si será servidor propio o compartido antes de preparar producción. En servidor propio, analizar también sistema y red; en uno compartido, definir el límite de responsabilidad y contener la aplicación sin modificar servicios ajenos. No hay infraestructura de Nexo autorizada para Fideresto por esta conversación.

## Git

Repositorio autorizado: `https://github.com/VictorvilchezDev/fideresto.git`. Trabajar con commits acotados, verificaciones proporcionales y pushes comprobados. No se ha acordado una estrategia de ramas o publicación de versiones; no forzar cambios sobre historia remota.
