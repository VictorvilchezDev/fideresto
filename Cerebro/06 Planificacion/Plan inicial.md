# Plan inicial

30 de octubre de 2026 · Propuesta de trabajo

## 1. Primer público

Comercios en España. Hipótesis inicial: cafeterías con compras frecuentes y una recompensa de coste asumible. El primer piloto puede empezar con un establecimiento y ampliarse cuando el funcionamiento esté comprobado.

## 2. Tres usuarios

| Usuario | Necesidad |
| --- | --- |
| Cliente | Registrarse con facilidad, consultar sellos y obtener una recompensa comprensible. |
| Empleado | Validar visitas y canjear premios con pocos pasos. |
| Propietario | Configurar el programa, consultar actividad y evaluar costes y resultados. |

## Seguridad y diseño antes de implementar

Seguir el protocolo de `AGENTS.md` y las notas del vault. Nexo es referencia del cerebro y la seguridad; la interfaz será propia. CristalWhite es una posibilidad por explorar. Definir límites de confianza, aislamiento de comercios, permisos y consistencia de visitas/canjes antes de escribir operaciones. Las cuentas del personal y su autorización no se aplazan por defecto hasta el piloto.

## 3. Hito A: demo del recorrido completo

Usar datos ficticios y presentar claramente las funciones simuladas.

- Página de registro y tarjeta digital accesible desde el navegador del móvil.
- Programa de sellos configurable; el número de visitas y el premio son ejemplos editables.
- Vista del empleado para registrar una visita y realizar un canje.
- Panel del propietario con registros, visitas, recompensas y clientes recurrentes.
- Vista de campañas de cumpleaños y recuperación, sin envío real.

### Criterios para revisar la demo

- Un cliente nuevo puede registrarse y abrir su tarjeta.
- Una visita validada por el empleado añade un único sello.
- Un QR público por sí solo no permite añadir sellos.
- Al alcanzar el objetivo se habilita una recompensa.
- Repetir una petición de canje no permite gastar dos veces la misma recompensa.
- El cliente ve el estado actualizado después de la operación.
- Los indicadores se calculan a partir de los registros de actividad.
- Las simulaciones de mensajes se distinguen de mensajes enviados.
- Las vistas principales son utilizables en móvil.

## 4. Hito B: piloto operativo

Preparar el piloto a partir de la experiencia con la demo:

- Elegir comercio, incentivo, número de sellos y reglas de canje.
- Verificar con usuarios reales de propietario y empleados los permisos diseñados e implementados desde el inicio.
- Aislar los datos de cada comercio y registrar quién valida visitas y canjes.
- Resolver duplicados, correcciones y recuperación de acceso.
- Preparar consentimiento de comunicaciones, baja y tratamiento de datos para el uso real en España.
- Configurar almacenamiento, copias de seguridad y recuperación.
- Integrar WhatsApp mediante su plataforma oficial, con límites de gasto y control de frecuencia.
- Incorporar tarjetas de Apple Wallet y Google Wallet, con acceso web alternativo.
- Probar altas, actualizaciones y canjes en iPhone y Android reales.
- Preparar el acceso por NFC como alternativa al QR y verificar el flujo con dispositivos compatibles.

La participación de Víctor será necesaria para elegir el comercio, revisar el funcionamiento y gestionar las cuentas de servicios externas que se requieran.

## 5. Hito C: validación comercial

- Acordar un precio de prueba y qué incluye, a partir de costes reales.
- Medir registros, visitas repetidas, canjes y bajas de comunicaciones.
- Registrar costes de premios, mensajería, soporte y funcionamiento del servicio.
- Recoger tiempo de uso e incidencias del personal.
- Distinguir visitas vinculadas a una campaña de visitas adicionales causadas por ella. Una comparación con un grupo sin campaña puede ayudar a estimar este último efecto.
- Confirmar si el propietario quiere seguir pagando al terminar el piloto.

## 6. Ampliaciones candidatas

Priorizar después de observar necesidades reales:

1. Referidos y recompensas por recomendación.
2. Campañas por comportamiento y límites de frecuencia.
3. Recompensas ajustadas al margen del comercio.
4. Varias sucursales y reglas de canje por establecimiento.
5. Integración con caja para registrar importes y reducir tareas manuales.
6. Reservas, pedidos e IA de apoyo para redactar campañas.

## 7. Decisiones pendientes

- Comercio piloto y persona responsable.
- Sector inicial definitivo.
- Presupuesto de servicios y disponibilidad de trabajo.
- Nombre comercial y dominio. Repositorio y pushes ya confirmados: `https://github.com/VictorvilchezDev/fideresto.git`.
- Tecnología y alojamiento, a elegir al concretar los requisitos de la demo.
- Recompensa, condiciones de obtención y costes.

## 8. Referencias técnicas ya consultadas

- Apple, actualización de tarjetas: https://developer.apple.com/documentation/WalletPasses/adding-a-web-service-to-update-passes
- Google, tarjetas de fidelidad: https://developers.google.com/wallet/retail/loyalty-cards
- WhatsApp, política de mensajería: https://business.whatsapp.com/policy
- WhatsApp, precios: https://whatsappbusiness.com/products/platform-pricing/?lang=en
- Google Maps, contenido y reseñas: https://support.google.com/contributionpolicy/answer/7400114?hl=es

El diseño de solicitudes de reseña debe permitir opiniones auténticas sin seleccionar únicamente a clientes satisfechos.
