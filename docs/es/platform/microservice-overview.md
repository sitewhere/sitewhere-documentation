# Descripción de los Microservicios

Una instancia de SiteWhere consta de muchos microservicios, cada uno de los cuales maneja una
pieza específica de funcionalidad. Tras el despliegue, los microservicios se organizan en un
sistema distribuido sobre la infraestructura de Kubernetes. Se utiliza un _Helm chart_ para
configurar la lista de microservicios de SiteWhere y otros componentes que deben iniciarse
para realizar una configuración determinada. Una vez iniciados, los microservicios se
autoensamblan y luego se ponen a disposición de las tareas de procesamiento.

<InlineImage src="/images/platform/microservices-diagram.png" caption="Microservices"/>

## Estructura de Microservicios

Todos los microservicios de SiteWhere se basan en una biblioteca personalizada definida en
el módulo [sitewhere-microservice](https://github.com/sitewhere/sitewhere/tree/sitewhere-2.0.0/sitewhere-microservice)
del repositorio central de SiteWhere. Esta biblioteca incluye el código común utilizado
por los microservicios de SiteWhere, incluido el ciclo de vida del servicio, la configuración,
el registro, el descubrimiento del servicio, el rastreo distribuido y otras funcionalidades transversales.

### Aplicación Spring Boot

Los microservicios de SiteWhere se empaquetan como aplicaciones Spring Boot que utilizan una clase
base común [`MicroserviceApplication`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.0.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/MicroserviceApplication.java)
que estandariza el comportamiento de inicio/apagado del servicio. La aplicación envuelve una subclase de la instancia
de un [`Microservice`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.0.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/Microservice.java)
que implementa gran parte del comportamiento común, como el ciclo de vida del microservicio, el descubrimiento del servicio,
los servicios Kafka y gRPC comunes, así como enlaces para los comportamientos del ciclo de vida estándar.
Las subclases de microservicio utilizan los distintos ganchos (_hooks_) para personalizar el ciclo de vida y agregar nuevas funcionalidades.

La biblioteca de microservicios de SiteWhere utiliza la configuración del entorno Spring Boot para configurar
diversos aspectos de cada microservicio. La configuración puede sobreescribirse inyectando variables de entorno
al desplegar los microservicios. El _Helm chart_ predeterminado para SiteWhere lo maneja de forma transparente,
pero puede haber casos en que los valores deban ser sobrescritos manualmente. La siguiente tabla cubre la lista
de configuraciones de entorno estándar de toda la instancia:

| Configuración                     | Por defecto    | Descripción                                                                   |
| :-------------------------------- | :------------- | :---------------------------------------------------------------------------- |
| sitewhere.product.id              | sitewhere      | Nombre del nodo de nivel superior en el árbol Zookeeper.                      |
| sitewhere.instance.id             | sitewhere1     | Nombre de instancia utilizado en Zookeeper y Kafka nombre del _topic_.        |
| sitewhere.instance.template.id    | default        | Plantilla de gestión de instancias utilizada para inicializar inquilinos y usuarios del sistema. |
| sitewhere.consul.host             | consul         | Nombre de host usado para contactar a Consul para el descubrimiento del servicio. |
| sitewhere.consul.port             | 8080           | Puerto usado para contactar al Cónsul para el descubrimiento del servicio.    |
| sitewhere.zookeeper.host          | localhost      | Nombre de host usado para contactar a Zookeeper para la configuración.        |
| sitewhere.zookeeper.port          | 2181           | Puerto utilizado para contactar con Zookeeper para la configuración.          |
| sitewhere.kafka.bootstrap.servers | kafka:9092     | Lista de servidores Kafka de inicio.                                          |
| sitewhere.filesystem.storage.root | /var/sitewhere | Raíz del sistema de archivos para microservicios que persisten los datos localmente para el almacenamiento en caché. |
| sitewhere.grpc.port               | 9000           | Puerto utilizado para exponer API gRPC específicas de microservicio.          |
| sitewhere.management.grpc.port    | 9001           | Puerto utilizado para exponer la interfaz de gestión gRPC.                    |
| sitewhere.tracer.server           | jaeger         | Nombre de host utilizado para publicar la salida de seguimiento distribuido.  |
| sitewhere.log.metrics             | false          | Indica si las métricas deben registrarse para el microservicio.               |
| sitewhere.k8s.pod.ip              | null           | Inyectado para que el microservicio sepa su IP de pod Kubernetes.             |

### Imagen Base de Docker

Todos los microservicios de SiteWhere se construyen sobre la misma imagen base de Docker para reducir
la sobrecarga de tiempo de ejecución de las imágenes. La imagen `openjdk: 8-jre-alpine` se usa actualmente
debido a su pequeña huella que incluye el _runtime_ de Java 8 necesario para ejecutar las aplicaciones.
Hay planes futuros para aprovechar las características de Java 9 para reducir aún más los tamaños de imagen
y los requisitos de tiempo de ejecución para los microservicios.

### Utilización de Recursos del Sistema

Actualmente, SiteWhere utiliza alrededor de 20 microservicios, por lo que el hardware subyacente debe ser
compatible con la ejecución de 20 procesos Java simultáneos, cada uno con una huella de memorua de alrededor
de 500 MB. Los requisitos son significativos, aunque la mayoría de las computadoras de escritorio modernas
pueden ejecutar fácilmente un sistema completo. El _Helm Chart_ de SiteWhere Helm incluye un perfil `mínimo`
que solo carga los microservicios necesarios para reducir los requisitos de recursos. Sin embargo,
la intención de SiteWhere 2.0 es distribuir los componentes del sistema en un grupo de máquinas,
lo que reduce los requisitos de hardware para un solo nodo y aumenta la tolerancia a fallos.

## Conectividad Intra-Microservicios

Los microservicios no funcionan en un vacío y, como tal, se necesita un mecanismo RPC de alto
rendimiento para permitir que los servicios se comuniquen. SiteWhere aprovecha [gRPC](https://grpc.io/)
para mover datos entre microservicios y ofrece API binarias de rendimiento para consumidores externos.
Todas las llamadas a la API y las entidades de datos se han puesto a disposición de gRPC a través de Google
_Protocol Buffers_. Usar gRPC en lugar de REST para la comunicación puede aumentar el rendimiento de la API en más de 10x.

### Demultiplexores de API

Las conexiones entre microservicios no siempre son uno a uno. Por ejemplo, si una instancia de SiteWhere tiene un solo
microservicio Web/REST y tres instancias del microservicio de gestión de dispositivos, el microservicio de REST debería
ser capaz de demultiplexar llamadas en las tres instancias de gestión de dispositivos para la escalabilidad y la
tolerancia a fallos. SiteWhere 2.0 introduce el concepto de un demulitplexor de API que puede realizar una
introspección de la topología de instancia actual y agregar/eliminar conexiones a otros microservicios
de forma dinámica. A medida que la cantidad de servicios aumenta o disminuye, SiteWhere conecta/desconecta
automáticamente la tubería entre ellos. Toda la comunicación entre microservicios ocurre a través de este mecanismo.

### Soporte API Cache

Incluso con el alto rendimiento de gRPC, solicitar un uso frecuente de datos repetidamente a través de la
conexión de red tiene un costo significativo. La información maestra para entidades como dispositivos,
asignaciones y activos rara vez se actualiza y puede almacenarse localmente en el microservicio en
lugar de incurrir en el costo de la lectura de la base de datos. SiteWhere 2.0 utiliza un [ehCache](https://www.ehcache.org/)
para proporcionar un caché local de un subconjunto de datos maestros. Este caché se consulta antes de
recurrir a una solicitud gRPC remota.

## Components de la Infraestructura

Los microservicios de SiteWhere hacen algunas suposiciones sobre la infraestructura subyacente en la que se ejecutan.
Como mínimo, las instancias de [Apache ZooKeeper](https://zookeeper.apache.org/), [Apache Kafka](https://kafka.apache.org/)
y [Hashicorp Consul](https://www.consul.io/) deben estar disponible para que el sistema funcione correctamente.
De forma predeterminada, SiteWhere también produce datos de seguimiento distribuidos a través del estándar
[OpenTracing](http://opentracing.io/) para el análisis del rendimiento en tiempo de ejecución.
Un servidor backend que soporta la API puede configurarse para almacenar y analizar los datos.

## Lista de Princiaples Microservicios

A continuación se muestra una lista de los microservicios principales incluidos
en SiteWhere 2.0. Cada servicio maneja un área específica de la funcionalidad
del sistema y es independiente de otros microservicios en términos de procesamiento
de tiempo de ejecución, almacenamiento y configuración de datos. Sin embargo,
algunos microservicios tienen dependencias en las API que ofrecen otros servicios
y no pueden ejecutarse de forma aislada. A continuación hay una descripción
general de alto nivel de los servicios individuales junto con enlaces a explicaciones
más detalladas de cada servicio.

### Instance Management

El microservicio de gestión de instancias (_instance management_) se utiliza para iniciar una instancia
de SiteWhere con la estructura de configuración inicial de Zookeeper requerida
por los otros microservicios. Todos los demás microservicios esperan a que se
inicialicen los datos de Zookeeper antes de comenzar, por lo que el microservicio
de gestión de instancias debe estar presente en una instancia de SiteWhere no
iniciada o todos los demás microservicios no podrán iniciarse.

Consulte la [guía](../guide/microservices/instance-management.md) de gestión de instancias
para más detalles.

### User Management

El microservicio de administración de usuarios (_user management_) global proporciona las API principales
y la persistencia de datos utilizada para administrar usuarios del sistema.
Inicialmente es utilizado por el microservicio de gestión de instancias (_instance management_)
para arrancar el sistema con los usuarios base. Posteriormente, el servicio Web/REST
lo llama para permitir que se administre la lista de usuarios.

### Tenant Management

El microservicio gobal de administración de _tenants_ (_tenant management_) proporciona
las API centrales y la persistencia de datos para administrar a los tenants del sistema.
Inicialmente, el microservicio de gestión de instancias lo utiliza para iniciar el sistema con los
tenants base. Posteriormente, el microservicio Web/REST lo llama para permitir que se administre
la lista de tenants del sistema.

Cuando se agrega/actualiza/borra un tenant, los datos del tenant se envían a un _topic_ de Kafka
para que otros oyentes interesados ​​puedan actuar sobre la actualización. De forma predeterminada,
un oyente se registra para impulsar a los tenants recién creados al agregar la jerarquía de
configuración de tenant esperada en ZooKeeper. Este proceso incluye copiar los archivos de
configuración XML por microservicio de la plantilla de tenant en ZooKeeper, y luego ejecutar
la lista de scripts de inicialización incluidos con la plantilla. Una vez que se completa este proceso,
la configuración del tenant se marca como boostrapped para que otros microservicios puedan reaccionar
ante el tenant adicional. Por ejemplo, el servicio de microservicio de administración de dispositivos
notará que se ha configurado un nuevo tenant y esperará el indicador bootstrapped, luego cargará el
rchivo de configuración device-management.xml para inicializar un nuevo motor de tenants de
administración de dispositivos para el tenant adicional. Cada vez que se modifican los archivos
dentro de un tenant, los cambios se transmiten a motores tenants que se ejecutan en todos los otros
microservicios para que puedan reaccionar a los cambios. En el ejemplo anterior, si se ejecutan varios
microservicios de gestión de dispositivos (escala > 1), cada microservicio detectará las actualizaciones
y volverá a cargar los motores de tenants para reflejar las actualizaciones.

### Web/REST

El microservicio Web/REST global incluye un contenedor Tomcat que proporciona infraestructura
para todos los servicios REST básicos (incluidas las interfaces de usuario de Swagger).
Este microservicio generalmente está conectado a todos los demás microservicios en el
sistema, de modo que las llamadas API pueden delegarse a los microservicios que implementan
la funcionalidad. Por ejemplo, consultar un dispositivo a través de las API REST da como
resultado una solicitud gRPC (potencialmente almacenada en caché a través de Hazelcast)
en el motor de inquilino de gestión de dispositivos apropiado en uno de los microservicios de
gestión de dispositivos.

Puede haber casos donde el microservicio requerido para completar una solicitud no está disponible.
En este caso, se lanza una excepción _ServiceNotAvailable_ y se devuelve como un error al
usuario/aplicación que realizó la solicitud. Usando este enfoque, las áreas del sistema pueden
cerrarse para conservar recursos sin afectar la funcionalidad del sistema en su conjunto.
Las personas que llaman a los servicios REST deben estar preparadas para manejar los casos
en los que el subsistema que están llamando se cierre.

### Device Management

El microservicio de administración de dispositivos multitenant (_device management_) proporciona las API principales
y la persistencia de datos para administrar el modelo de dispositivo (sitios, especificaciones,
dispositivos, grupos, etc.) para cada inquilino en una instancia de SiteWhere. El modelo de dispositivo
se llena inicialmente en base a los scripts incluidos en la plantilla de inquilino utilizada al crear el
tenant. Por ejemplo, la plantilla "Construcción" rellenará el modelo de datos con dispositivos apropiados
para un sitio de construcción. Si usa la plantilla "Vacío", no se completarán los datos de gestión del dispositivo.

### Event Management

El microservicio de administración de eventos multitenant (_event management_) proporciona
las API centrales y la persistencia de datos para administrar eventos de dispositivos
(ubicaciones, mediciones, alertas, invocaciones de comandos, etc.) para cada tenant en
una instancia de SiteWhere. El modelo de evento del dispositivo se llena inicialmente
en función de los scripts incluidos en la plantilla de inquilino utilizada al crear el tenant.
Por ejemplo, la plantilla "Construcción" rellena ejemplos de ubicación, medición y datos de alerta
relevantes para máquinas en un sitio de construcción. Si utiliza la plantilla "Vacío", no se completarán
los datos de gestión de eventos.

### Asset Management

El microservicio de administración de activos multitenant (_asset management_) proporciona
las API centrales y la persistencia de los datos para administrar los activos de cada tenant
en una instancia de SiteWhere. El modelo de activos se rellena inicialmente en función de
los scripts incluidos en la plantilla de inquilino utilizada al crear el tenant. Por ejemplo,
la plantilla "Construcción" rellena elementos tales como equipos pesados, remolques de almacenamiento
y varios tipos de dispositivos de seguimiento. Si usa la plantilla "Vaciar", no se completarán 
datos de gestión de activos.

### Schedule Management

El microservicio de administración de cronograma multitenant (_schedule management_) proporciona
las API principales y la persistencia de datos para administrar las planificaciones de cada tenant
en una instancia de SiteWhere. El modelo de cronograma se llena inicialmente en base a los scripts
incluidos en la plantilla de inquilino utilizada al crear el tenant. La mayoría de las plantillas de
tenants incluyen algunos horarios de ejemplo. Si usa la plantilla "Vaciar", no se completarán los
datos de gestión de programación.

### Batch Operations

El microservicio de operaciones batch multitenant (_batch operations_) proporciona las API principales
y la persistencia de datos para administrar las operaciones por lotes para cada tenant en una instancia
de SiteWhere. El modelo de operaciones por lotes está vacío en la inicialización del tenant, pero puede
completarse invocando las API que producen operaciones por lotes (como invocaciones de comandos por lotes).

Cada motor de tenant de operaciones por lotes también contiene un administrador de operaciones por
lotes que puede configurarse para procesar las operaciones por lotes que se crean a través de las API.
El administrador de operaciones por lotes convertirá la solicitud del lote en muchas operaciones más
pequeñas para lograr el objetivo del lote.

### Event Sources

El microservicio de fuentes de eventos multitenant (_event sources_) aloja motores de tenants
que pueden configurarse para ingerir datos de muchos tipos de productores de datos.
Algunos ejemplos incluyen consumir datos de temas MQTT, solicitudes CoAP, conexiones directas de socket
TCP/IP, WebSockets, llamadas REST a través de modelos push o pull y muchas otras fuentes potenciales.
Después de ingerir los eventos, se decodifican en un modelo de datos estandarizado y se envían a un
topic de Kafka específico del tenant para su posterior procesamiento. Los topics de Kafka también se
registran para eventos que no se pueden analizar o se detectan como duplicados mediante el
procesamiento de deduplicación.

### Inbound Processing

El microservicio de procesamiento entrante multitenant (_inbound processing_) ingesta datos
producidos por el microservicio de fuentes de eventos (después de que la decodificación y
deduplicación se hayan completado). Este microservicio valida los datos entrantes al
interactuar con el servicio de microservicio de administración de dispositivos para verificar
que el evento entrante se relaciona con un dispositivo registrado. La carga útil entrante se
enriquece con los datos del dispositivo/asignación, por lo que la información puede ser
utilizada por pasos de procesamiento posteriores sin necesidad de volver a buscarla.
Si el dispositivo no está registrado, la carga se pasa al microservicio de registro del dispositivo
para un procesamiento adicional. Si el dispositivo se registra como resultado, el evento se inserta
en un topic de reprocesamiento para que pueda procesarse nuevamente con el dispositivo recién registrado.

Una vez que el evento entrante se ha enriquecido, se reenvía al microservicio de gestión de eventos
para su persistencia. El evento persistente se devuelve (asincrónicamente) eventualmente al procesamiento
entrante donde se agrega a un topic para eventos preprocesados ​​que a su vez pueden ser consumidos por otros
microservicios, tales como el procesamiento de reglas y los conectores salientes.

### Device Registration

El microservicio de registro de dispositivos multitenant (_device registration_)
ingiere datos de un topic de Kafka poblado por el microservicio de procesamiento de
entrada cuando los eventos hacen referencia a una identificación del dispositivo (_deviceToken_)
para un dispositivo que no está actualmente registrado en el sistema. Cada motor de inquilino
tiene un administrador de registro de dispositivo que puede configurarse para indicar
cómo se tratarán los dispositivos no registrados. El administrador de registro del dispositivo
procesa cada evento entrante y puede potencialmente registrar el dispositivo automáticamente
antes de agregar el evento a un topic de reprocesamiento para que lo procese el microservicio
de procesamiento de entrada.

Los eventos que no dan como resultado el registro automático de un dispositivo son llevados a
un topic de "letra muerta" en Kafka para que los procesadores externos puedan rastrearlos 
o procesarlos fuera de banda.

### Rule Processing

El microservicio de procesamiento de reglas multitenant (_rule processing_) ingiere datos del topic
de Kafka que contienen eventos preprocesados y aplica la lógica condicional para seguir procesando los eventos.
Los motores de tenants pueden usar el procesamiento de eventos complejos integrado (WSO2 Siddhi) para
detectar patrones en la secuencia de eventos y generar nuevos eventos como resultado.

::: warning ADVERTENCIA
Este microservicio no está completamente implementado en 2.0
:::

### Command Delivery

El servicio de microservicio de entrega de comandos multitenant (_command delivery_) ingiere
datos del topic de Kafka que contienen eventos preprocesados y, para invocaciones de comandos,
maneja el procesamiento de comandos. Esto incluye el uso de restricciones de enrutamiento configuradas
y destinos de comando que indican cómo se codificará el comando, qué transporte se utilizará
y dónde se entregará el comando.

### Outbound Connectors

El microservicio de conectores de salida multitenant (_outbound connectors_) ingesta datos del topic
de Kafka que contienen eventos preprocesados ​​y permite que los datos del evento se reenvíen a otros
puntos de integración de forma asincrónica. Cada conector de salida es un consumidor de Kafka que tiene
su propio puntero en el topic de los eventos, por lo que el sistema no está bloqueado por conectores
que ocasionalmente procesan a tasas más lentas que el resto del sistema. Los conectores están
disponibles para casos de uso común, como el reenvío de eventos a un topic bien conocido de MQTT o
eventos de indexación en Apache Solr.

### Presence Management

El microservicio de gestión de presencia multitenant (_presence management_) ingiere datos del topic
de Kafka que contienen eventos preprocesados ​​y utiliza los datos de eventos para actualizar el estado
de presencia del dispositivo. Cada motor de inquilino tiene un administrador de presencia de
dispositivo que es responsable de determinar cuándo los dispositivos ya no están presentes y de
activar eventos de cambio de estado que pueden usarse para desencadenar acciones basadas en la
presencia o no presencia de un dispositivo.

### Label Generation

El microservicio de generación de etiquetas multitenant (_label generation_) responde a las
solicitudes API de recursos de etiquetas, como códigos QR, códigos de barras o etiquetas de
dispositivos personalizados. Cada motor de inquilino tiene un administrador de generación de
símbolos que puede personalizarse para generar tipos específicos de resultados únicos para el inquilino.

### Event Search

El microservicio de búsqueda de eventos multitenant (_event search_) proporciona una API para
buscar fuentes de datos externas que contienen información de eventos de SiteWhere en un formato
no estándar. Por ejemplo, cuando los eventos se indexan en Apache Solr a través de un conector de salida,
puede haber una necesidad de consultar Solr directamente para hacer consultas complejas facetadas
que no pueden ser genéricamente compatibles a través de las API de SiteWhere. Los motores de inquilino
para este microservicio pueden configurarse para enviar consultas proxy al servicio subyacente y 
devolver los resultados al servicio de microservicio Web/REST para que los usen los clientes externos.

### Streaming Media

El microservicio de transmisión multimedia multitenant (_streaming media_) está diseñado para
permitir el almacenamiento en tiempo real de datos binarios, como transmisiones de audio y video.
Algunas API básicas para la transmisión estaban disponibles en SiteWhere 1.x, pero no estaban
documentadas ni se consideraban de calidad de producción. SiteWhere 2.0 formalizará las API de
medios de transmisión, aunque la integración con varias tecnologías de codificación/decodificación
puede extenderse más allá del ciclo de publicación de 2.0 GA.
