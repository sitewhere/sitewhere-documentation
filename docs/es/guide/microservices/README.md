# Guía de Microservicios

A continuación se muestra una lista de los microservicios principales de SiteWhere.
Cada servicio maneja un área específica de la funcionalidad del sistema y es independiente
de otros microservicios en términos de procesamiento en tiempo de ejecución, almacenamiento
de datos y configuración. Sin embargo, algunos microservicios tienen dependencias en las API
ofrecidas por otros servicios y no pueden ejecutarse de forma aislada. A continuación se
muestra una descripción general de alto nivel de los servicios individuales junto con enlaces
a explicaciones más detalladas de cada servicio.

[[toc]]

## Microservicios Globales

Los microservicios globales se utilizan para administrar aspectos de una instancia de SiteWhere que no se pueden configurar a nivel de inquilino.

### Gestión de instancias

El microservicio de administración de instancias se utiliza para iniciar una instancia de SiteWhere con
la estructura de configuración inicial de Zookeeper requerida por los otros microservicios.
Todos los demás microservicios esperan que los datos de Zookeeper se inicialicen antes
inicio, por lo que el microservicio de administración de instancias debe estar presente en un no inicializado
La instancia de SiteWhere o todos los demás microservicios no se iniciarán.

Consulte la [guía](instance-management.md) para obtener más detalles.

### Gestión de inquilinos

El microservicio de administración de inquilinos global proporciona las API principales y la persistencia de datos para
Gestión de los inquilinos del sistema. Es inicialmente utilizado por el microservicio de gestión de instancias.
para arrancar el sistema con inquilinos base. Posteriormente, es llamado por la web / REST.
microservicio para permitir la gestión de la lista de inquilinos del sistema.

Vea la [guía](tenant-management.md) para más detalles.

### Gestión de usuarios

El microservicio de administración de usuarios global proporciona las API principales y la persistencia de datos utilizada
para gestionar los usuarios del sistema. Es inicialmente utilizado por el microservicio de gestión de instancias.
para arrancar el sistema con usuarios base. Posteriormente, es llamado por la web / REST.
microservicio para permitir la gestión de la lista de usuarios.

Consulte la [guía](user-management.md) para obtener más detalles.

### Web/REST

El microservicio global Web / REST incluye un contenedor Tomcat incorporado que
proporciona infraestructura para todos los servicios REST principales, incluido el usuario Swagger
interfaces Este microservicio generalmente está conectado a todos los otros microservicios en el
sistema para que las llamadas a la API puedan delegarse a los microservicios que implementan
La funcionalidad. Por ejemplo, consultar un dispositivo a través de las API REST
da como resultado una solicitud de gRPC (potencialmente almacenada en caché) al apropiado
motor de inquilinos de administración de dispositivos en uno de los microservicios de administración de dispositivos.

Vea la [guía](web-rest.md) para más detalles.

## Microservicios Multitenant

Los microservicios multitenant pueden contener muchos motores de inquilinos separados que pueden ser
Configurados por separado y arrancados / parados independientemente unos de otros.

### Gestión de activos

El microservicio de gestión de activos multitenant proporciona las API principales y la persistencia de datos
para la gestión de activos para cada inquilino en una instancia de SiteWhere. El modelo de activo es inicialmente
Se rellena en función de los scripts incluidos en la plantilla de inquilino utilizada al crear el inquilino.
Por ejemplo, la plantilla "Construcción" rellena activos como equipos pesados, almacenamiento
remolques, y varios tipos de dispositivos de seguimiento. Si se usa la plantilla "Vacía", ningún activo
Los datos de gestión serán poblados.

Vea la [guía](asset-management.md) para más detalles.

### Operaciones por lotes

El microservicio de operaciones por lotes multitenant proporciona las API principales y la persistencia de datos
para administrar las operaciones por lotes para cada inquilino en una instancia de SiteWhere. Las operaciones por lotes
El modelo está vacío en la inicialización del inquilino, pero puede completarse invocando API que
producir operaciones por lotes (como invocaciones de comandos por lotes).

