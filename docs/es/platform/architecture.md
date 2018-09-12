# Arquitectura de SiteWhere

SiteWhere ha sido diseñado desde cero para aprovechar las últimas novedades
tecnologías para escalar de manera eficiente a las cargas esperadas en IoT grande
proyectos. En lugar de utilizar una arquitectura monolítica, SiteWhere abraza
un enfoque completamente distribuido utilizando microservicios para permitir escalar en el
nivel de componente para que el sistema se pueda adaptar al cliente
caso de uso El sistema se construye con un enfoque de marco usando claramente definido
API para que las nuevas tecnologías puedan integrarse fácilmente como ecosistema de IoT
evoluciona El resto de esta guía cubre las tecnologías centrales utilizadas por
SiteWhere y cómo encajan para construir un sistema integral.

## Microservicios

SiteWhere 2.0 presenta un enfoque arquitectónico muy diferente del que se utilizó
en la plataforma 1.x Si bien las API principales no se modifican en su mayoría, la implementación del sistema
ha pasado de un enfoque monolítico a uno basado en microservicios. Este enfoque
proporciona una serie de ventajas sobre la arquitectura anterior.

### Separación de intereses

Cada microservicio es una entidad completamente autónoma que tiene su
propio esquema de configuración único, componentes internos, persistencia de datos,
e interacciones con el canal de procesamiento de eventos. SiteWhere microservicios
se construyen sobre una estructura de microservicio personalizada y se ejecutan por separado
[Spring Boot] (https://projects.spring.io/spring-boot/) procesos, cada uno
contenido en su propia imagen [Docker] (https://www.docker.com/).

Separar la lógica del sistema en microservicios permite las interacciones
entre varias áreas del sistema para ser definido más claramente. Esta
transición ya ha resultado en una más comprensible y sostenible
sistema y debería seguir pagando dividendos a medida que se agregan más características.

### Escala lo que necesitas. Deje fuera lo que no hace

La arquitectura de microservicio permite escalar las áreas funcionales individuales del sistema
independientemente o se omite por completo. En casos de uso donde el procesamiento REST tiende a
ser un cuello de botella, múltiples microservicios REST se pueden ejecutar simultáneamente para manejar la carga.
Por el contrario, los servicios tales como la gestión de presencia que pueden no ser necesarios se pueden dejar
de modo que la potencia de procesamiento se pueda dedicar a otros aspectos del sistema.

## Instance Management

La arquitectura 2.0 introduce el concepto de SiteWhere _instance_, que
permite que el sistema distribuido actúe como una unidad cohesiva con algunos aspectos
dirigido a nivel global. Todos los microservicios para un único sitio donde
la instancia debe ejecutarse en la misma infraestructura Docker, aunque el sistema
puede distribuirse en decenas o cientos de máquinas usando tecnologías tales como
[Docker Swarm] (https://github.com/docker/swarm) o [Kubernetes] (https://kubernetes.io/).

## Configuration Management con Apache ZooKeeper

SiteWhere 2.0 mueve la configuración del sistema desde el sistema de archivos a
[Apache ZooKeeper] (https://zookeeper.apache.org/) para permitir una centralización
enfoque a la gestión de la configuración. ZooKeeper contiene una estructura jerárquica
que representa la configuración para una o más instancias de SiteWhere
y todos los microservicios que se usan para realizarlos.

Cada microservicio tiene una conexión directa con ZooKeeper y usa el
jerarquía para determinar su configuración en tiempo de ejecución. Los microservicios escuchan los cambios
a los datos de configuración y reaccionan dinámicamente a las actualizaciones. Sin configuración
se almacena localmente dentro del microservicio, lo que evita problemas con
mantener los servicios sincronizados a medida que se actualiza la configuración del sistema.

## Procesamiento de eventos con Apache Kafka

El canal de procesamiento de eventos en SiteWhere 2.0 ha sido completamente rediseñado y utiliza
[Apache Kafka] (https://kafka.apache.org/) para proporcionar un rendimiento resistente y de alto rendimiento
mecanismo para procesar progresivamente datos de eventos del dispositivo. Cada microservicio se conecta a
puntos clave en el proceso de procesamiento de eventos, leyendo datos de temas entrantes conocidos,
procesar datos y luego enviar datos a temas salientes conocidos. Entidades externas que
están interesados ​​en los datos en cualquier punto de la tubería pueden actuar como consumidores del Sitio donde
temas para usar los datos mientras se mueve a través del sistema.

En la arquitectura SiteWhere 1.x, la canalización para el proceso de salida utilizó un bloqueo
enfoque que significaba que cualquier procesador de salida solo podría bloquear la tubería de salida.
En SiteWhere 2.0, cada conector de salida es un verdadero consumidor de Kafka con su propia compensación
marcador en la secuencia del evento. Este mecanismo permite que los procesadores de salida procesen datos
a su propio ritmo sin ralentizar a otros procesadores.

Usar Kafka también tiene otras ventajas aprovechadas por SiteWhere. Dado que todos los datos para
el registro distribuido se almacena en el disco, es posible "reproducir" el flujo de eventos
en datos recolectados previamente. Esto es extremadamente valioso para aspectos como la depuración
lógica de procesamiento o prueba de carga del sistema.

## Comunicación entre microservicios con GRPC

Mientras que los datos de evento del dispositivo generalmente fluyen en una tubería desde microservicio a microservidor