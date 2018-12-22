# SiteWhere como una Aplicación Twelve-Factor

En los últimos años, ha habido un fuerte impulso para pasar de las metodologías
más antiguas de entrega de software monolítico a un enfoque que admite aplicaciones ágiles,
portátiles y con capacidad para la nube que son fáciles de escalar.

El equipo [Heroku](https://www.heroku.com/) creó una lista de doce factores que consideraron
importantes en el movimiento hacia estos objetivos. Lanzaron un [sitio web](https://12factor.net/) que
describe los doce factores en detalle y da ejemplos de cómo construir, administrar,
y despliegue aplicaciones que se ajusten al enfoque. Las siguientes secciones discuten
cómo la arquitectura de SiteWhere y el proceso de implementación se alinean con los de un
aplicación de doce factores.

## I. Base de código

**"Una base de código rastreada en control de revisión, muchas implementaciones"**

SiteWhere utiliza un [repositorio de GitHub](https://github.com/sitewhere/sitewhere) para
versionar su código fuente. Cada microservicio está separado en su propio submódulo de
Gradle con código común insertado en bibliotecas que se incluyen como artefactos en el
proceso de compilación de Gradle. La misma base de código se usa en todos los tipos de
implementaciones.

## II. Dependencias

**"Declarar y aislar dependencias explícitamente"**

SiteWhere utiliza [Gradle](https://gradle.org/) para la administración de compilación y empaquetado
de cada microservicio en su propio submódulo. Los módulos contienen cada uno un script de construcción
de Gradle que define claramente las dependencias. No hay suposiciones sobre las herramientas que se
instalan en el sistema y ninguna biblioteca externa se empaqueta directamente en la base de código
de SiteWhere. Además, SiteWhere utiliza el plugin [Spring Platform](http://platform.spring.io/platform/)
Gradle y la lista de materiales (BOM) para garantizar que las versiones de la biblioteca utilizadas
funcionen juntas sin problemas.

## III. Configuración

**"Almacene la configuración en el entorno"**

SiteWhere administra la configuración del sistema mediante el uso de una combinación de
variables de entorno y el almacenamiento externalizado de Apache Zookeeper. Cuando se
inician los microservicios, muchos aspectos de su comportamiento se pueden controlar
a través de variables de entorno inyectadas por los scripts Docker Compose utilizados
para la orquestación.

## IV. Backing Services

**"Trate los backing servicios como recursos adjuntos"**

Todos los servicios de respaldo, como las bases de datos, los brokers y las conexiones
de proveedores en la nube, actúan como recursos adjuntos que pueden conectarse/desconectarse
haciendo que los cambios sean una configuración externalizada. SiteWhere admite el aislamiento
de la mayoría de los elementos de configuración en el nivel de tenant, al mismo tiempo que
permite que algunos elementos de configuración global (aún externos a la base de código)
se usen para simplificar las instalaciones grandes de múltiples usuarios. Cada componente
del sistema admite un ciclo de vida completo que le permite inicializarse/iniciarse/detenerse
independientemente de otros aspectos del sistema, de modo que el cambio de
configuración/recursos asociados para un inquilino no afecte el ciclo de vida de otros tenant activos.

## V. Construir, lanzar, correr

**"Estricta separación de las fases de contrucción y ejecución"**

En la fase de **construcción**, los scripts de compilación de Gradle incluidos se utilizan para
compilar y generar bibliotecas para los módulos. Una vez que el código para un lanzamiento se
considera completo, los scripts de Gradle se pueden usar para **liberar** el código envolviendo las
imágenes de Docker alrededor de los artefactos y empujando las imágenes resultantes en Docker Hub.
Independientemente de las fases de compilación y lanzamiento, Kubernetes y Helm se utilizan para
ejecutar los microservicios mediante la organización de un sistema distribuido a partir de las
imágenes publicadas.

## VI. Procesos

**"Execute the app as one or more stateless processes"**

Los microservicios de SiteWhere son completamente sin estado, ya que no almacenan ningún dato localmente,
excepto en casos de almacenamiento en caché a corto plazo. Cualquier dato persistente se almacena fuera
del microservicio en los servicios de persistencia y solo se accede a través de las API que eliminan las
dependencias directas del mecanismo de almacenamiento. Toda la configuración del sistema se almacena en
Zookeeper, que proporciona redundancia y alta disponibilidad. Los datos de configuración son extraídos
por el microservicio cuando se inician y se envían al microservicio si se actualizan externamente.

## VII. Enlace de puerto

**"Exporta servicios via Enlace de Puerto"**

Todos los servicios que requieren acceso a través de un puerto expuesto lo hacen aprovechando
los servicios de enlace de puertos de Kubernetes. Por ejemplo, el microservicio Web/REST utiliza
un contenedor Tomcat incorporado para servir los servicios REST y la interfaz Swagger.
El enlace del puerto es manejado por Helm/Kubernetes y se pasa al microservicio subyacente a
través de variables de entorno. En los casos en que los servicios de infraestructura deben estar
disponibles en puertos conocidos, Helm chart implementa tanto el servicio de infraestructura como
la configuración de los microservicios que dependen de él para que el sistema pueda autoensamblarse.

## VIII. Concurrencia

**"Escala via el modelo de procesos"**

Los microservicios de SiteWhere se distribuyen como imágenes de Docker, cada una de las cuales se
ejecuta dentro de su propio proceso y no tiene estado y se puede escalar a múltiples instancias
concurrentes. Usando Kubernetes/Helm, la cantidad de instancias de microservicios puede ampliarse
indefinidamente suponiendo que el cluster subyacente tiene recursos disponibles. A medida que se
agregan y eliminan instancias de microservicios, la administración de conectividad subyacente
multiplexa las operaciones de datos en todas las instancias disponibles para asegurar que el sistema
se adapte a las actualizaciones.

## IX. Desechable

**"Maximice la robustez con un inicio rápido y un apagado correcto"**

Los microservicios centrales están diseñados para comenzar rápidamente y morir con gracia.
El tiempo de inicio para un solo microservicio es generalmente de unos segundos y depende de
varios factores, como la conexión a los recursos necesarios. En general, las tareas de larga
ejecución se ejecutan en segundo plano como subprocesos separados para permitir que los servicios
se consideren en vivo lo antes posible. Cuando se apaga, todas las conexiones externas y los
recursos administrados se liberan en el orden correcto para asegurarse de que todo se cierre
de forma limpia.

## X. Paridad Dev/prod

**"Mantenga el desarrollo, staging y producción lo más similar posible"**

En general, debería haber poca o ninguna diferencia entre las implementaciones
locales y las implementaciones de producción en términos de configuración del sistema.
SiteWhere aprovecha a Kubernetes y Helm para hacer que la infraestructura y la
configuración de la implementación sean lo más sencillas posible, a la vez que siguen
siendo flexibles. Tecnologías como [Rook.io](https://rook.io/) permiten que las instalaciones
locales utilicen las mismas tecnologías que las implementaciones de gran producción.

## XI. Logs

**"Tratar registros como secuencias de eventos"**

Los microservicios de SiteWhere utilizan marcos de registro de Java básicos,
que escriben la salida en la salida estándar y en las secuencias de errores.
Las transmisiones son administradas automáticamente por Docker/Kubernetes y pueden
tener acceso a través de esas API. Además, la salida del registro está disponible
en un tópico de Apache Kafka para clientes externos que deseen procesar
la información de registro en tiempo real.

## XII. Procesos Administrativos

**"Ejecute tareas de administración/administración como procesos únicos"**

La mayoría de las tareas administrativas para una instancia de SiteWhere
están cubiertas por los propios componentes de la infraestructura o pueden
ejecutarse desde microservicios externos que se ejecutan dentro del mismo
entorno que la instancia.