Vea la [guía](batch-operations.md) para más detalles.

### Entrega de comandos

El microservicio de entrega de comandos multitenant ingiere datos del tema Kafka que contiene
eventos preprocesados ​​y, para invocaciones de comandos, maneja el procesamiento de comandos. Esto incluye
utilizando restricciones de enrutamiento configuradas y destinos de comando que indican cómo el comando
se debe codificar, qué transporte se va a utilizar y dónde se debe entregar el comando.

Vea la [guía](command-delivery.md) para más detalles.

### Gestión de dispositivos

El microservicio de administración de dispositivos multitenant proporciona las API principales y la persistencia de datos
para administrar el modelo de dispositivo (clientes, áreas, tipos de dispositivos, dispositivos, etc.) para cada inquilino
en una instancia de SiteWhere. El modelo de dispositivo se rellena inicialmente según los scripts incluidos.
en la plantilla de inquilino utilizada al crear el inquilino. Por ejemplo, la plantilla "Construcción"
poblará el modelo de datos con dispositivos apropiados para un sitio de construcción. Si usa el
Plantilla "vacía", no se completarán los datos de administración del dispositivo.

Consulte la [guía](device-management.md) para obtener más detalles.

### Estado del dispositivo

El microservicio de estado de dispositivo multitenant ingiere datos del tema Kafka que contiene
pre-procesa eventos y utiliza los datos de eventos para actualizar el estado del dispositivo. El estado del dispositivo
el modelo conserva la ubicación, las medidas y las alertas más recientes para cada dispositivo como
así como información sobre cuándo ocurrió la última interacción con el dispositivo.

Vea la [guía](device-state.md) para más detalles.

### Registro del dispositivo

El microservicio de registro de dispositivos multitenant ingiere datos de un tema de Kafka
Rellenado por el microservicio de procesamiento de entrada y actúa en eventos donde el token del dispositivo
indica un dispositivo que no está registrado actualmente en el sistema. Cada motor inquilino tiene
un administrador de registro de dispositivos que puede configurarse para indicar cómo no se ha registrado
Los dispositivos deben ser tratados. El gestor de registro del dispositivo procesa cada entrada.
evento y potencialmente puede registrar el dispositivo automáticamente antes de agregar el evento
a un tema de re-procesamiento para que sea procesado por el microservicio de procesamiento de entrada.

Consulte la [guía] (device-registration.md) para obtener más detalles.

### Gestión de eventos

El microservicio de gestión de eventos multitenant proporciona las API principales y la persistencia de datos
para administrar eventos del dispositivo (ubicaciones, medidas, alertas, invocaciones de comandos, etc.) para
cada inquilino en una instancia de SiteWhere. El modelo de evento del dispositivo se rellena inicialmente basado en
los scripts incluidos en la plantilla del arrendatario que se utiliza al crear el arrendatario. Por ejemplo, el
La plantilla "Construcción" rellena el ejemplo de ubicación, medición y datos de alerta relevantes para
máquinas en una obra de construcción. Si usa la plantilla "Vacía", no hay datos de gestión de eventos
será poblada.

Vea la [guía] (event-management.md) para más detalles.

### Búsqueda de eventos

El microservicio de búsqueda de eventos multitenant proporciona una API para buscar fuentes de datos externas
que contienen información de eventos de SiteWhere en un formato no estándar. Por ejemplo, cuando los eventos
se indexan en Apache Solr a través de un conector de salida, puede ser necesario consultar Solr directamente
para realizar consultas facetadas complejas que no pueden ser soportadas genéricamente a través de las API de SiteWhere. los
los motores de inquilinos para este microservicio pueden configurarse para realizar consultas de proxy al servicio subyacente
y devuelva los resultados al microservicio Web / REST para uso de clientes externos.

Vea la [guía] (event-search.md) para más detalles.

### Orígenes de eventos

