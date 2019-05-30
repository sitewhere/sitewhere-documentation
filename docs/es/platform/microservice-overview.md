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
el módulo [sitewhere-microservice](https://github.com/sitewhere/sitewhere/tree/sitewhere-2.1.0/sitewhere-microservice)
del repositorio central de SiteWhere. Esta biblioteca incluye el código común utilizado
por los microservicios de SiteWhere, incluido el ciclo de vida del servicio, la configuración,
el registro, el descubrimiento del servicio, el rastreo distribuido y otras funcionalidades transversales.

### Aplicación Spring Boot

Los microservicios de SiteWhere se empaquetan como aplicaciones Spring Boot que utilizan una clase
base común [`MicroserviceApplication`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.1.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/MicroserviceApplication.java)
que estandariza el comportamiento de inicio/apagado del servicio. La aplicación envuelve una subclase de la instancia
de un [`Microservice`](https://github.com/sitewhere/sitewhere/blob/sitewhere-2.1.0/sitewhere-microservice/src/main/java/com/sitewhere/microservice/Microservice.java)
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

Para obtener una lista de los microservicios principales incluidos con SiteWhere
y guías detalladas para cada uno, consulte la sección
[guías de microservicios](/es/guide/microservices/).
