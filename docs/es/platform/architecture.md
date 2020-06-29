# Arquitectura del sistema

<Seo/>

SiteWhere ha sido diseñado desde cero para aprovechar lo último
Tecnologías para escalar eficientemente a las cargas esperadas en grandes proyecto de IoT.
En lugar de utilizar una arquitectura monolítica, SiteWhere promueve una arquitectura completamente
distribuida utilizando [Kubernetes](https://kubernetes.io/) como infraestructura y una variedad de
microservicios para construir el sistema. Este enfoque permite la personalización y escalar en un nivel más fino
para que el sistema se pueda adaptar a muchos casos posibles de uso de IoT. SiteWhere está construido con un
enfoque de framework utilizando API claramente definidas para que las nuevas tecnologías pueden integrarse
fácilmente a medida que evoluciona el ecosistema de IoT.

## Microservicios

Una _instancia_ de SiteWhere es un sistema distribuido compuesto de muchos microservicios,
cada uno de los cuales cumple una función específica y está completamente desacoplado de
Los otros servicios. Los microservicios utilizan un mecanismo de descubrimiento de servicios para
auto-ensamblar en un sistema de trabajo.

### Separación de intereses

Cada microservicio es una entidad completamente autónoma que tiene su
Esquema de configuración propio, componentes internos, persistencia de datos y
Interacciones con el pipeline de procesamiento de eventos. SiteWhere microservicios
se construyen sobre un marco de microservicio personalizado y se ejecutan por separado
Procesos [Spring Boot](https://projects.spring.io/spring-boot/), cada uno
contenido en su propia imagen [Docker](https://www.docker.com/).

Separar la lógica del sistema en microservicios permite las interacciones
Entre varias áreas del sistema para ser definido más claramente. Esta
La transición ha dado lugar a una forma más comprensible y mantenible
sistema y debe seguir pagando dividendos a medida que se agregan más características.

### Escala lo que necesitas. Deja fuera lo que no

La arquitectura de microservicio permite escalar áreas funcionales individuales del sistema.
Independientemente o se deja completamente fuera. En casos de uso donde el procesamiento REST tiende a
Si se trata de un cuello de botella, se pueden ejecutar múltiples microservicios REST al mismo tiempo para manejar la carga.
Por el contrario, servicios como la gestión de presencia que pueden no ser necesarios pueden dejarse
para que la potencia de procesamiento se pueda dedicar a otros aspectos del sistema.


## Kubernetes

SiteWhere está compuesto de microservicios basados ​​en Java que se construyen como
imágenes [Docker](https://www.docker.com/) y se desplieguan en Kubernetes para
orquestación. Para simplificar la implementación, se utiliza [Helm](https://helm.sh/) para
proporcionar plantillas estándar para varios escenarios de implementación. Los Helm
[charts](https://github.com/sitewhere/sitewhere-recipes/tree/master/charts)
suministran todas las dependencias necesarias para ejecutar una instancia de SiteWhere completa,
incluyendo tanto los microservicios y los componentes de infraestructura como Apache Zookeeper, 
Apache Kafka y Mosquitto MQTT broker.


## Tecnologías Centrales

Al implementar SiteWhere, la combinación de la infraestructura requerida para ejecutar 
el sistema y los microservicios que manejan el procesamiento se denominan instancia de SiteWhere. 
Se supone que toda la infraestructura y los microservicios para una instancia se ejecutan en el mismo 
clúster de Kubernetes, aunque el sistema puede extenderse a decenas o cientos de máquinas para distribuir 
la carga de procesamiento.

En lugar de reinventar la rueda, SiteWhere utiliza una serie de tecnologías comprobadas como 
parte de la infraestructura para su arquitectura de microservicios. Las siguientes tecnologías 
abordan problemas transversales que son comunes a todo el sistema de microservicios.

### Service Mesh con Istio

SiteWhere aprovecha Istio para proporcionar un service mesh para los microservicios del sistema. 
Esto permite que la plataforma se escale dinámicamente al tiempo que proporciona un gran control 
sobre cómo se enrutan los datos. Istio permite que se utilicen métodos modernos como canary testing 
y la inyección de fallas para proporcionar un sistema más robusto y tolerante a fallas. 
También permite un monitoreo y seguimiento detallados de los datos que fluyen entre microservicios.

### Gestión de configuración centralizada con Apache ZooKeeper

La configuración de SiteWhere se almacena en Apache ZooKeeper para permitir un enfoque escalable 
y externo a la gestión de la configuración. ZooKeeper contiene una estructura jerárquica que 
representa la configuración para una o más instancias de SiteWhere y todos los microservicios 
que se utilizan para realizarlas. La configuración se replica para una alta disponibilidad.

Cada microservicio tiene una conexión directa a ZooKeeper y utiliza el
Jerarquía para determinar su configuración en tiempo de ejecución. Los microservicios escuchan los cambios.
A los datos de configuración y reaccionar dinámicamente a las actualizaciones. Sin configuracion
se almacena localmente dentro del microservicio, lo que evita problemas con
manteniendo los servicios sincronizados a medida que se actualiza la configuración del sistema.

### Almacenamiento distribuido con Rook.io

Muchos componentes del sistema como Zookeeper, Kafka y varias
bases de datos requieren acceso al almacenamiento persistente que está disponible para todos
nodos en el clúster de Kubernetes. Esto proporciona resiliencia en casos donde
un nodo de Kubernetes falla y los pods se programan en otros nodos para restaurar
el sistema a un estado de ejecución. SiteWhere usa [Rook.io] (https://rook.io/)
para proporcionar un enfoque coherente para el almacenamiento escalable. Rook provee
almacenamiento de bloque replicado distribuido que es resiliente a fallas de hardware mientras
también ofrece buenas características de rendimiento. Como las necesidades de almacenamiento y rendimiento
aumentan con el tiempo, se pueden poner a disposición nuevos dispositivos de almacenamiento
dinamicamente. La arquitectura subyacente [Ceph] (https://ceph.com/)
utilizado por Rook.io puede manejar _exobytes_ de datos mientras permite datos
ser resiliente a fallas a nivel de nodo, rack o incluso datacenter.

## Canalización de procesamiento de datos de eventos

SiteWhere coordina el procesamiento de eventos del dispositivo organizando microservicios en
una tubería con cada microservicio que gestiona una etapa específica del proceso.
Este enfoque permite que los eventos se procesen de forma incremental y también permite
la carga de procesamiento se distribuirá a través del hardware y se escalará a un nivel más detallado.

La canalización de procesamiento de eventos utiliza [Apache Kafka] (https://kafka.apache.org/)
para proporcionar un mecanismo resiliente y de alto rendimiento para mover datos de eventos del dispositivo
entre los microservicios que conforman la tubería. Los microservicios se conectan
en los puntos clave de la tubería de procesamiento de eventos, leyendo datos de tópicos de entrada conocidos, 
procesando estos datos, luego envíando estos datos a tópicos salientes bien conocidos.
Entidades externas que están interesadas en datos en cualquier punto de la tubería
pueden actuar como consumidores de SiteWhere en los tópicos para consumir los datos a medida que se mueven
a través del sistema.

### Procesamiento de tubería completamente asíncrono

La tubería de procesamiento de eventos de SiteWhere aprovecha las construcciones de mensajes de Kafka para permitir
datos de eventos del dispositivo que se procesarán de forma asincrónica. Si un microservicio se apaga y no otro,
las réplicas están disponibles para procesar la carga, los datos se pondrán en cola hasta que arranque una réplica
y comience a procesar nuevamente. Esto actúa como una garantía contra la pérdida de datos, ya que los datos son siempre
respaldado por el almacenamiento de alto rendimiento de Kafka. Los microservicios de SiteWhere aprovechan el concepto grupo de consumidores de Kafka
para distribuir la carga entre múltiples consumidores y escalar el procesamiento en consecuencia.

El uso de Kafka también tiene otras ventajas que son aprovechadas por SiteWhere. Dado que todos los datos para
El registro distribuido se almacena en el disco, es posible "reproducir" la secuencia de eventos basada
en datos previamente recopilados. Esto es extremadamente valioso para aspectos como la depuración,
lógica de procesamiento o prueba de carga del sistema.

## Conectividad de API persistente entre microservicios

Mientras que los datos de eventos del dispositivo generalmente fluyen en una tubería desde microservicio a microservicio en
Temas de Kafka, también hay operaciones de API que deben ocurrir en tiempo real entre los
microservicios Por ejemplo, las funciones de gestión de dispositivos y gestión de eventos están 
contenidas en sus propios microservicios, pero son requeridos por muchos otros componentes del sistema. 
Muchos de los microservicios de SiteWhere ofrecen API a las que pueden acceder otros microservicios 
para soportar aspectos tales como almacenar datos persistentes o iniciar servicios específicos de microservicios.

### Usando gRPC para un aumento de rendimiento

En lugar de utilizar únicamente los servicios REST basados ​​en HTTP 1.x, que tienden a tener una
sobrecarga de conexión, SiteWhere utiliza [gRPC] (https://grpc.io/) para establecer una
Conexión entre microservicios que necesitan comunicarse entre sí. Desde que usa gRPC
conexiones HTTP2 persistentes, la sobrecarga de las interacciones se reduce considerablemente, lo que permite
para desacoplar sin una penalización de rendimiento significativa. Istio también permite 
que las conexiones gRPC se multiplexen en múltiples réplicas de un microservicio para escalar el procesamiento 
y ofrecer redundancia.

Todo el SiteWhere [modelo de datos] (https://github.com/sitewhere/sitewhere-java-api) se ha capturado en
Formato de [Google Protocol Buffers] (https://developers.google.com/protocol-buffers/) para que
pueda ser utilizado dentro de los servicios de GRPC. Todas las API de SiteWhere ahora se exponen directamente como
servicios gRPC también permiten un acceso de alto rendimiento y baja latencia a todas las funciones de la API. 
Las API REST todavía están disponibles a través del microservicio Web / REST,
pero utilizan las [gRPC API] (https://github.com/sitewhere/sitewhere-grpc-api) debajo
para proporcionar un enfoque coherente para acceder a los datos.


## Microservicios Multitenant

SiteWhere está diseñado para proyectos de IoT a gran escala que pueden involucrar a muchos inquilinos del sistema
compartir una sola instancia de SiteWhere. Una clave diferenciadora de SiteWhere en comparación con la mayoría
las plataformas IoT es que cada inquilino (tenant) se ejecuta de forma aislada de otros inquilinos. Por defecto, los inquilinos 
no comparten los recursos de la base de datos o el proceso de canalización y tienen una configuración de ciclo de vida completamente separado. 
Con este enfoque, cada inquilino puede usar su propia tecnología base de datos, integraciones externas y otras opciones de configuración. 
Partes del inquilino como la tubería de procesamiento puede reconfigurarse / reiniciarse sin causar una interrupción
a otros inquilinos.

### Privacidad de Datos

Una consecuencia importante de la forma en que SiteWhere maneja la multitenancy es que los datos de cada inquilino 
están separados de los datos de otros inquilinos. La mayoría de las plataformas que ofrecen multitenancy
almacenan datos para todos los inquilinos en tablas compartidas, diferenciadas solo por una identificación de inquilino. 
El enfoque compartido abre la posibilidad de que los datos de un inquilino corrompan a otro, lo que no es 
un riesgo aceptable en muchas implementaciones de IoT. Además, cada inquilino tiene sus propios canales de procesamiento,
por lo que los datos nunca se mezclan.

Tener recursos dedicados para los inquilinos puede ser costoso en términos de memoria y recursos de procesamiento, por lo que SiteWhere también ofrece el concepto de "clientes" dentro de cada inquilino.
Los clientes permiten que los datos se diferencien dentro de un inquilino, pero sin tener una base de datos y canalizaciones dedicadas por separado.
En los casos en que los datos colocados son aceptables, el inquilino puede tener cualquier número de clientes, que comparten la misma base de datos y canalización de procesamiento.
Esto permite lo mejor de ambos mundos en términos de seguridad y escalabilidad.
