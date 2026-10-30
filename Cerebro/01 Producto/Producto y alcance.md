# Producto y alcance

## Confirmado

Víctor quiere ejecutar un servicio de fidelización para bares y cafeterías en España. El comercio configura número de sellos, imagen y premio en texto libre, cambiable por temporada. NFC, QR, Wallet en iOS/Android y WhatsApp son núcleo del piloto. Implantación, configuración inicial y formación a cargo de nuestro equipo. Detalle y límites en [[Requisitos confirmados]]. Víctor se propone a priori como primer comercio piloto; nombre comercial y datos del establecimiento pendientes.

## Problema que se propone resolver

Convertir visitas ocasionales en relaciones recurrentes y ayudar al comercio a evaluar si el beneficio adicional compensa el servicio.

## Usuarios propuestos

| Usuario | Recorrido |
| --- | --- |
| Cliente | Alta, consulta de tarjeta, acumulación de sellos y canje. |
| Empleado | Validación de visitas y canjes con pocos pasos. |
| Propietario | Programa, empleados, clientes, campañas e indicadores de su comercio. |

## Primera demo propuesta

Durante el desarrollo puede demostrarse un recorrido web parcial con datos ficticios. El piloto requiere tarjeta real en ambos Wallet, NFC y QR, WhatsApp, programa configurable y panel de actividad. Todo componente aún simulado debe identificarse como tal y no acredita el núcleo confirmado. Separación de comercios, permisos y consistencia de sellos/canjes forman parte del diseño inicial.

Los hitos están en [[Plan inicial]]. Bares y cafeterías ya están confirmados; precio, tecnología, reglas detalladas y ampliaciones adicionales siguen abiertos. Agenda básica propia apoyada en WhatsApp confirmada; disponibilidad y asignación automática de mesas fuera de este alcance.

## Reglas confirmadas de fidelización

Un sello por cuenta. Las tarjetas en curso pasan al premio estacional vigente; se sigue acumulando aunque existan recompensas pendientes. Caducidad configurable. Los premios ya ganados se conservan para canjear. Se confirma agenda propia básica con solicitudes WhatsApp y registro/confirmación del personal: ver [[Reglas de sellos y premios]].

## Medición

Separar registros, visitas, canjes y visitas vinculadas a campañas de visitas adicionales causadas por ellas. No prometer incremento de ingresos sin medirlo.
