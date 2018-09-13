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

::: warning ADVERTENCIA
Este documento todavía es un trabajo en progreso
:::

## VI. Procesos

**"Execute the app as one or more stateless processes"**

::: warning ADVERTENCIA
Este documento todavía es un trabajo en progreso
:::

## VII. Enlace de puerto

**"Exporta servicios via Enlace de Puerto"**

## VIII. Concurrencia

**"Escala via el modelo de procesos"**

## IX. Desechable

**"Maximice la robustez con un inicio rápido y un apagado correcto"**

## X. Paridad Dev/prod

**"Mantenga el desarrollo, staging y producción lo más similar posible"**

## XI. Logs

**"Tratar registros como secuencias de eventos"**

## XII. Procesos Administrativos

**"Ejecute tareas de administración/administración como procesos únicos"**