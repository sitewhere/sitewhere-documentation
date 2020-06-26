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

## Kubernetes

SiteWhere está compuesto de microservicios basados ​​en Java que se construyen como
imágenes [Docker](https://www.docker.com/) y se desplieguan en Kubernetes para
orquestación. Para simplificar la implementación, se utiliza [Helm](https://helm.sh/) para
proporcionar plantillas estándar para varios escenarios de implementación. Los Helm
[charts](https://github.com/sitewhere/sitewhere-recipes/tree/master/charts)
suministran todas las dependencias necesarias para ejecutar una instancia de SiteWhere completa,
incluyendo tanto los microservicios y los componentes de infraestructura como Apache Zookeeper, 
Apache Kafka y Mosquitto MQTT broker.

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

## Gestión de instancias

La arquitectura 2.0 introduce el concepto de una instancia de SiteWhere, que
Permite que el sistema distribuido actúe como una unidad cohesiva con algunos aspectos.
A nivel global. Todos los microservicios para un solo SiteWhere
La instancia debe ejecutarse en la misma infraestructura de Kubernetes, aunque el sistema
Puede distribuirse entre decenas o cientos de máquinas para distribuir el procesamiento.
carga.

### Gestión de configuración centralizada con Apache ZooKeeper

SiteWhere 2.0 mueve la configuración del sistema a [Apache ZooKeeper](https://zookeeper.apache.org/)
lo que permite externalizar la gestión de la configuración.
hecho altamente disponible. ZooKeeper contiene un jerárquico
estructura que representa la configuración de una o más instancias de SiteWhere
y todos los microservicios que se utilizan para realizarlos.

Cada microservicio tiene una conexión directa a ZooKeeper y utiliza el
Jerarquía para determinar su configuración en tiempo de ejecución. Los microservicios escuchan los cambios.
A los datos de configuración y reaccionar dinámicamente a las actualizaciones. Sin configuracion
se almacena localmente dentro del microservicio, lo que evita problemas con
manteniendo los servicios sincronizados a medida que se actualiza la configuración del sistema.

### Almacenamiento distribuido con Rook.io

Dado que muchos de los componentes del sistema, como Zookeeper, Kafka y varios
las bases de datos requieren acceso a almacenamiento persistente, utiliza SiteWhere 2.0
[Rook.io](https://rook.io/) dentro de Kubernetes para suministrar distribuido,
almacenamiento de bloque replicado que es resistente a las fallas de hardware mientras
Todavía ofreciendo buenas características de rendimiento. Como almacenamiento y rendimiento.
las necesidades aumentan con el tiempo, los nuevos dispositivos de almacenamiento pueden estar disponibles
dinamicamente. La arquitectura subyacente [Ceph](https://ceph.com/)
utilizado por Rook.io puede manejar _exobytes_ de datos mientras permite datos
para ser resistente a las fallas a nivel de nodo, rack o incluso centro de datos.

## Canalización de procesamiento de datos de alto rendimiento

El proceso de procesamiento de eventos en SiteWhere 2.0 ha sido completamente rediseñado y utiliza
[Apache Kafka] (https://kafka.apache.org/) para proporcionar un rendimiento resistente y de alto rendimiento
Mecanismo para procesar progresivamente datos de eventos del dispositivo. Los microservicios pueden conectarse a
puntos clave en el proceso de procesamiento de eventos, lectura de datos de temas de entrada conocidos,
procesamiento de datos, luego envío de datos a temas salientes conocidos. Entes externos que
están interesados ​​en los datos que en cualquier punto de la tubería pueden actuar como consumidores del sitio
Temas para utilizar los datos a medida que se mueve a través del sistema.

### Procesamiento de tubería completamente asíncrono

En SiteWhere 2.0, cada conector de salida es un verdadero consumidor de Kafka con su propia compensación
marcador en la secuencia de eventos. Este mecanismo permite a los procesadores de salida procesar datos.
a su propio ritmo sin ralentizar a otros procesadores. También permite servicios a
aprovechar los grupos de consumidores de Kafka para distribuir la carga entre múltiples consumidores y
procesamiento de la escala en consecuencia.

::: propina
En la arquitectura de SiteWhere 1.x, la canalización para el procesamiento de salida utilizó un bloqueo
enfoque que significa que cualquier procesador de salida único podría bloquear la canalización de salida.
Esto ya no es un problema con la arquitectura 2.0.
:::

El uso de Kafka también tiene otras ventajas que son aprovechadas por SiteWhere. Dado que todos los datos para
El registro distribuido se almacena en el disco, es posible "reproducir" la secuencia de eventos basada
en datos previamente recopilados. Esto es extremadamente valioso para aspectos como la depuración.
Procesando lógica o carga probando el sistema.

## Conectividad de API persistente entre microservicios

Mientras que los datos de eventos del dispositivo generalmente fluyen en una tubería desde microservicio a microservicio en
Temas de Kafka, también hay operaciones de API que deben ocurrir en tiempo real entre los
microservicios Por ejemplo, la gestión de dispositivos y las funciones de gestión de eventos están contenidas en
microservicios separados, por lo que cuando entran nuevos eventos en el sistema, el microservicio de procesamiento de entrada
necesita interactuar con la administración de dispositivos para buscar dispositivos existentes en el sistema y en los eventos
Gestión para persistir los eventos a un almacén de datos como
[Apache Cassandra] (http://cassandra.apache.org/).

### Usando gRPC para un aumento de rendimiento

En lugar de utilizar únicamente los servicios REST basados ​​en HTTP 1.x, que tienden a tener una
sobrecarga de conexión, SiteWhere 2.0 utiliza [gRPC] (https://grpc.io/) para establecer una
Conexión entre microservicios que necesitan comunicarse entre sí. Desde que usa gRPC
conexiones HTTP2 persistentes, la sobrecarga de las interacciones se reduce considerablemente, lo que permite
para desacoplar sin una penalización de rendimiento significativa.

Todo el SiteWhere [modelo de datos] (https://github.com/sitewhere/sitewhere-java-api) se ha capturado en
Formato de [Google Protocol Buffers] (https://developers.google.com/protocol-buffers/) para que
Puede ser utilizado dentro de los servicios de GRPC. Todas las API de SiteWhere ahora se exponen directamente como
Los servicios gRPC también permiten un acceso de alto rendimiento y baja latencia a lo que anteriormente se
Solo accesible vía REST. Las API de REST todavía están disponibles a través del microservicio Web / REST,
pero utilizan las [gRPC API] (https://github.com/sitewhere/sitewhere-grpc-api) debajo de
para proporcionar un enfoque coherente para acceder a los datos.

Dado que la cantidad de instancias de un microservicio determinado puede cambiar con el tiempo a medida que el servicio es
escalada hacia arriba o hacia abajo, SiteWhere maneja automáticamente el proceso de conexión / desconexión de la
Tubos gRPC entre microservicios. Cada cliente gRPC saliente se descompone en el conjunto
de servicios que pueden satisfacer las solicitudes, permitiendo que las solicitudes se procesen en paralelo.

## Multipropiedad Distribuida

El enfoque de SiteWhere 1.x para la multitenencia consistió en utilizar un "motor de inquilino" separado para cada inquilino.
El motor admitía todas las tareas específicas del arrendatario, como la persistencia de datos, el procesamiento de eventos, etc.
Desde que SiteWhere 2.0 se ha movido a una arquitectura de microservicios, el modelo multitenant ha sido
distribuido también. SiteWhere admite dos tipos de microservicios: global y multitenant.

### Microservicios globales

Los microservicios globales no manejan tareas específicas del arrendatario. Estos servicios manejan aspectos tales
como la gestión de usuarios en toda la instancia y la gestión de inquilinos que no son específicas para individuos
inquilinos del sistema. El microservicio Web / REST que admite los servicios REST y el usuario Swagger
La interfaz también es un servicio global, ya que admite un contenedor web separado para cada inquilino
sería engorroso y rompería las aplicaciones existentes de SiteWhere 1.x. También hay una
microservicio de administración de instancias globales que controla varios aspectos de la instancia completa
e informes de actualizaciones a los microservicios individuales a través de Kafka.

### Microservicios Multitenant

La mayoría de los servicios de SiteWhere 2.0 son microservicios multitenant que delegan tráfico
a los motores de inquilinos que hacen el procesamiento real. Por ejemplo, el microservicio de procesamiento de entrada
en realidad consta de muchos motores inquilinos de procesamiento de entrada, cada uno de los cuales se configura por separado
y se puede iniciar / detener / reconfigurar sin afectar a los motores de otros inquilinos.

El nuevo enfoque de los motores de inquilinos cambia la dinámica del procesamiento de eventos de SiteWhere. Esto es ahora
es posible detener un solo motor inquilino sin la necesidad de detener los motores inquilinos que se ejecutan en
Otros microservicios. Por ejemplo, el procesamiento de entrada para un inquilino se puede detener
y reconfigurado mientras el resto de la tubería del inquilino continúa procesando. Desde nuevo
se puede permitir que los eventos se acumulen en Kafka, el motor del inquilino se puede detener, reconfigurar,
y reinicie, luego reanude donde lo dejó sin pérdida de datos.