El microservicio de orígenes de eventos multitenant aloja motores de arrendamiento que pueden configurarse
Ingerir datos de muchos tipos de productores de datos. Algunos ejemplos incluyen el consumo de datos
desde temas de MQTT, solicitudes de CoAP, conexiones directas de socket TCP / IP, WebSockets, llamadas REST
A través de modelos push o pull, y muchas otras fuentes potenciales. Después de que los eventos son ingeridos,
se decodifican en un modelo de datos estandarizado y se envían a un Kafka específico del arrendatario
Tema para su posterior procesamiento. Los temas de Kafka también están registrados para eventos que no pueden
se analizarán o se detectarán como duplicados mediante el proceso de deduplicación.

Vea la [guía](event-sources.md) para más detalles.

### procesamiento de entrada

El microservicio de procesamiento entrante multitenant ingiere datos producidos por el
microservicio de orígenes de eventos (después de que se haya completado la decodificación y la deduplicación). Este microservicio
valida los datos entrantes al interactuar con el microservicio de administración de dispositivos para
verifique que el evento de entrada se relacione con un dispositivo registrado. La carga útil entrante se enriquece.
con datos de dispositivo / asignación para que la información pueda ser utilizada por pasos de procesamiento posteriores
Sin la necesidad de buscarlo de nuevo. Si el dispositivo no está registrado, la carga útil es
Pasado al microservicio de registro del dispositivo para un procesamiento adicional. Si el dispositivo se convierte
registrado como resultado, el evento se inserta en un tema de re-procesamiento para que pueda ser
procesado de nuevo con el dispositivo recién registrado.

Vea la [guía](inbound-processing.md) para más detalles.

### Generación de etiquetas

El microservicio de generación de etiquetas multitenant responde a solicitudes de API para recursos de etiquetas tales como
como códigos QR, códigos de barras o etiquetas personalizadas de dispositivos. Cada motor inquilino tiene una generación de símbolos.
administrador que puede personalizarse para generar tipos específicos de salida únicos para el inquilino.

Vea la [guía](label-generation.md) para más detalles.

### Conectores de salida

El microservicio de conectores de salida multitenant ingiere datos del tema Kafka que contiene
eventos preprocesados ​​y permite que los datos de eventos se envíen a otros puntos de integración
asíncrono. Cada conector de salida es un consumidor Kafka que tiene su propio puntero hacia
El tema de eventos, por lo que el sistema no está bloqueado por conectores que ocasionalmente se procesan en
Tasas más lentas que el resto del sistema. Los conectores están disponibles para casos de uso común, tales como
como reenviar eventos a un tema MQTT conocido o eventos de indexación en Apache Solr.

Vea la [guía](outbound-connectors.md) para más detalles.

### Procesamiento de reglas

El microservicio de procesamiento de reglas multitenant ingiere datos del tema Kafka que contiene
procesa previamente los eventos y aplica la lógica condicional para continuar procesando los eventos. Motores de alquiler
puede utilizar el procesamiento de eventos complejos (WSO2 Siddhi) para detectar patrones en el evento
Transmite y dispara nuevos eventos como resultado.

Consulte la [guía](rule-processing.md) para obtener más detalles.

### Gestión de horarios

El microservicio de administración de horarios multitenant proporciona las API principales y la persistencia de datos para administrar los cronogramas de cada inquilino en una instancia de SiteWhere. El modelo de programación se completa inicialmente en función de los scripts incluidos en la plantilla del arrendatario que se utiliza al crear el arrendatario. La mayoría de las plantillas de inquilinos incluyen algunos ejemplos de horarios Si se usa la plantilla "Vacía", no se completarán los datos de administración de la programación.

Vea la [guía](schedule-management.md) para más detalles.

### Streaming Media

El microservicio de medios de transmisión multitenant está destinado a permitir el almacenamiento de datos binarios, como las secuencias de audio y video. Esta característica está en desarrollo.

Vea la [guía](streaming-media.md) para más detalles.